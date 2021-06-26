import React from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import {GradientBackground} from '../components';
import {Button, Text} from 'native-base';
import {colors} from '../styles/common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {buttonStyles} from '../styles';

const EmailVerificationScreen = props => {
  const handleResendEmail = async () => {
    const fbUser = await auth().currentUser;
    await fbUser.sendEmailVerification();
  };

  const handleLogOut = async () => {
    await auth().signOut();
  };

  return (
    <GradientBackground>
      <SafeAreaView style={styles.container}>
        <View style={styles.upperContainer}>
          <Image
            source={{uri: 'logo'}}
            style={styles.logo}
            resizeMode={'contain'}
          />
          <Text style={styles.text}>
            Email has been sent. Go to your email to confirm sign up to login.
          </Text>
          <Icon color={colors.yellow} name={'check'} size={200} />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            title="Log In"
            onPress={handleLogOut}
            style={[buttonStyles.buttonSecondary, styles.button]}>
            <Text styke={buttonStyles.buttonSecondaryText}>Go to login!</Text>
          </Button>
          <TouchableOpacity
            onPress={handleResendEmail}
            style={styles.resendContainer}>
            <Text style={styles.resend}>Re-send confirmation email</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  logo: {
    height: 100,
    width: 300,
  },
  text: {
    fontSize: 20,
    color: colors.white,
    textAlign: 'center',
    paddingHorizontal: 30,
    marginBottom: 10,
  },
  resendContainer: {
    marginTop: 14,
    height: 30,
    justifyContent: 'center',
  },
  resend: {
    color: colors.yellow,
    fontSize: 14,
  },
  button: {
    width: '100%',
  },
  upperContainer: {
    alignItems: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    marginHorizontal: 30,
    marginBottom: 20,
  },
});

export default EmailVerificationScreen;
