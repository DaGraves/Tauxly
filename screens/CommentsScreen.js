import React, {useCallback, useContext, useEffect, useState} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {Input, Item, Button} from 'native-base';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import moment from 'moment';
import {INTERACTION_TYPES} from '../constants';
import {CommentItem} from '../components';

const CommentsScreen = props => {
  const {user} = useContext(StoreContext);
  const [comment, setComment] = useState('');
  const [serverComments, setServerComments] = useState([]);
  const {
    route: {params},
  } = props;

  const fetchComments = useCallback(async () => {
    const fbData = await firestore()
      .collection('comments')
      .where('postId', '==', params.id)
      .orderBy('timestamp', 'desc')
      .get();
    const data = fbData.docs.map(item => ({id: item.id, ...item.data()}));
    setComment('');
    setServerComments(data);
  }, [params.id]);

  useEffect(() => {
    fetchComments();
  }, []);

  const handleSendComment = useCallback(async () => {
    if (user && comment) {
      try {
        await firestore()
          .collection('comments')
          .add({
            postId: params.id,
            comment,
            userId: user.id,
            userName: user.username,
            timestamp: moment().unix(),
          });
        if (params.userId !== user.id) {
          // Only create an interaction if on someone else's post
          await firestore()
            .collection('interactions')
            .add({
              postId: params.id,
              postDownloadUrl: params.downloadUrl,
              creatorId: params.userId,
              userId: user.id,
              userName: user.username,
              timestamp: moment().unix(),
              type: INTERACTION_TYPES.COMMENT,
            });
        }
        fetchComments();
      } catch (e) {
        console.log('Send comment error', e);
      }
    }
  }, [
    user,
    comment,
    params.id,
    params.userId,
    params.downloadUrl,
  ]);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={serverComments}
        renderItem={CommentItem}
        keyExtractor={item => item.id}
      />
      <Item style={styles.lowerContainer}>
        <Input
          placeholder="Type a comment..."
          value={comment}
          onChangeText={setComment}
        />
        <Button style={styles.button} onPress={handleSendComment}>
          <Text>Send!</Text>
        </Button>
      </Item>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  lowerContainer: {
    marginBottom: 10,
  },
  button: {
    width: 40,
    height: 40,
    borderRadius: 100,
  },
});

export default CommentsScreen;
