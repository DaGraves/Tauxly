import React, {useCallback, useContext, useEffect, useState} from 'react';
import {
  FlatList,
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {Item} from 'native-base';
import {Input} from '../components';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import moment from 'moment';
import {INTERACTION_TYPES} from '../constants';
import {CommentItem} from '../components';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {inputStyles} from '../styles';

const CommentsScreen = props => {
  const {user} = useContext(StoreContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [comment, setComment] = useState('');
  const [serverComments, setServerComments] = useState([]);
  const [addedComments, setAddedComments] = useState([]);
  const [keyboardOpen, setKeyboardOpen] = useState(0);
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
      setLoading(true);
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
        await fetchComments();
      } catch (e) {
        Alert.alert(
          'Something went wrong',
          "We couldn't post your comment... Please try again later!",
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } finally {
        setLoading(false);
      }
    }
  }, [user, comment, params.id, params.userId, params.downloadUrl]);

  useEffect(() => {
    const keyboardDidShow = Keyboard.addListener('keyboardDidShow', ev => {
      const {
        endCoordinates: {height, screenY},
      } = ev;
      console.log(ev);
      setKeyboardOpen(height, height);
    });
    const keyboardDidHide = Keyboard.addListener('keyboardDidHide', () =>
      setKeyboardOpen(0),
    );
    return () => {
      keyboardDidHide.remove();
      keyboardDidShow.remove();
    };
  }, []);

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={serverComments}
        extraData={addedComments}
        contentContainerStyle={keyboardOpen && {height: '20%'}}
        renderItem={item => (
          <CommentItem
            {...item}
            goToUser={() =>
              navigation.navigate('OtherProfile', {userId: item.userId})
            }
          />
        )}
        keyExtractor={item => item.id}
      />
      <View style={styles.mainLower}>
        <Item
          style={[
            styles.lowerContainer,
            keyboardOpen && {marginBottom: keyboardOpen},
          ]}>
          <Input
            placeholder="Leave a comment..."
            value={comment}
            onChangeText={setComment}
            style={inputStyles.input}
          />
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonLoading]}
            onPress={handleSendComment}>
            {loading ? (
              <ActivityIndicator size={'small'} color={colors.white} />
            ) : (
              <Icon name={'send'} size={20} color={colors.white} />
            )}
          </TouchableOpacity>
        </Item>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  mainLower: {
    position: 'absolute',
    width: '100%',
    alignItems: 'center',
    bottom: 0,
    paddingBottom: 30,
    backgroundColor: colors.black,
  },
  lowerContainer: {
    width: '90%',
  },
  button: {
    width: 36,
    height: 36,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.yellow,
  },
  buttonLoading: {
    backgroundColor: colors.lightGrey,
  },
});

export default CommentsScreen;
