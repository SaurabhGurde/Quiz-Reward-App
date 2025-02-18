import React, {useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Bottom_Tab from './Bottom_Tab';
import SplashScreen from '../common/SplashScreen';
import Profile from '../pages/Profile';
import LoginSignupScreen from '../pages/LoginSignupScreen';
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-toast-message';
import {getItem} from '../common/AsyncStorage';
import  {useAppDispatch} from '../redux/store';
import {setInitialUserDetails} from '../redux/userSlice';
import Header from '../component/Header';
import Loader from '../component/Loader';
import Quiz from '../pages/Quiz'
import Result from '../pages/Result';

function App(): React.JSX.Element {
  const Stack = createStackNavigator();

  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <Loader>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{
            gestureEnabled: true,
            cardStyleInterpolator: ({current, next, layouts}) => {
              return {
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
              };
            },
          }}>
          <Stack.Screen
            name="Splash"
            component={Splash}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Login"
            component={LoginSignupScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Main"
            component={Bottom_Tab}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Profile"
            component={Profile}
            options={{
              header: () => <Header title="Profile" />,
            }}
          />
          <Stack.Screen
            name="Quiz"
            component={Quiz}
            options={{
              header: () => <Header title="Quiz" />,
            }}
          />
          <Stack.Screen
            name="Result"
            component={Result}
            options={{
              header: () => <Header title="Result" />,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </Loader>
  );
}

export default App;

const Splash = ({navigation}: any) => {
  let dispatch = useAppDispatch();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const user = await getItem('userDetails');
        if (!!user) {
          dispatch(setInitialUserDetails(user));
          setIsLoggedIn(!!user);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };
    checkLoginStatus();
  }, []);

  useEffect(() => {
    if (isLoggedIn !== null) {
      setTimeout(() => {
        if (isLoggedIn === true) {
          navigation.replace('Main');
        } else {
          navigation.replace('Login');
        }
      }, 2000);
    }
  }, [isLoggedIn]);

  return <SplashScreen />;
};
