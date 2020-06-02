import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text, Button} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImageCustom from '../components/ImageCustom';
import {StoreContext} from '../store/StoreContext';
import {PictureFeed} from '../components';

const BATCH_SIZE = 2;

const ProfileScreen = props => {
  const {user} = useContext(StoreContext);
  const [posts, setPosts] = useState({});
  const [extraPosts, setExtraPosts] = useState({});
  const lastDocRef = useRef(null);

  const handleLogOut = useCallback(async () => {
    const result = await auth().signOut();
    console.log('Logout Result', result);
  }, []);

  const fetchPosts = useCallback(async () => {
    if (lastDocRef.current) {
      // Subsequent, paginated fetches
      const dbData = await firestore()
        .collection('posts')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc')
        .startAfter(lastDocRef.current)
        .limit(BATCH_SIZE)
        .get();

      if (!dbData.empty) {
        let data = {};
        dbData.docs.forEach((item, idx) => {
          data = {...data, [item.id]: {id: item.id, ...item.data()}};
          if (idx === dbData.docs.length - 1) {
            lastDocRef.current = item;
          }
        });
        setPosts({...posts, ...data});
        setExtraPosts(data);
      }
    } else {
      // Initial fetch
      const dbData = await firestore()
        .collection('posts')
        .where('userId', '==', user.id)
        .orderBy('createdAt', 'desc')
        .limit(BATCH_SIZE)
        .get();
      let data = {};
      dbData.docs.forEach((item, idx) => {
        data = {...data, [item.id]: {id: item.id, ...item.data()}};
        if (idx === dbData.docs.length - 1) {
          lastDocRef.current = item;
        }
      });
      setPosts(data);
    }
  }, [posts, user.id]);

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ImageCustom source={{uri: user.photoUrl}} style={styles.image} />
      <Text>{user.email}</Text>
      <Text>{user.username}</Text>
      <Button onPress={handleLogOut}>
        <Text>Log Out</Text>
      </Button>
      <View style={styles.container}>
        <PictureFeed
          posts={posts}
          extraPosts={extraPosts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          disableLike
          disableUsername
          batchSize={BATCH_SIZE}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  container: {
    flex: 1,
  },
});

export default ProfileScreen;
