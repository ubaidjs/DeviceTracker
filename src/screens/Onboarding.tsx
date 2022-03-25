import React, {useEffect} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';
// import auth from '@react-native-firebase/auth';

const Onboarding = ({navigation}: any) => {
  // useEffect(() => {
  //   checkIsLogin();
  // }, []);

  // const checkIsLogin = () => {
  //   try {
  //     const currentUser = auth().currentUser;
  //     console.log(currentUser);
  //     if (currentUser !== null) {
  //       navigation.navigate('AdminHome');
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Image
        style={{height: 150, width: 150}}
        source={require('../assets/logo.png')}
      />
      <Text
        style={{
          fontSize: 22,
          fontWeight: 'bold',
          color: colors.lightBlack,
          marginTop: 20,
        }}>
        Valere Device Tracker
      </Text>
      <View style={{alignSelf: 'stretch'}}>
        <View style={{marginVertical: 40}} />
        <Button
          label="Admin Login"
          onPress={() => {
            navigation.navigate('Login', {
              role: 'admin',
            });
          }}
          outline
        />
        <View style={{marginVertical: 10}} />
        <Button
          label="Employee Login"
          onPress={() => {
            navigation.navigate('Login', {
              role: 'employee',
            });
          }}
        />
      </View>
    </View>
  );
};

export default Onboarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'stretch',
    padding: 20,
  },
});
