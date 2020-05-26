import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmptyScreen from '../screens/EmptyScreen';
import {HomeScreen, LeaderboardScreen, ProfileScreen} from '../screens';
import AddPostStackNavigator from './addPostStackNavigator';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Leaderboard" component={LeaderboardScreen} />
    <Tab.Screen name="Add post" component={AddPostStackNavigator} />
    <Tab.Screen name="Activity" component={EmptyScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
