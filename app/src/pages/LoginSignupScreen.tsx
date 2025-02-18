import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import Login from './login';
import SignUp from './SignUp';

const LoginSignupScreen = (props: any) => {
  const [isLoginEnabled, setIsLoginEnabled] = useState<boolean>(true);
  return (
    <View style={styles.container}>
      {isLoginEnabled ? (
        <Login
          {...props}
          isLoginEnabled={isLoginEnabled}
          setIsLoginEnabled={setIsLoginEnabled}
        />
      ) : (
        <SignUp
          {...props}
          isLoginEnabled={isLoginEnabled}
          setIsLoginEnabled={setIsLoginEnabled}
        />
      )}
    </View>
  );
};

export default LoginSignupScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
