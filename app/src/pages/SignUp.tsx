import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import {hp, wp} from '../common/responsive';
import DatePicker from 'react-native-date-picker';
import api from '../api/index';
import Toast from 'react-native-toast-message';
import { setItem } from '../common/AsyncStorage';
import { useAppDispatch } from '../redux/store';
import { setInitialUserDetails } from '../redux/userSlice';

type propsType = {
  isLoginEnabled: boolean;
  setIsLoginEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  [key: string]: any
};

export type signUpFormType = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: Date | null;
  password: string;
  partnerReferalCode?: string
};

type logInResp = {
  data?: {
    [key: string]: any
  }
  [key: string]: any
}


const SignUp = (props: propsType) => {
  let dispatch = useAppDispatch()
  const {isLoginEnabled, setIsLoginEnabled} = props;

  const [formData, setFormData] = useState<signUpFormType>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    dob: null,
    password: '',
  });
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isDatePickerOpened, setIsDatePickerOpened] = useState<boolean>(false);

  const handleInputChange = (key: keyof signUpFormType, value: any) => {
    setFormData({...formData, [key]: value});
  };


  const handleFormSubmit = async () => {
    let res
    try {
      res = await api.post<logInResp>("signup", formData, dispatch)
        if(res && res.status === 200){
          Toast.show({
            type: 'success',
            text1: 'Sign Up Successfull'
          });
           await setItem("userDetails", res.data.user)
           dispatch(setInitialUserDetails(res.data.user))
           props.navigation.navigate("Main")
        }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: typeof error === "string" ? error : 'Something went worng!',
      });
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <ScrollView>
        <View style={styles.inputContainerMain}>
          <Text style={styles.subtitle}>Welcome!</Text>
          <Text style={styles.infoText}>
            Please sign up with your personal info to continue.
          </Text>

          {/* First Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#999"
              autoCapitalize="none"
              value={formData.firstName}
              onChangeText={text => handleInputChange('firstName', text)}
            />
          </View>

          {/* Last Name */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#999"
              autoCapitalize="none"
              value={formData.lastName}
              onChangeText={text => handleInputChange('lastName', text)}
            />
          </View>

          {/* Phone Number */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={10}
              autoCapitalize="none"
              value={formData.phone}
              onChangeText={text => handleInputChange('phone', text)}
            />
          </View>

          {/* Email Address */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              keyboardType="email-address"
              autoCapitalize="none"
              value={formData.email}
              onChangeText={text => handleInputChange('email', text)}
            />
          </View>

          {/* Date of Birth */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Date of Birth"
              placeholderTextColor="#999"
              editable={false}
              value={formData.dob ? formData.dob.toLocaleDateString() : ''}
            />
            <TouchableOpacity
              onPress={() => setIsDatePickerOpened(true)}
              style={styles.calendarIcon}>
              <Icon name="calendar" size={20} color="#999" />
            </TouchableOpacity>
            <DatePicker
              modal
              open={isDatePickerOpened}
              // If dob is null, show today's date in the picker
              date={formData.dob ? formData.dob : new Date()}
              mode="date"
              onConfirm={date => {
                setIsDatePickerOpened(false);
                handleInputChange('dob', date);
              }}
              onCancel={() => {
                setIsDatePickerOpened(false);
              }}
            />
          </View>

          {/* Password */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={formData.password}
              onChangeText={text => handleInputChange('password', text)}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eyeIcon}>
              <Icon
                name={showPassword ? 'eye-off' : 'eye'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Referal code (optional)"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={formData.partnerReferalCode}
              onChangeText={text => handleInputChange('partnerReferalCode', text)}
            />
          </View>

          {/* Remember Me */}
          <View style={styles.rememberContainer}>
            <CheckBox
              value={rememberMe}
              onValueChange={setRememberMe}
              tintColors={{true: '#4CAF50', false: '#999'}}
            />
            <Text style={styles.rememberText}>Remember me?</Text>
          </View>

          {/* Sign Up Button */}
          <TouchableOpacity onPress={()=> handleFormSubmit()} style={styles.signInButton}>
            <Text style={styles.signInText}>Sign Up</Text>
          </TouchableOpacity>

          {/* Switch to Log In */}
          <TouchableOpacity
            onPress={() => setIsLoginEnabled(!isLoginEnabled)}
            style={styles.createAccountButton}>
            <Text style={{...styles.signInText, color: 'black'}}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#64Bc95',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
    height: hp(20),
    paddingTop: hp(6),
    paddingLeft: wp(5),
  },
  inputContainerMain: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: hp(5),
    paddingHorizontal: wp(5),
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2D8E4E',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Shadow for Android
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  eyeIcon: {
    position: 'absolute',
    right: 15,
  },
  calendarIcon: {
    position: 'absolute',
    right: 15,
  },
  rememberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  rememberText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#666',
  },
  signInButton: {
    backgroundColor: '#2D8E4E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  createAccountButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  signInText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SignUp;
