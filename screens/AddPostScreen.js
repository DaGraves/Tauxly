import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';
import {colors} from '../styles/common';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {ListDivider} from '../components';

const IMAGE_OPTIONS = {
  compressImageMaxWidth: 1080,
  compressImageMaxHeight: 1080,
  compressImageQuality: 0.6,
  // cropping: true,
};

const AddPostScreen = props => {
  const navigation = useNavigation();

  const goNext = data => {
    navigation.navigate('AddPostDetails', data);
  };

  const openCamera = useCallback(async () => {
    try {
      const data = await ImagePicker.openCamera(IMAGE_OPTIONS);
      goNext(data);
    } catch (e) {
      console.log('Picker Error', e);
    }
  }, []);

  const openGallery = useCallback(async () => {
    try {
      const data = await ImagePicker.openPicker(IMAGE_OPTIONS);
      goNext(data);
    } catch (e) {
      console.log('Picker Error', e);
    }
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.cameraContainer} onPress={openCamera}>
        <Icon name="camera-alt" size={100} color={colors.white} />
        <Text style={styles.text}>Take a picture</Text>
        <View style={styles.divider} />
      </TouchableOpacity>
      <TouchableOpacity style={styles.galleryContainer} onPress={openGallery}>
        <Icon name="photo-library" size={100} color={colors.white} />
        <Text style={styles.text}>Upload from gallery</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  galleryContainer: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.blue,
  },
  cameraContainer: {
    flex: 1 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.black,
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 10,
  },
  divider: {
    position: 'absolute',
    bottom: 0,
    width: '60%',
    height: 1,
    backgroundColor: colors.white,
  },
});

export default AddPostScreen;
