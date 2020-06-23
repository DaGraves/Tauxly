import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {CommentsScreen, ProfileScreen, EditProfileScreen} from '../screens';
import {colors} from '../styles/common';

const Stack = createStackNavigator();

const ProfileStackNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.darkGrey,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{header: () => null}}
      />
      <Stack.Screen name="Comments" component={CommentsScreen} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{title: 'Edit your profile', headerBackTitle: 'Back'}}
      />
    </Stack.Navigator>
  );
};

export default ProfileStackNavigator;
