import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {
  ActivityScreen,
  LeaderboardScreen,
  ProfileScreen,
} from '../screens';
import AddPostStackNavigator from './addPostStackNavigator';
import {HomeStackNavigator} from './index';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Tab.Screen name="Add post" component={AddPostStackNavigator} />
    <Tab.Screen name="Activity" component={ActivityScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
