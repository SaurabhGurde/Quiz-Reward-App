import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import {BottomTabNavigationProp} from '@react-navigation/bottom-tabs';
import {RouteProp} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {
  canClaimBonus,
  getRemainingTime,
  handleDailyBonus,
} from '../common/helperFunctions';
import api from '../api';
import Toast from 'react-native-toast-message';
import {setInitialUserDetails} from '../redux/userSlice';
import {getItem, setItem} from '../common/AsyncStorage';

type propstype = {
  navigation: BottomTabNavigationProp<any, 'home'>;
  route: RouteProp<any, 'home'>;
};
type resType = {
  data?: {
    [key: string]: any;
  };
  [key: string]: any;
};

const HomeScreen = (props: propstype) => {
  let dispatch = useAppDispatch();
  const rewardPoints = useAppSelector(state => state.user.reward);
  const userDetails = useAppSelector(state => state.user);

  const handleCoinpress = () => {
    props.navigation.navigate('wallet');
  };

  const [remainingTime, setRemainingTime] = useState(getRemainingTime());
  const [canClaim, setCanClaim] = useState(false);

  useEffect(() => {
    const checkBonusEligibility = async () => {
      setCanClaim(await canClaimBonus());
    };

    checkBonusEligibility();

    const timer = setInterval(() => {
      setRemainingTime(getRemainingTime());
    }, 1000);

    return () => clearInterval(timer);
  }, [dispatch]);

  const handleDailyBonusclaim = async () => {
    if (canClaim) {
      let res = await api.post<resType>(
        'data/handleDailyUserbonus',
        {id: userDetails.id},
        dispatch,
      );
      if (res.status === 200) {
       await handleDailyBonus();
        let userDetails = await getItem('userDetails');
        await setItem('userDetails', {
          ...userDetails,
          ...res.data.user,
        });
        dispatch(setInitialUserDetails(res.data.user));
        Toast.show({
          type: 'success',
          text2: 'Bonus claimed successfully!',
        });
      } else {
        Toast.show({
          type: 'error',
          text2: 'Failed to claim Bonus try again!',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text2: `you can clain next bonus in ${remainingTime}`,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => props.navigation.navigate('Profile')}>
          <Icon name="account-circle" size={30} color="#2E7D32" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleCoinpress}
          style={styles.pointsContainer}>
          <FontAwesome5
            name="coins"
            size={20}
            color="#FFD700"
            style={styles.coinIcon}
          />
          <Text style={styles.points}>{rewardPoints}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tilesContainer}>
        <TouchableOpacity onPress={handleDailyBonusclaim} style={styles.tile}>
          <Text style={styles.tileText}>Daily Bonus</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => props.navigation.navigate('Quiz')}
          style={styles.tile}>
          <Text style={styles.tileText}>Quiz Time</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F9E6',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 5,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#A3D9A5',
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#A3D9A5',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  coinIcon: {
    marginRight: 5,
  },
  points: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  tilesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  tile: {
    backgroundColor: '#A3D9A5',
    padding: 20,
    flex: 1,
    marginHorizontal: 10,
    alignItems: 'center',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  tileText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
});

export default HomeScreen;
