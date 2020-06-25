import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {INTERACTION_TYPES} from '../constants';
import ImageCustom from './ImageCustom';
import {colors} from '../styles/common';

const ActivityItem = ({item, goToPost}) => {
  return (
    <TouchableOpacity
      style={styles.imageContainer}
      onPress={() => goToPost(item.postId)}>
      <ImageCustom
        source={{uri: item.postDownloadUrl}}
        style={styles.image}
        resizeMode="cover"
        blurRadius={20}
      />
      <View style={styles.darkOverlay} />
      <Text style={styles.text}>
        @{item.userName}
        {item.type === INTERACTION_TYPES.LIKE ? (
          ' liked your post'
        ) : (
          <Text>
            <Text style={styles.commented}> commented </Text> on your post
          </Text>
        )}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: '100%',
    height: 50,
  },
  darkOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    position: 'absolute',
    left: 0,
    top: 0,
    height: 50,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  text: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 50,
    width: '100%',
    textAlign: 'center',
    lineHeight: 50,
    color: colors.white,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: {width: -1, height: 1},
    textShadowRadius: 10,
  },
  commented: {
    color: colors.yellow,
  },
});

export default ActivityItem;
