import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CommentsScreen, ProfileScreen, EditProfileScreen} from '../screens';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
