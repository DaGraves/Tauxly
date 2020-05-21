import React, {useCallback} from 'react';
import {SafeAreaView} from 'react-native';
import {Text, Button} from 'native-base';
import auth from '@react-native-firebase/auth';

const ProfileScreen = props => {
  const handleLogOut = useCallback(async () => {
    const result = await auth().signOut();
    console.log('Logout Result', result);
  }, []);

  return (
    <SafeAreaView>
      <Button onPress={handleLogOut}>
        <Text>Log Out</Text>
      </Button>
    </SafeAreaView>
  );
};

export default ProfileScreen;
