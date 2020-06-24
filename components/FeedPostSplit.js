import React, {useCallback, useContext} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
import ImageCustom from './ImageCustom';
import {Text, Button} from 'native-base';
import {StoreContext} from '../store/StoreContext';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {INTERACTION_TYPES} from '../constants';
import {colors} from '../styles/common';

const {width} = Dimensions.get('window');

const FeedPost = props => {
  const {item, onPress} = props;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <ImageCustom
        style={styles.image}
        resizeMode={'cover'}
        source={{uri: item.downloadUrl}}
      />
      <Text style={styles.time}>
        {moment.unix(item.createdAt).format('DD MMMM YYYY')}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
  },
  image: {
    height: width / 2 - 20,
    width: width / 2 - 20,
  },
  time: {
    color: colors.white,
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default FeedPost;
