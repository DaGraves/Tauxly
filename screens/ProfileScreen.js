import React, {useCallback, useContext, useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {Text, Button} from 'native-base';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import ImageCustom from '../components/ImageCustom';
import {StoreContext} from '../store/StoreContext';
import {PictureFeed} from '../components';

const ProfileScreen = props => {
  const {user} = useContext(StoreContext);
  const [posts, setPosts] = useState({});

  const handleLogOut = useCallback(async () => {
    const result = await auth().signOut();
    console.log('Logout Result', result);
  }, []);

  const fetchPosts = useCallback(async () => {
    const dbData = await firestore()
      .collection('posts')
      .where('userId', '==', user.id)
      .orderBy('createdAt', 'desc')
      .get();
    let data = {};
    dbData.docs.forEach(
      item => (data = {...data, [item.id]: {id: item.id, ...item.data()}}),
    );
    setPosts(data);
  }, []);

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
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          disableLike
          disableUsername
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
