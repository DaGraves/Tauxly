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
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';

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
        delete item.likes[user.id];
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
  const showLikes = shouldShowLike();
  return (
    <View>
      <View style={{height: width / (item.aspectRatio || 1)}}>
        <ImageCustom
          style={styles.image}
          resizeMode={'contain'}
          source={{uri: item.downloadUrl}}
        />
      </View>
      <View style={styles.actionContainer}>
        {!disableUsername ? (
          <TouchableOpacity
            style={styles.usernameContainer}
            onPress={() =>
              navigation.navigate('OtherProfile', {userId: item.userId})
            }>
            <Text style={[styles.username, !showLikes && styles.onlyUserName]}>
              @{item.username}
            </Text>
          </TouchableOpacity>
        ) : null}
        {showLikes ? (
          <TouchableOpacity
            style={styles.likeContainer}
            onPress={isLiked ? handleUnlike : handleLike}>
            <CommunityIcon
              size={20}
              color={isLiked ? colors.yellow : colors.white}
              name={isLiked ? 'thumb-up' : 'thumb-up-outline'}
            />
            <Text
              style={[styles.likes, isLiked ? styles.liked : styles.unliked]}>
              {item.likeCount || 0} likes
            </Text>
          </TouchableOpacity>
        ) : null}
      </View>
      <Text style={styles.description}>{item.description}</Text>
      <TouchableOpacity onPress={handleComments}>
        <Text style={styles.comments}>See more comments</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
  },
  likeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 20,
    flex: 1 / 2,
  },
  likes: {
    textAlign: 'left',
    fontSize: 14,
    marginLeft: 4,
    fontWeight: 'bold',
  },
  liked: {
    color: colors.yellow,
  },
  unliked: {
    color: colors.white,
  },
  usernameContainer: {
    flex: 1 / 2,
  },
  username: {
    color: colors.white,
    paddingRight: 20,
    textAlign: 'right',
    fontWeight: 'bold',
  },
  onlyUserName: {
    textAlign: 'center',
  },
  image: {
    height: '100%',
    width: width,
  },
  description: {
    color: colors.white,
    marginHorizontal: 10,
    fontSize: 16,
  },
  comments: {
    fontSize: 14,
    color: colors.lightGrey,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default FeedPost;
