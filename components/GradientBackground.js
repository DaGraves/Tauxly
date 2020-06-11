import React from 'react';
import {Dimensions, ImageBackground, StyleSheet} from 'react-native';

const {width, height} = Dimensions.get('window');

const GradientBackground = props => {
  return (
    <ImageBackground source={{uri: 'auth_background'}} style={styles.image}>
      {props.children}
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  image: {
    resizeMode: 'cover',
    height,
    width,
  },
});

export default GradientBackground;
