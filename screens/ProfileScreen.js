import React, {useCallback, useContext} from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import {Text, Button} from 'native-base';
import auth from '@react-native-firebase/auth';
import ImageCustom from '../components/ImageCustom';
import {StoreContext} from '../store/StoreContext';

const ProfileScreen = props => {
  const {user} = useContext(StoreContext);

  const handleLogOut = useCallback(async () => {
    const result = await auth().signOut();
    console.log('Logout Result', result);
  }, []);

  return (
    <SafeAreaView>
      <ImageCustom source={{uri: user.photoUrl}} style={styles.image} />
      <Text>{user.email}</Text>
      <Text>{user.username}</Text>
      <Button onPress={handleLogOut}>
        <Text>Log Out</Text>
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
});

export default ProfileScreen;
