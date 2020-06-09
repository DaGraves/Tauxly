import React, {useCallback, useContext, useState} from 'react';
import {Image, View, StyleSheet, ScrollView} from 'react-native';
import {Input, Item, Button, Text} from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, StackActions} from '@react-navigation/native';
import {uuid} from 'uuidv4';
import moment from 'moment';
import {StoreContext} from '../store/StoreContext';

const AddPostDetailsScreen = props => {
  const {
    route: {params},
  } = props;
  const {user} = useContext(StoreContext);
  const navigation = useNavigation();
  const [description, setDescription] = useState('');

  const handleSubmit = useCallback(async () => {
    try {
      const pictureId = uuid();
      const storageRef = storage().ref(`posts/${pictureId}`);
      await storageRef.putFile(params.path);
      const downloadUrl = await storageRef.getDownloadURL();
      const dbData = {
        pictureId,
        downloadUrl,
        description,
        likeCount: 0,
        userId: user && user.id,
        username: user && user.username,
        createdAt: moment().unix(),
        createdAtDay: moment()
          .utc()
          .startOf('day')
          .unix(),
        aspectRatio: params.width / params.height,
      };
      await firestore()
        .collection('posts')
        .add(dbData);

      const resetStack = StackActions.pop(1);
      navigation.dispatch(resetStack);
      navigation.navigate('Home');
    } catch (e) {
      console.log('Storage error', e);
    }
  }, [params.path, params.width, params.height, description, user, navigation]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          style={styles.image}
          source={{
            uri: params.path,
          }}
        />
      </View>
      <View style={styles.formContainer}>
        <Item>
          <Input
            autoCompleteType="email"
            placeholder="Description"
            style={styles.input}
            value={description}
            onChangeText={setDescription}
          />
        </Item>
        <Button primary style={styles.button} onPress={handleSubmit}>
          <Text>Submit</Text>
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: 300,
  },
  formContainer: {
    alignItems: 'center',
  },
  image: {
    flex: 1,
  },
  button: {
    width: 300,
    marginTop: 20,
  },
});

export default AddPostDetailsScreen;
