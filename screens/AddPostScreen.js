import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text} from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import {useNavigation} from '@react-navigation/native';

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
      <TouchableOpacity style={styles.galleryContainer} onPress={openGallery}>
        <Text style={styles.text}>Upload from gallery</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.cameraContainer} onPress={openCamera}>
        <Text style={styles.text}>Take a picture</Text>
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
    backgroundColor: 'red',
  },
  cameraContainer: {
    flex: 1 / 2,
    justifyContent: 'center',
    backgroundColor: 'green',
  },
  text: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 30,
  },
});

export default AddPostScreen;
