import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import CheckBox from '@react-native-community/checkbox';
import {hp, wp} from '../common/responsive';
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
  email: string;
  password: string;
};

type logInResp = {
  data?: {
    [key: string]: any
  }
  [key: string]: any
}

const Login = (props: propsType) => {
    let dispatch = useAppDispatch()
  const {isLoginEnabled, setIsLoginEnabled} = props;
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<signUpFormType>({
    email: '',
    password: '',
  });

    const handleInputChange = (key: keyof signUpFormType, value: any) => {
      setFormData({...formData, [key]: value});
    };
  const handleFormSubmit = async () => {
    let res;
    try {
      res = await api.post<logInResp>('login', formData, dispatch);
      if (res && res.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Login Successfull',
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
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Log In</Text>

      <View style={styles.inputContainerMain}>
        <Text style={styles.subtitle}>Welcome Back!</Text>
        <Text style={styles.infoText}>
          To keep connected with us please login with your personal info
        </Text>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email Address"
            placeholderTextColor="#999"
            keyboardType="email-address"
            autoCapitalize="none"
            value={formData.email}
            onChangeText={(text)=>handleInputChange("email", text)}
          />
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#999"
            secureTextEntry={!showPassword}
            value={formData.password}
            onChangeText={(text)=>handleInputChange("password", text)}
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

        <View style={styles.rememberContainer}>
          <CheckBox
            value={rememberMe}
            onValueChange={setRememberMe}
            tintColors={{true: '#4CAF50', false: '#999'}}
          />
          <Text style={styles.rememberText}>Remember me?</Text>
        </View>

        <TouchableOpacity
          onPress={handleFormSubmit}
          style={styles.signInButton}>
          <Text style={styles.signInText}>Login In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setIsLoginEnabled(!isLoginEnabled)}
          style={styles.createAccountButton}>
          <Text style={{...styles.signInText, color: 'black'}}>
            Create Account
          </Text>
        </TouchableOpacity>
      </View>
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
    elevation: 3,
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
  forgotText: {
    marginLeft: 'auto',
    fontSize: 14,
    color: '#2D8E4E',
    fontWeight: '600',
  },
  signInButton: {
    backgroundColor: '#2D8E4E',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '100%',
  },
  createAccountButton: {
    // backgroundColor: '#2D8E4E',
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

export default Login;
