import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Share} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Clipboard from '@react-native-clipboard/clipboard';
import { useAppSelector } from '../redux/store';
import Toast from 'react-native-toast-message';

const ReferFriend = () => {
  const user = useAppSelector(state => state.user);

  const handleCopyReferralCode = () => {
    if (user.referalCode) {
      Clipboard.setString(user.referalCode);
      Toast.show({
        type: 'success',
        text2: "Referal code copied!"
      })
    }
  };

  const handleShareReferralCode = async () => {
    try {
      await Share.share({
        message: `Join me on this amazing app! Use my referral code: ${user.referalCode}`,
      });
    } catch (error) {
      console.error('Error sharing referral code', error);
      Toast.show({
        type: 'error',
        text2: "Error sharing referral code"
      })
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <FontAwesome5 name="gift" size={40} color="#FFD700" style={styles.giftIcon} />
        <Text style={styles.title}>Invite a Friend</Text>
        <Text style={styles.description}>
          Share your referral code with your friends and earn reward points when they sign up.
        </Text>
        <Text style={styles.codeText}>
          Your Referral Code: <Text style={styles.code}>{user.referalCode}</Text>
        </Text>
      </View>

      {/* Copy Referral Code */}
      <TouchableOpacity style={styles.copyButton} onPress={handleCopyReferralCode}>
        <Text style={styles.copyButtonText}>Copy Referral Code</Text>
        <Icon name="content-copy" size={20} color="#FFF" style={styles.copyIcon} />
      </TouchableOpacity>

      {/* Share Button */}
      <TouchableOpacity style={styles.shareButton} onPress={handleShareReferralCode}>
        <Text style={styles.shareText}>Share Referral Code</Text>
        <Icon name="share" size={20} color="#FFF" style={styles.shareIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6F9E6',
    padding: 20,
    justifyContent: 'center'
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
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  giftIcon: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  description: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 15,
  },
  codeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1B5E20',
  },
  code: {
    fontSize: 18,
    fontWeight: 'normal',
    color: '#2E7D32',
  },
  copyButton: {
    backgroundColor: '#A3D9A5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 20,
  },
  copyButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  copyIcon: {
    marginLeft: 10,
  },
  shareButton: {
    backgroundColor: '#A3D9A5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  shareText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  shareIcon: {
    marginLeft: 10,
  },
});

export default ReferFriend;
