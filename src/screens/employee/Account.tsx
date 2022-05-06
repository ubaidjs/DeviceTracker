import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import auth from '@react-native-firebase/auth';
import Header from '../../components/Header';
import fonts from '../../constants/fonts';
import AuthContext from '../../navigation/AuthContext';
import useStore from '../../constants/store';
import colors from '../../constants/colors';
import Ant from 'react-native-vector-icons/AntDesign';

const Option = ({icon, label, onPress}: any) => {
  return (
    <Pressable
      onPress={onPress}
      style={{flexDirection: 'row', alignItems: 'center', marginBottom: 20}}>
      <Ant name={icon} color={colors.lightBlack} size={20} />
      <Text style={{fontFamily: fonts.regular, fontSize: 18, marginLeft: 10}}>
        {label}
      </Text>
    </Pressable>
  );
};

const Account = ({navigation}: any) => {
  const {signOut} = useContext(AuthContext);
  const user = useStore(state => state.user);

  const handleSignOut = () => {
    signOut();
    auth().signOut();
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="Account" />
      <View style={{flex: 1}}>
        <View style={styles.card}>
          <Text style={{fontSize: 20, fontFamily: fonts.bold}}>
            {user.name}
          </Text>
          <Text>{user.email}</Text>
        </View>

        <View style={{margin: 23}}>
          <Option icon="edit" label="Edit Profile" />
          <Option
            icon="unlock"
            label="Forogot Password"
            onPress={() => navigation.navigate('ForgotPass')}
          />
        </View>
      </View>
      <Pressable onPress={handleSignOut} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default Account;

const styles = StyleSheet.create({
  logout: {
    backgroundColor: 'orangered',
    padding: 12,
    paddingHorizontal: 20,
    alignSelf: 'center',
    borderRadius: 50,
  },
  logoutText: {
    color: '#fff',
    fontFamily: fonts.bold,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    margin: 20,
    padding: 20,
  },
});
