import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const deleteAccountData = async () => {
  try {
    const user = await auth().currentUser;
    const {uid} = user;

    // Delete user from Firestore, the USERS collection
    const userRef = await firestore()
      .collection('users')
      .doc(uid);
    const fbUser = await userRef.get();
    if (fbUser.exists) {
      const {photoId} = fbUser && fbUser.data();
      await userRef.delete();

      // Delete the user's profile picture from STORAGE
      if (photoId) {
        const profilePictureRef = storage().ref(`users/${photoId}`);
        try {
          await profilePictureRef.getDownloadURL();
          profilePictureRef.delete();
        } catch (e) {
          console.log('Minor >>> ', e);
        }
      }
    }

    // Delete the user's posts (also keep track of the posts I delete)
    const posts = await firestore()
      .collection('posts')
      .where('userId', '==', uid)
      .get();
    const postPromises = posts.docs.map(doc => {
      return doc.ref.delete();
    });
    Promise.all(postPromises);
    const postIds = posts.docs.map(post => post.id);

    const comments = await firestore()
      .collection('comments')
      .where('userId', '==', uid)
      .get();
    const commentPromises = comments.docs.map(doc => {
      return doc.ref.delete();
    });
    Promise.all(commentPromises);
    const commentIds = comments.docs.map(com => com.id);

    console.log('<<< DELETE FROM AUTH >>>');
    // Delete user from AUTH
    await user.delete();
    return true;
  } catch (e) {
    console.log('ERROR', e);
    return false;
  }
};

export default deleteAccountData;
