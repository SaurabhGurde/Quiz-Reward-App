import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Bottom_Tab from './src/navigation/Bottom_Tab';
import SplashScreen from './src/common/SplashScreen';
import Profile from './src/pages/Profile';
import LoginSignupScreen from './src/pages/LoginSignupScreen';
import Orientation from 'react-native-orientation-locker';
import Toast from 'react-native-toast-message';
import {getItem} from './src/common/AsyncStorage';
import store, {useAppDispatch, useAppSelector} from './src/redux/store';
import {setInitialUserDetails} from './src/redux/userSlice';
import Header from './src/component/Header';
import RootNavigation from './src/navigation/RootNavigation';
import { Provider } from 'react-redux';

function App(): React.JSX.Element {

  useEffect(() => {
    Orientation.lockToPortrait();

    return () => {
      Orientation.unlockAllOrientations();
    };
  }, []);

  return (
    <Provider store={store}>
      <View style={{flex: 1}}>
      <RootNavigation />
      <Toast />
    </View>
    </Provider>
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
