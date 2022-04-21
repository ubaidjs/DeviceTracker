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

const AdminHome = ({navigation}: any) => {
  const store = useStore();
  const {signOut} = useContext(AuthContext);
  const [user, setUser] = useState<any>({
    email: '',
    id: '',
    name: '',
    password: '',
    phone: '',
    role: '',
  });
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
          setUser(item.data());
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

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <View style={styles.header}>
        <View>
          <Text style={{color: 'black'}}>{user.name}</Text>
          <Text style={styles.h1}>Dashboard</Text>
        </View>
        <Pressable
          onPress={() => {
            Alert.alert('', 'Are you sure you want to log out?', [
              {text: 'Yes', onPress: handleSignOut},
              {text: 'Cancel', onPress: () => {}},
            ]);
          }}>
          <Icon name="logout" size={25} color="orangered" />
        </Pressable>
      </View>
      <View style={styles.boxWrap}>
        <Pressable
          style={styles.box}
          onPress={() => navigation.navigate('Devices')}>
          <Icon name="mobile1" size={25} color={colors.lightBlack} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.boxTitle}>Devices</Text>
            <Text>Available devices: {availableDevice.length}</Text>
            <Text>Total Devices: {devices.length}</Text>
          </View>
        </Pressable>

        <Pressable
          style={styles.box}
          onPress={() => navigation.navigate('Users')}>
          <Icon name="user" size={25} color={colors.lightBlack} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.boxTitle}>Users</Text>
            <Text>Total Users: {users.length}</Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
};

export default AdminHome;

const styles = StyleSheet.create({
  box: {
    // width: width / 2 - 30,
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  boxTitle: {
    color: colors.lightBlack,
    fontWeight: 'bold',
    fontSize: 17,
    marginBottom: 5,
  },
  boxWrap: {
    marginTop: 40,
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  boldText: {
    fontWeight: 'bold',
    color: colors.lightBlack,
    marginBottom: 20,
  },
});
