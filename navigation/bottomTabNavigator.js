import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import EmptyScreen from '../screens/EmptyScreen';
import {ProfileScreen} from '../screens';
import {AddPostStackNavigator} from './index';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Home" component={EmptyScreen} />
    <Tab.Screen name="Leaderboard" component={EmptyScreen} />
    <Tab.Screen name="Add post" component={AddPostStackNavigator} />
    <Tab.Screen name="Activity" component={EmptyScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

export default BottomTabNavigator;
