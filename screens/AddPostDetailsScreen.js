import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Image, View, StyleSheet, Dimensions} from 'react-native';
import {Item, Button, Text} from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {uuid} from 'uuidv4';
import moment from 'moment';
import {Input, LoadingOverlay} from '../components';
import {StoreContext} from '../store/StoreContext';
import {colors} from '../styles/common';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {buttonStyles} from '../styles';
import {IAP_SKU} from '../constants';
import RNIap from 'react-native-iap';

const {width} = Dimensions.get('window');

const AddPostDetailsScreen = props => {
  const {
    route: {params},
  } = props;
  const {user, currentPurchase, setCurrentPurchase} = useContext(StoreContext);
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [iap, setIap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const prepareIAP = useCallback(async () => {
    try {
      const products = await RNIap.getProducts([IAP_SKU]);
      const photoSubIAP = products.find(item => item.productId === IAP_SKU);
      setIap(photoSubIAP);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }, []);

  useEffect(() => {
    prepareIAP();
  }, []);

  const logPurchase = useCallback(
    async purchase => {
      try {
        firestore()
          .collection('purchases')
          .add({
            userId: user.id,
            ...purchase,
            createdAt: moment().unix(),
          });
      } catch (e) {
        console.log('Purchase log error', e);
      }
    },
    [user.id],
  );

  const uploadPost = useCallback(async () => {
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

    setIsLoading(false);
    setCurrentPurchase({});
    navigation.goBack();
  }, [
    description,
    navigation,
    params.height,
    params.path,
    params.width,
    setCurrentPurchase,
    user,
  ]);

  useEffect(() => {
    console.log('<<<<<', currentPurchase.isComplete, currentPurchase.isLogged);
    if (
      currentPurchase &&
      currentPurchase.isComplete &&
      !currentPurchase.isLogged
    ) {
      setCurrentPurchase({...currentPurchase, isLogged: true});
      logPurchase(currentPurchase);
      uploadPost();
    }
  }, [currentPurchase.isComplete]);

  const handleSubmit = useCallback(async () => {
    setIsLoading(true);
    try {
      const purchase = await RNIap.requestPurchase(IAP_SKU);
      setCurrentPurchase({purchase, isComplete: false});
    } catch (e) {
      console.log('Storage error', e);
    }
  }, [setCurrentPurchase]);

  return (
    <View style={styles.mainContainer}>
      {isLoading ? <LoadingOverlay /> : null}
      <KeyboardAwareScrollView
        style={styles.container}
        contentContainerStyle={styles.container}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.image}
            source={{
              uri: params.path,
            }}
          />
        </View>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Description</Text>
          <Item style={styles.inputContainer}>
            <Input
              autoCompleteType="email"
              autofocus
              style={{paddingBottom: 10}}
              value={description}
              onChangeText={setDescription}
              multiline
            />
          </Item>
          <Text style={styles.paymentText}>
            {iap &&
              `Submit your picture for ${iap.localizedPrice || '0.99 USD'}`}
          </Text>
        </View>
      </KeyboardAwareScrollView>
      <View style={styles.buttonContainer}>
        <Button
          disabled={!(iap && iap.localizedPrice)}
          style={[buttonStyles.buttonPrimary, styles.button]}
          onPress={handleSubmit}>
          <Text style={buttonStyles.buttonPrimaryText}>Submit</Text>
        </Button>
        <Button
          style={[buttonStyles.buttonSecondary, styles.button]}
          onPress={() => navigation.goBack()}>
          <Text style={buttonStyles.buttonSecondaryText}>Retake picture</Text>
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.black,
    flex: 1,
  },
  mainContainer: {
    backgroundColor: colors.black,
    flex: 1,
    justifyContent: 'space-between',
  },
  buttonContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  imageContainer: {
    height: 300,
  },
  formContainer: {
    marginHorizontal: 20,
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 10,
  },
  paymentText: {
    color: colors.white,
    fontSize: 14,
    marginBottom: 50,
  },
  image: {
    flex: 1,
  },
  button: {
    width: width - 100,
    marginTop: 20,
  },
});

export default AddPostDetailsScreen;
