import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';
import AuthContext from '../navigation/AuthContext';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';
import fonts from '../constants/fonts';
import firestore from '@react-native-firebase/firestore';

const Login = ({navigation}: any) => {
  const {signIn} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = () => {
    if (email === '' || password === '') {
      Toast.show('Please enter email and password');
      return;
    }
    setLoading(true);
    auth()
      .signInWithEmailAndPassword(email.trim(), password.trim())
      .then(() => {
        const currentUser = auth().currentUser;
        firestore()
          .collection('Users')
          .where('email', '==', currentUser?.email)
          .get()
          .then(snap => {
            snap.forEach(item => {
              setLoading(false);
              signIn(item.data());
            });
          });
      })
      .catch(err => {
        setLoading(false);
        Toast.show(err.code);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      {/* <BackBtn /> */}
      <View style={{padding: 20, flex: 1}}>
        <Text style={styles.welcomeText}>Welcome back,</Text>
        <Text style={styles.loginText}>Login to your account</Text>
        <View style={{marginTop: 40, flex: 1}}>
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
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="off"
            onChangeText={setPassword}
            placeholderTextColor="gray"
          />
          <Text
            style={{
              textAlign: 'right',
              fontFamily: fonts.bold,
              color: colors.primary,
            }}>
            Forgot Password
          </Text>
          <Button
            containerStyle={{marginTop: 20}}
            label="Login"
            onPress={handleLogin}
            loading={loading}
          />

          <View style={{flex: 1}} />

          <Text style={styles.createAcc}>
            Don't have an account?{' '}
            <Text
              onPress={() => navigation.navigate('SignUp')}
              style={{color: colors.primary}}>
              Signup Now
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#f7f7f7',
    marginBottom: 20,
    borderRadius: 30,
    paddingLeft: 20,
    height: 50,
  },
  create: {
    fontWeight: 'bold',
    color: colors.lightBlack,
  },
  createBtn: {
    margin: 40,
    alignSelf: 'center',
    borderWidth: 1,
    padding: 5,
    borderRadius: 10,
    borderColor: colors.lightBlack,
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
  createAcc: {
    marginBottom: 30,
    textAlign: 'center',
    fontSize: 17,
    fontFamily: fonts.regular,
  },
});
