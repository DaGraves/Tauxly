import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import ImagePicker from 'react-native-image-crop-picker';
import {PictureFeed} from '../components';
import {colors} from '../styles/common';
import {Button} from 'native-base';

const BATCH_SIZE = 10;

const HomeScreen = () => {
  const [posts, setPosts] = useState({});
  const [extraPosts, setExtraPosts] = useState({});
  const [loading, setLoading] = useState(false);
  const lastDocRef = useRef(null);
  const {user} = useContext(StoreContext);

  const fetchPosts = useCallback(async () => {
    let postsData = {};
    const startOfDay = moment()
      .utc()
      .startOf('day')
      .unix();
    const endOfDay = moment()
      .utc()
      .endOf('day')
      .unix();

    try {
      if (lastDocRef.current) {
        // Subsequent, paginated fetches
        const data = await firestore()
          .collection('posts')
          .where('createdAt', '>=', startOfDay)
          .where('createdAt', '<=', endOfDay)
          .orderBy('createdAt', 'asc')
          .startAfter(lastDocRef.current)
          .limit(BATCH_SIZE)
          .get();

        if (!data.empty) {
          data.docs.forEach((docRef, idx) => {
            const doc = docRef.data();
            // Leave it in if you want to omit your own posts on the home screen
            // if (doc.userId !== user.id) {
            postsData = {
              //     ...postsData,
              [docRef.id]: {...doc, id: docRef.id},
            };
            // }
            if (idx === data.docs.length - 1) {
              lastDocRef.current = docRef;
            }
          });
          setPosts({...posts, ...postsData});
          setExtraPosts(postsData);
        }
      } else {
        // The initial fetch
        const data = await firestore()
          .collection('posts')
          .where('createdAt', '>=', startOfDay)
          .where('createdAt', '<=', endOfDay)
          .orderBy('createdAt', 'asc')
          .limit(BATCH_SIZE)
          .get();

        data.docs.forEach((docRef, idx) => {
          // Leave it in if you want to omit your own posts on the home screen
          const doc = docRef.data();
          // if (doc.userId !== user.id) {
          postsData = {
            //     ...postsData,
            [docRef.id]: {...doc, id: docRef.id},
          };
          // }
          if (idx === data.docs.length - 1) {
            lastDocRef.current = docRef;
          }
        });
        setPosts(postsData);
        setLoading(false);
      }
    } catch (e) {
      Alert.alert(
        'Something went wrong',
        "We couldn't fetch any posts at this time...",
        [
          {
            text: 'Ok',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
      console.log('Login Error', e);
    }
  }, [posts, user.id]);

  const cleanImagePicker = useCallback(async () => {
    try {
      await ImagePicker.clean();
    } catch (e) {
      console.log('Picker clean error', e);
    }
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchPosts();
    cleanImagePicker();
  }, []);

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.container}>
        {loading ? (
          <ActivityIndicator
            color={colors.white}
            size={'small'}
            style={styles.loading}
          />
        ) : (
          !Object.keys(posts).length && (
            <Text style={styles.text}>There are no posts for today... yet</Text>
          )
        )}
        <PictureFeed
          posts={posts}
          extraPosts={extraPosts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          batchSize={BATCH_SIZE}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: colors.black,
  },
  text: {
    color: colors.lightGrey,
    textAlign: 'center',
    marginTop: 30,
  },
  loading: {
    marginTop: 30,
  },
});

export default HomeScreen;
