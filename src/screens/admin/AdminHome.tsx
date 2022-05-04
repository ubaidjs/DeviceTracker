import {useFocusEffect} from '@react-navigation/native';
import React, {useCallback, useContext, useState} from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../../constants/colors';
import useStore from '../../constants/store';
import AuthContext from '../../navigation/AuthContext';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import Header from '../../components/Header';
import fonts from '../../constants/fonts';

const AdminHome = ({navigation}: any) => {
  const store = useStore();
  const {signOut} = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [availableDevice, setAvailableDevice] = useState([]);
  const [devices, setDevices] = useState([]);

  useFocusEffect(
    useCallback(() => {
      fetchCurrentUser();
      fetchUsers();
    }, []),
  );

  const onRefresh = () => {
    fetchDevices();
  };

  //admin
  const fetchDevices = async () => {
    try {
      firestore()
        .collection('Devices')
        .get()
        .then(snapshot => {
          let temp: any = [];
          snapshot.forEach(item => {
            temp.push(item.data());
          });
          setDevices(temp);
          setAvailableDevice(
            temp.filter((item: any) => item.manageById === ''),
          );
        });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCurrentUser = async () => {
    let id;
    const currentUser = auth().currentUser;
    await firestore()
      .collection('Users')
      .where('email', '==', currentUser?.email)
      .get()
      .then(snap => {
        snap.forEach(item => {
          id = item.id;
          store.setUser(item.data());
          onRefresh();
        });
      });

    const token = await messaging().getToken();

    await firestore().collection('Users').doc(id).update({
      pushToken: token,
    });
  };

  const fetchUsers = async () => {
    const fetchedUsers = await firestore()
      .collection('Users')
      .orderBy('name')
      .get()
      .then(snap => {
        let temp: any = [];
        snap.forEach(item => {
          temp.push(item.data());
        });
        return temp;
      });
    setUsers(fetchedUsers.filter((item: any) => item.role !== 'admin'));
  };

  const handleSignOut = () => {
    signOut();
    auth().signOut();
  };

  const signOutAlert = () => {
    Alert.alert('', 'Are you sure you want to log out?', [
      {text: 'Yes', onPress: handleSignOut},
      {text: 'Cancel', onPress: () => {}},
    ]);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="Admin Dashboard" />
      <View style={{padding: 20, flex: 1}}>
        <Pressable
          style={styles.box}
          onPress={() => navigation.navigate('Devices')}>
          <View style={styles.iconWrap}>
            <Icon name="mobile1" size={40} color="#fff" />
          </View>
          <View style={{marginLeft: 10}}>
            <Text style={styles.boxTitle}>Devices</Text>
            <Text style={styles.grayText}>
              Available devices:{' '}
              <Text style={{color: colors.primary}}>
                {availableDevice.length}
              </Text>
            </Text>
            <Text style={styles.grayText}>
              Total Devices:{' '}
              <Text style={{color: colors.primary}}>{devices.length}</Text>
            </Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.box}
          onPress={() => navigation.navigate('Users')}>
          <View style={styles.iconWrap}>
            <Icon name="user" size={40} color="#fff" />
          </View>
          <View style={{marginLeft: 10}}>
            <Text style={styles.boxTitle}>Users</Text>
            <Text style={styles.grayText}>
              Total Users:{' '}
              <Text style={{color: colors.primary}}>{users.length}</Text>
            </Text>
          </View>
        </Pressable>
      </View>
      <Pressable onPress={signOutAlert} style={styles.logout}>
        <Text style={styles.logoutText}>Logout</Text>
      </Pressable>
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  box: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 100,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  boxTitle: {
    color: colors.primary,
    fontSize: 22,
    marginBottom: 5,
    fontFamily: fonts.bold,
  },
  boldText: {
    fontWeight: 'bold',
    color: colors.lightBlack,
    marginBottom: 20,
  },
  grayText: {
    color: '#9F9EAB',
    fontFamily: fonts.bold,
    fontSize: 17,
  },
  iconWrap: {
    height: 80,
    width: 80,
    backgroundColor: '#C2E9FB',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
});
