import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AddPostScreen, AddPostDetailsScreen} from '../screens';
import {colors} from '../styles/common';

const Stack = createStackNavigator();

const AddPostStackNavigator = props => {
  return (
    <Stack.Navigator
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
        name="AddPost"
        component={AddPostScreen}
        options={{header: () => null}}
      />
    </Stack.Navigator>
  );
};

export default AddPostStackNavigator;
