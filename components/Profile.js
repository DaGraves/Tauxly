import React, {useContext, useRef} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Clipboard,
} from 'react-native';
import {Toast} from 'native-base';
import ImageCustom from './ImageCustom';
import {DEFAULT_PROFILE_PICTURE} from '../constants';
import {PictureFeed} from './index';
import {StoreContext} from '../store/StoreContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../styles/common';
import ActionSheet from 'react-native-actionsheet';
import {useNavigation} from '@react-navigation/native';

const Profile = ({
  handleLogOut,
  handleEditProfile,
  posts,
  extraPosts,
  setPosts,
  fetchPosts,
  batchSize,
  otherUser,
}) => {
  const myUser = useContext(StoreContext).user;
  const navigation = useNavigation();
  const user = otherUser || myUser;

  const actionSheetRef = useRef(null);

  const handleMenuPress = idx => {
    if (idx === 0) {
      handleLogOut();
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

  const handlePostPress = id => navigation.navigate('Post', {id});

  return (
    <>
      <ActionSheet
        ref={actionSheetRef}
        title={'Options'}
        options={['Sign Out', 'Cancel']}
        cancelButtonIndex={1}
        onPress={handleMenuPress}
      />
      <View style={styles.header}>
        <View>
          <ImageCustom
            source={{uri: user.photoUrl || DEFAULT_PROFILE_PICTURE}}
            style={styles.image}
          />
          {otherUser &&
            (otherUser.facebook ||
              otherUser.instagram ||
              otherUser.twitter) && (
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
            )}
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
        <PictureFeed
          posts={posts}
          extraPosts={extraPosts}
          setPosts={setPosts}
          fetchPosts={fetchPosts}
          disableLike
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
});

export default Profile;
