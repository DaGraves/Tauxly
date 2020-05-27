import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {INTERACTION_TYPES} from '../constants';
import ImageCustom from './ImageCustom';

const ActivityItem = props => {
  const {item} = props;
  console.log(item);

  return (
    <View>
      <Text>
        {item.userName}
        {item.type === INTERACTION_TYPES.LIKE
          ? ' liked your post'
          : ' commented on your post'}
      </Text>
      <View style={styles.imageContainer}>
        <ImageCustom
          source={{uri: item.downloadUrl}}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  imageContainer: {
    width: 50,
    height: 50,
  },
  image: {
    width: '100%',
    height: '100%',
  },
});

export default ActivityItem;
