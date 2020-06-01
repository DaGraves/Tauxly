import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {ActivityScreen} from '../screens';
import AddPostStackNavigator from './addPostStackNavigator';
import HomeStackNavigator from './homeStackNavigator';
import LeaderboardStackNavigator from './leaderboardStackNavigator';
import ProfileStackNavigator from './profileStackNavigator';

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
