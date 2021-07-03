import React from 'react';
import {GradientBackground} from '../components';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {Text} from 'native-base';
import {colors} from '../styles/common';

const RulesScreen = props => {
  return (
    <GradientBackground>
      <SafeAreaView style={{flex: 1}}>
        <ScrollView contentContainerStyle={{padding: 20, flex: 1}}>
          <Text style={styles.title}>Instructions / Rules:</Text>

          <Text style={styles.description}>
            Every single day the contest is reset. If you submit a photo you are
            entered to win one of the prizes shown on the leaderboard. You can
            vote for entries at any time and the picture with the highest vote
            count wins that day. At the end of the contest day, everything gets
            reset and you can submit other entries for next day’s contest. Note
            that in any given day you are free to submit as many pictures as you
            like. In order to check past winners, click on the date on the
            leaderboard page and choose the date you’d like to see.
          </Text>

          <Text style={styles.rule}>1. No nudity or adult content</Text>
          <Text style={styles.rule}>
            2. Violating posts will be taken down and no refund
          </Text>
          <Text style={styles.rule}>3. Users must be 17+ to enter contest</Text>
          <Text style={styles.rule}>
            4. 99 cents (USD) per contest entry (unlimited entries per contest)
          </Text>
          <Text style={styles.rule}>
            5. Contests concludes at 5:00pm Eastern time (US)
          </Text>
          <Text style={styles.rule}>
            6. More entries per contest, the bigger the rewards
          </Text>
          <Text style={styles.rule}>
            7. All contest rewards will paid out via PayPal. User must have a
            PayPal account to receive rewards.
          </Text>

          <Text style={styles.disclaimer}>
            Disclaimer: Apple is not a sponsor for these contests or does not
            associate directly with them.
          </Text>
        </ScrollView>
      </SafeAreaView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  title: {
    color: colors.white,
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 20,
  },
  description: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 30,
  },
  rule: {
    color: colors.white,
    fontSize: 18,
    marginBottom: 5,
  },
  disclaimer: {
    color: colors.white,
    fontSize: 20,
    marginTop: 30,
  },
});

export default RulesScreen;
