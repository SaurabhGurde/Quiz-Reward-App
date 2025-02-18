import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../pages/Home';
import Wallet from '../pages/Wallet';
import ReferFriend from '../pages/ReferFriend';
import LeaderBoard from '../pages/LeaderBoard';
import BottomTabBar from './component/BottomTabBar';

const Tab = createBottomTabNavigator();

const Bottom_Tab = () => {
  return (
    <Tab.Navigator
      initialRouteName={'home'}
      screenOptions={{
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarStyle: {backgroundColor: 'white'},
        animation: 'shift',
      }}
      tabBar={props => <BottomTabBar {...props} />}>
      <Tab.Screen
        options={{tabBarLabel: 'Home'}}
        name="home"
        component={Home}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Wallet'}}
        name="wallet"
        component={Wallet}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Refer Friend'}}
        name="refer_friend"
        component={ReferFriend}
      />
      <Tab.Screen
        options={{tabBarLabel: 'Leader Board'}}
        name="leader_board"
        component={LeaderBoard}
      />
    </Tab.Navigator>
  );
};

export default Bottom_Tab;
