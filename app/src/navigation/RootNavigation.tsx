import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-toast-message';

import Bottom_Tab from './Bottom_Tab';
import SplashScreen from '../common/SplashScreen';
import Profile from '../pages/Profile';
import LoginSignupScreen from '../pages/LoginSignupScreen';
import Quiz from '../pages/Quiz';
import Result from '../pages/Result';
import Header from '../component/Header';
import Loader from '../component/Loader';
import {useAppSelector, useAppDispatch} from '../redux/store';
import {setInitialUserDetails} from '../redux/userSlice';
import {getItem} from '../common/AsyncStorage';

const Stack = createStackNavigator();

const AuthStack = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{headerShown: false}}>
    <Stack.Screen name="Login" component={LoginSignupScreen} />
    <Stack.Screen name="Splash" component={Splash} />
  </Stack.Navigator>
);

const MainStack = () => (
  <Stack.Navigator
    initialRouteName="Splash"
    screenOptions={{
      // gestureEnabled: true,
      cardStyleInterpolator: ({current, layouts}) => ({
        cardStyle: {
          transform: [
            {
              translateX: current.progress.interpolate({
                inputRange: [0, 1],
                outputRange: [layouts.screen.width, 0],
              }),
            },
          ],
        },
      }),
    }}>
    <Stack.Screen
      name="Splash"
      options={{headerShown: false}}
      component={Splash}
    />
    <Stack.Screen
      name="Main"
      component={Bottom_Tab}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="Profile"
      component={Profile}
      options={{header: () => <Header title="Profile" />}}
    />
    <Stack.Screen
      name="Quiz"
      component={Quiz}
      options={{header: () => <Header title="Quiz" />}}
    />
    <Stack.Screen
      name="Result"
      component={Result}
      options={{header: () => <Header title="Result" />}}
    />
  </Stack.Navigator>
);

const Splash = ({navigation}: any) => {
  const dispatch = useAppDispatch();
  const [isLoggedIn, setIsLoggedIn] = React.useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await getItem('userDetails');
        if (user) {
          dispatch(setInitialUserDetails(user));
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, [dispatch]);

  useEffect(() => {
    if (isLoggedIn !== null) {
      setTimeout(() => {
        navigation.replace(isLoggedIn ? 'Main' : 'Login');
      }, 2000);
    }
  }, [isLoggedIn, navigation]);

  return <SplashScreen />;
};

function App(): React.JSX.Element {
  useEffect(() => {
    Orientation.lockToPortrait();
    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  // Get the logged-in user state from Redux.
  const user = useAppSelector(state => state.user);

  return (
    <Loader>
      <NavigationContainer>
        {user && user.id ? <MainStack /> : <AuthStack />}
      </NavigationContainer>
      <Toast />
    </Loader>
  );
}

export default App;
