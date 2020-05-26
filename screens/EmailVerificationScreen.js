import React from 'react';
import {Button, SafeAreaView, View} from 'react-native';
import auth from '@react-native-firebase/auth';

const EmailVerificationScreen = props => {
  const handleResendEmail = async () => {
    const fbUser = await auth().currentUser;
    await fbUser.sendEmailVerification();
  };

  const handleLogOut = async () => {
    await auth().signOut();
  };

  return (
    <SafeAreaView>
      <Button title="Re-send email" onPress={handleResendEmail} />
      <Button title="Log In" onPress={handleLogOut} />
    </SafeAreaView>
  );
};

export default EmailVerificationScreen;
