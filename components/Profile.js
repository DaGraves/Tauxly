import React, {useContext, useRef} from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import ImageCustom from './ImageCustom';
import {DEFAULT_PROFILE_PICTURE} from '../constants';
import {ListDivider, PictureFeed} from './index';
import {StoreContext} from '../store/StoreContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../styles/common';
import ActionSheet from 'react-native-actionsheet';

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
  const user = otherUser || myUser;

  const actionSheetRef = useRef(null);

  const handleMenuPress = idx => {
    if (idx === 0) {
      handleLogOut();
    }
  };

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
});

export default Profile;
