import React, {useContext, useEffect} from 'react';
import {Text, View} from 'react-native';
import {StoreContext} from '../store/StoreContext';

const EmptyScreen = props => {
  return (
    <View>
      <Text>EMPTY</Text>
    </View>
  );
};

export default EmptyScreen;
