import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {HomeScreen, CommentsScreen} from '../screens';

const Stack = createStackNavigator();

const HomeStackNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
