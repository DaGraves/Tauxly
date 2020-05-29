import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityScreen, ProfileScreen} from '../screens';
import AddPostStackNavigator from './addPostStackNavigator';
import {
  HomeStackNavigator,
  LeaderboardStackNavigator,
  ProfileStackNavigator,
} from './index';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeStackNavigator} />
    <Tab.Screen name="Leaderboard" component={LeaderboardStackNavigator} />
    <Tab.Screen name="Add post" component={AddPostStackNavigator} />
    <Tab.Screen name="Activity" component={ActivityScreen} />
    <Tab.Screen name="Profile" component={ProfileStackNavigator} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
