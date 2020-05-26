import React from 'react';
import {Image} from 'react-native';

const DEV_URL =
  'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg';

const ImageCustom = props => {
  const {forceProd} = props;
  return (
    <Image {...props} source={{uri: forceProd ? props.source.uri : DEV_URL}} />
  );
};

export default ImageCustom;
