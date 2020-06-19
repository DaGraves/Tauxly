import React from 'react';
import {ActivityIndicator, Dimensions, StyleSheet, View} from 'react-native';
import {colors} from '../styles/common';

const {height, width} = Dimensions.get('window');

const LoadingOverlay = props => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={'large'} color={colors.white} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 10,
    left: 0,
    top: 0,
    height,
    width,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default LoadingOverlay;
