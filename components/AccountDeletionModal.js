import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import {Button, Item, Text} from 'native-base';
import {Input} from '../components';
import {colors} from '../styles/common';
import {buttonStyles, inputStyles} from '../styles/';
import {deleteAccountData} from '../helpers';
import auth from '@react-native-firebase/auth';

const AccountDeletionModal = ({visible = false, closeModal = () => {}}) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const triggerDeleteAlert = async () => {
    try {
      const user = auth().currentUser;
      const credential = auth.EmailAuthProvider.credential(
        user.email,
        password,
      );
      await user.reauthenticateWithCredential(credential);
      Alert.alert(
        'Delete your account?',
        "This is the final step in deleting your account. Once you do this, we can't recover the data.",
        [
          {
            text: 'Cancel',
            onPress: closeModal,
            style: 'cancel',
          },
          {text: 'Delete', onPress: handleAccountDelete},
        ],
        {cancelable: true},
      );
    } catch (e) {
      Alert.alert(
        'Password incorrect!',
        'Please type in your correct password in order to delete this account.',
        [
          {
            text: 'OK',
            onPress: closeModal,
            style: 'cancel',
          },
        ],
        {cancelable: true},
      );
    }
  };

  const handleAccountDelete = async () => {
    setLoading(true);
    await deleteAccountData();
    setLoading(false);
  };

  return (
    <Modal visible={visible} style={styles.mainContainer}>
      <SafeAreaView style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.container}>
          <Text style={styles.explainTitle}>Are you sure?</Text>
          <Text style={styles.explain}>
            By deleting your account, you will permanently loose all the data
            you shared with Tauxlly, including posts, comments, likes, bios and
            many more.
          </Text>
          <Item style={inputStyles.item}>
            <Input
              secureTextEntry
              autoCompleteType="password"
              placeholder="Password"
              blurOnSubmit={false}
              value={password}
              onChangeText={setPassword}
              iconName="lock"
            />
          </Item>
          {loading ? (
            <ActivityIndicator size={'large'} color={colors.white} />
          ) : (
            <>
              <Button
                style={[buttonStyles.buttonPrimary, styles.button]}
                onPress={closeModal}>
                <Text style={buttonStyles.buttonPrimaryText}>
                  No, take me back!
                </Text>
              </Button>
              <Button
                style={[buttonStyles.buttonSecondary, styles.button]}
                onPress={triggerDeleteAlert}>
                <Text style={buttonStyles.buttonSecondaryText}>
                  Yes, delete my account
                </Text>
              </Button>
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  container: {
    flex: 1,
    backgroundColor: colors.black,
    padding: 20,
  },
  explainTitle: {
    color: colors.yellow,
    fontSize: 30,
    textAlign: 'center',
    marginBottom: 30,
  },
  explain: {
    color: colors.white,
    textAlign: 'center',
    marginBottom: 80,
  },
  button: {
    marginBottom: 20,
  },
});

export default AccountDeletionModal;
