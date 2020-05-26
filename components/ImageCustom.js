import React from 'react';
import {Image} from 'react-native';

const DEV_URL =
  'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg';

const ImageCustom = props => {
  // UNCOMMENT TO SEE PRODUCTION IMAGES ON DEV
  // __DEV__ = false
  return (
    <Image {...props} source={{uri: __DEV__ ? DEV_URL : props.source.uri}} />
  );
};

export default ImageCustom;
