import React, {useState} from 'react';
import {ActivityIndicator, Image, StyleSheet, View} from 'react-native';
import {colors} from '../styles/common';

const DEV_URL =
  'https://cdn.pixabay.com/photo/2015/04/23/22/00/tree-736885_960_720.jpg';

const ImageCustom = props => {
  const [loading, setLoading] = useState(false);

  const handleLoadStart = () => setLoading(true);
  const handleLoadEnd = () => setLoading(false);

  // UNCOMMENT TO SEE PRODUCTION IMAGES ON DEV
  // __DEV__ = false;
  return (
    <>
      <Image
        {...props}
        // source={{uri: __DEV__ ? DEV_URL : props.source.uri}}
        source={{uri: props.source.uri}}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
      />
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size={'small'} color={colors.white} />
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    position: 'absolute',
    alignItems: 'center',
    top: '45%',
    left: 0,
    width: '100%',
  },
});

export default ImageCustom;
