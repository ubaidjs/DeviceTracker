import React, {useContext, useState} from 'react';
import {StyleSheet, Text, View, TextInput, Pressable} from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';
import {AuthContext} from '../navigation/AppNavigation';
import Toast from 'react-native-simple-toast';
import auth from '@react-native-firebase/auth';

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
        setLoading(false);
        signIn();
      })
      .catch(err => {
        setLoading(false);
        Toast.show(err.code);
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <BackBtn /> */}
      <View style={{padding: 20}}>
        <Text
          style={{fontSize: 30, color: colors.lightBlack, fontWeight: 'bold'}}>
          Login
        </Text>
        <View style={{marginTop: 40}}>
          <TextInput
            placeholder="Email"
            style={styles.input}
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="email"
            onChangeText={setEmail}
          />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry={true}
            autoCorrect={false}
            autoCapitalize="none"
            autoComplete="off"
            onChangeText={setPassword}
          />
          <Button
            containerStyle={{marginTop: 20}}
            label="Login"
            onPress={handleLogin}
            loading={loading}
          />
          <Pressable
            style={{margin: 40, alignSelf: 'center'}}
            onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.create}>Create Account</Text>
          </Pressable>
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
    borderRadius: 10,
    paddingLeft: 10,
    height: 50,
  },
  create: {
    fontWeight: 'bold',
    color: colors.lightBlack,
  },
});
