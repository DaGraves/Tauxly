import React, {useCallback, useContext, useEffect, useState} from 'react';
import {Image, View, StyleSheet, Platform, Dimensions} from 'react-native';
import {Item, Button, Text} from 'native-base';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, StackActions} from '@react-navigation/native';
import {uuid} from 'uuidv4';
import moment from 'moment';
import {Input} from '../components';
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
  const {user} = useContext(StoreContext);
  const navigation = useNavigation();
  const [description, setDescription] = useState('');
  const [iap, setIap] = useState(null);

  const prepareIAP = useCallback(async () => {
    try {
      const products = await RNIap.getProducts([IAP_SKU]);
      console.log(products)
      const photoSubIAP = products.find(item => item.productId === IAP_SKU);
      setIap(photoSubIAP);
    } catch (err) {
      console.warn(err.code, err.message);
    }
  }, []);

  useEffect(() => {
    prepareIAP();
  }, []);

  const handleSubmit = useCallback(async () => {
    try {
      const purchase = await RNIap.requestPurchase(IAP_SKU);
      console.log('in-component purchase', purchase);
      // const pictureId = uuid();
      // const storageRef = storage().ref(`posts/${pictureId}`);
      // await storageRef.putFile(params.path);
      // const downloadUrl = await storageRef.getDownloadURL();
      // const dbData = {
      //   pictureId,
      //   downloadUrl,
      //   description,
      //   likeCount: 0,
      //   userId: user && user.id,
      //   username: user && user.username,
      //   createdAt: moment().unix(),
      //   createdAtDay: moment()
      //     .utc()
      //     .startOf('day')
      //     .unix(),
      //   aspectRatio: params.width / params.height,
      // };
      // await firestore()
      //   .collection('posts')
      //   .add(dbData);
      //
      // const resetStack = StackActions.pop(1);
      // navigation.dispatch(resetStack);
      // navigation.navigate('Home');
    } catch (e) {
      console.log('Storage error', e);
    }
  }, [params.path, params.width, params.height, description, user, navigation]);

  return (
    <View style={styles.mainContainer}>
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
