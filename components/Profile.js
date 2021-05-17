import React, {useContext, useRef, useState} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
  ActivityIndicator,
} from 'react-native';
import {Toast} from 'native-base';
import ImageCustom from './ImageCustom';
import {DEFAULT_PROFILE_PICTURE} from '../constants';
import {AccountDeletionModal, PictureFeed} from './index';
import {StoreContext} from '../store/StoreContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../styles/common';
import ActionSheet from 'react-native-actionsheet';
import {useNavigation} from '@react-navigation/native';

const Profile = ({
  handleLogOut,
  handleResetPassword,
  handleEditProfile,
  posts,
  extraPosts,
  setPosts,
  fetchPosts,
  batchSize,
  otherUser,
  loading,
  disableLike,
}) => {
  const myUser = useContext(StoreContext).user;
  const navigation = useNavigation();
  const user = otherUser || myUser;
  const [
    accountDeletionModalVisible,
    setAccountDeletionModalVisible,
  ] = useState(false);

  const actionSheetRef = useRef(null);

  const handleMenuPress = async idx => {
    console.log(idx);
    if (idx === 0) {
      handleLogOut();
    } else if (idx === 1) {
      handleResetPassword();
    } else if (idx === 2) {
      setAccountDeletionModalVisible(true);
      // await deleteAccountData(myUser.id);
    }
  };

  const handleSocialPress = async (name, val) => {
    try {
      if (name === 'instagram') {
        await Linking.openURL(`instagram://user?username=${val}`);
      } else if (name === 'twitter') {
        await Linking.openURL(`twitter://user?id=${val}`);
      } else if (name === 'facebook') {
        await Linking.openURL(`fb://profile/${val}`);
      }
    } catch (e) {
      Clipboard.setString(val);
      Toast.show({
        text: `Copied ${val}`,
        buttonText: 'OK',
        duration: 3000,
        position: 'bottom',
      });
    }
  };

  const handlePostPress = id =>
    navigation.navigate('Post', {id, disableLike: true});

  return (
    <>
      <AccountDeletionModal
        visible={accountDeletionModalVisible}
        closeModal={() => setAccountDeletionModalVisible(false)}
      />
      <ActionSheet
        ref={actionSheetRef}
        title={'Options'}
        options={['Sign Out', 'Reset Password', 'Delete Account', 'Cancel']}
        cancelButtonIndex={3}
        destructiveButtonIndex={0}
        onPress={handleMenuPress}
      />
      <View style={styles.header}>
        <View>
          <ImageCustom
            source={{uri: user.photoUrl || DEFAULT_PROFILE_PICTURE}}
            style={styles.image}
          />
          {otherUser &&
          (otherUser.facebook || otherUser.instagram || otherUser.twitter) ? (
            <View>
              <View style={styles.divider} />
              <View style={styles.socialContainer}>
                {otherUser.facebook ? (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialPress('facebook', otherUser.facebook)
                    }>
                    <CommunityIcon
                      name="facebook"
                      color={colors.white}
                      size={24}
                    />
                  </TouchableOpacity>
                ) : null}
                {otherUser.instagram ? (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialPress('instagram', otherUser.instagram)
                    }>
                    <CommunityIcon
                      name="instagram"
                      color={colors.white}
                      size={24}
                    />
                  </TouchableOpacity>
                ) : null}
                {otherUser.twitter ? (
                  <TouchableOpacity
                    onPress={() =>
                      handleSocialPress('twitter', otherUser.twitter)
                    }>
                    <CommunityIcon
                      name="twitter"
                      color={colors.white}
                      size={24}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          ) : null}
        </View>
        <View style={styles.headerRight}>
          <View style={styles.usernameContainer}>
            <Text style={styles.username}>@{user.username}</Text>
            {!otherUser && (
              <TouchableOpacity onPress={() => actionSheetRef.current.show()}>
                <CommunityIcon
                  name="dots-vertical"
                  size={24}
                  color={colors.lightGrey}
                />
              </TouchableOpacity>
            )}
          </View>
          <Text
            numberOfLines={otherUser ? 4 : 2}
            lineBreakMode={'tail'}
            style={styles.bio}>
            {user.biography}
          </Text>
          <TouchableOpacity
            style={styles.editProfile}
            onPress={handleEditProfile}>
            {!otherUser && (
              <Icon name="edit" color={colors.lightGrey} size={14} />
            )}
            {!otherUser && <Text style={styles.edit}>Edit profile...</Text>}
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.container}>
        {loading ? (
          <ActivityIndicator
            color={colors.white}
            size={'small'}
            style={styles.loading}
          />
        ) : (
          !Object.keys(posts).length && (
            <Text style={styles.text}>There are no posts yet ...</Text>
          )
        )}
        <PictureFeed
          posts={posts}
          extraPosts={extraPosts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          disableLike={true}
          disableUsername
          batchSize={batchSize}
          isSplit
          onPostPress={handlePostPress}
        />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    marginTop: 10,
  },
  headerRight: {
    flex: 1,
    marginLeft: 10,
  },
  image: {
    height: 100,
    width: 100,
    borderRadius: 100,
    marginHorizontal: 10,
  },
  editProfile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  edit: {
    color: colors.lightGrey,
    marginLeft: 2,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  username: {
    color: colors.yellow,
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  bio: {
    color: 'white',
    marginBottom: 6,
  },
  container: {
    flex: 1,
    marginHorizontal: 10,
    paddingTop: 20,
  },
  divider: {
    width: '90%',
    alignSelf: 'center',
    backgroundColor: colors.white,
    height: 1,
    marginVertical: 4,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    color: colors.lightGrey,
    textAlign: 'center',
    marginTop: 30,
  },
  loading: {
    marginTop: 30,
  },
});

export default Profile;
