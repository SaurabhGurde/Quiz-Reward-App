import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useAppSelector} from '../redux/store';

const Wallet = () => {
  const rewardPoints = useAppSelector(state => state.user.reward);

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <Icon name="coins" size={40} color="#FFD700" style={styles.coinIcon} />
        <Text style={styles.pointsText}>{rewardPoints} Points</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F9E6',
    alignItems: 'center',
    paddingTop: 20,
    justifyContent: 'center',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3D9A5',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  coinIcon: {
    marginRight: 15,
  },
  pointsText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
});

export default Wallet;
