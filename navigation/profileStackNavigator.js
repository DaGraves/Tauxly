import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CommentsScreen, ProfileScreen} from '../screens';

const Stack = createStackNavigator();

const ProfileStackNavigator = props => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
