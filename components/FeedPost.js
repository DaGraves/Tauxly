import React, {useCallback, useContext} from 'react';
import {View, StyleSheet, Dimensions} from 'react-native';
import ImageCustom from './ImageCustom';
import {Text, Button} from 'native-base';
import {StoreContext} from '../store/StoreContext';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import {INTERACTION_TYPES} from '../constants';

const {width} = Dimensions.get('window');

const FeedPost = props => {
  const navigation = useNavigation();
  const {
    item,
    onLikeOptimisticUpdate,
    onUnlikeOptimisticUpdate,
    disableLike,
    disableUsername,
  } = props;
  const {user} = useContext(StoreContext);

  const handleLike = useCallback(async () => {
    if (item) {
      const {id, likes = [], downloadUrl} = item;
      try {
        if (onLikeOptimisticUpdate) {
          onLikeOptimisticUpdate(id);
        }
        const increment = firestore.FieldValue.increment(1);
        await firestore()
          .collection('posts')
          .doc(id)
          .update({
            likes: {...likes, [user.id]: true},
            likeCount: increment,
          });
        await firestore()
          .collection('interactions')
          .add({
            postId: id,
            postDownloadUrl: downloadUrl,
            creatorId: item.userId,
            userId: user.id,
            userName: user.username,
            timestamp: moment().unix(),
            type: INTERACTION_TYPES.LIKE,
          });
      } catch (e) {
        console.log('Error Like', e);
      }
    }
  }, [item, onLikeOptimisticUpdate, user.id, user.username]);

  const handleUnlike = useCallback(async () => {
    if (item) {
      const {id} = item;
      try {
        if (onUnlikeOptimisticUpdate) {
          onUnlikeOptimisticUpdate(id);
        }
        const increment = firestore.FieldValue.increment(-1);
        console.log(item);
        delete item.likes[user.id];
        console.log(item);
        await firestore()
          .collection('posts')
          .doc(id)
          .update({
            likes: item.likes,
            likeCount: increment,
          });
      } catch (e) {
        console.log('Error Like', e);
      }
    }
  }, [item, onUnlikeOptimisticUpdate, user.id]);

  const handleComments = useCallback(() => {
    navigation.navigate('Comments', item);
  }, [item, navigation]);

  const shouldShowLike = () => {
    if (disableLike) {
      return false;
    }
    const {createdAt} = item;
    const startOfDay = moment()
      .utc()
      .startOf('day')
      .unix();
    const endOfDay = moment()
      .utc()
      .endOf('day')
      .unix();
    return !(createdAt < startOfDay || createdAt > endOfDay);
  };

  const likes = item.likes || {};
  const isLiked = likes[user.id];
  return (
    <View style={styles.container}>
      {!disableUsername ? (
        <View style={styles.usernameContainer}>
          <Text>@{item.username}</Text>
        </View>
      ) : null}
      <View style={{height: width / (item.aspectRatio || 1)}}>
        <ImageCustom
          style={styles.image}
          resizeMode={'contain'}
          source={{uri: item.downloadUrl}}
        />
      </View>
      <View>
        <Text>{item.likeCount || 0} likes</Text>
      </View>
      <View>
        <Text>{item.description}</Text>
      </View>
      {shouldShowLike() ? (
        <Button onPress={isLiked ? handleUnlike : handleLike}>
          <Text>{isLiked ? 'Unlike' : 'Like'}</Text>
        </Button>
      ) : null}
      <Button onPress={handleComments}>
        <Text>Comments</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  usernameContainer: {},
  image: {
    height: '100%',
    width: width,
  },
});

export default FeedPost;
