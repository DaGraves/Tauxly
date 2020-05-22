import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {AddPostScreen, AddPostDetailsScreen} from '../screens';

const Stack = createStackNavigator();

const AddPostStackNavigator = (props) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="AddPost" component={AddPostScreen} />
      <Stack.Screen name="AddPostDetails" component={AddPostDetailsScreen} />
    </Stack.Navigator>
  );
};

export default AddPostStackNavigator;
