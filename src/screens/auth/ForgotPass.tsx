import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import BackBtn from '../../components/BackBtn';
import Button from '../../components/Button';
import colors from '../../constants/colors';
import fonts from '../../constants/fonts';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';

const ForgotPass = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMail = () => {
    if (email === '') {
      Toast.show('Please enter email address');
      return;
    }
    auth()
      .sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert('', `Password reset link sent to your email ${email}`);
      })
      .catch(err => {
        console.log(err);
        Toast.show(err.code);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <BackBtn />
      <ScrollView>
        <View style={{padding: 20, flex: 1, paddingTop: 0}}>
          <Text style={styles.welcomeText}>Forgot Password?</Text>
          <Text style={styles.loginText}>Give us your email</Text>
          <View style={{marginVertical: 20}} />
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="email"
            onChangeText={setEmail}
            placeholderTextColor="gray"
          />
          <Button
            containerStyle={{marginTop: 20}}
            label="Submit"
            onPress={sendMail}
            loading={loading}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default ForgotPass;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#ffffff',
    marginBottom: 20,
    borderRadius: 30,
    paddingLeft: 20,
    height: 50,
  },
  welcomeText: {
    fontSize: 26,
    color: colors.lightBlack,
    marginBottom: 10,
    marginTop: 20,
    fontFamily: fonts.regular,
  },
  loginText: {
    fontSize: 26,
    color: colors.primary,
    fontWeight: 'bold',
    fontFamily: fonts.bold,
  },
});
