import React, {useContext, useEffect, useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {StoreContext} from '../store/StoreContext';
import {ActivityItem, ListDivider} from '../components';
import {colors} from '../styles/common';
import {useNavigation} from '@react-navigation/native';

const ActivityScreen = props => {
  const {user} = useContext(StoreContext);
  const navigation = useNavigation();
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchInteractions = async () => {
    if (user) {
      setLoading(true);
      try {
        const fbData = await firestore()
          .collection('interactions')
          .where('creatorId', '==', user.id)
          .orderBy('timestamp', 'desc')
          .limit(20)
          .get();
        setInteractions(
          fbData.docs.map(item => ({id: item.id, ...item.data()})),
        );
      } catch (e) {
        Alert.alert(
          'Something went wrong',
          "We couldn't fetch your interactions... Please try again later!",
          [
            {
              text: 'Ok',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      } finally {
        setLoading(false);
      }
    }
  };

  const goToPost = id => {
    navigation.navigate('Post', {id});
  };

  useEffect(() => {
    fetchInteractions();
  }, []);

  return (
    <View style={styles.baseline}>
      <SafeAreaView style={styles.baseline}>
        {loading ? (
          <ActivityIndicator
            color={colors.white}
            size={'small'}
            style={styles.loading}
          />
        ) : (
          !interactions.length && (
            <Text style={styles.text}>You have no interactions yet...</Text>
          )
        )}

        <FlatList
          data={interactions}
          renderItem={item => <ActivityItem {...item} goToPost={goToPost} />}
          keyExtractor={item => item.id}
          ItemSeparatorComponent={ListDivider}
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  baseline: {
    flex: 1,
    backgroundColor: colors.black,
  },
  text: {
    color: colors.lightGrey,
    textAlign: 'center',
    marginTop: 30,
  },
  loading: {
    marginTop: 40,
  },
});

export default ActivityScreen;
