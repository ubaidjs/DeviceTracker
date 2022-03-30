import React, {useContext, useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Pressable,
  RefreshControl,
} from 'react-native';
import colors from '../constants/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import {AuthContext} from '../navigation/AppNavigation';
import Icon from 'react-native-vector-icons/AntDesign';
import DeviceCardUser from '../components/DeviceCardUser';
import useStore from '../constants/store';
import messaging from '@react-native-firebase/messaging';

const Home = ({navigation}: any) => {
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

  const [devices, setDevices] = useState([]);
  const [availableDevice, setAvailableDevice] = useState([]);
  const [users, setUsers] = useState([]);
  const [userDevice, setUserDevice] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = () => {
    fetchDevices();
  };

  useFocusEffect(
    useCallback(() => {
      fetchCurrentUser();
    }, []),
  );

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
          if (item.data().role === 'admin') {
            onRefresh();
          } else {
            fetchUserDevice(item.data().id);
            fetchPendingRequest(item.data().id);
          }
        });
      });

    const token = await messaging().getToken();

    await firestore().collection('Users').doc(id).update({
      pushToken: token,
    });
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

  const fetchUserDevice = async (id: string) => {
    const fetchedDevice = await firestore()
      .collection('Devices')
      .where('manageById', '==', id)
      .get();
    let temp: any = [];
    fetchedDevice.forEach(item => temp.push(item.data()));
    setUserDevice(temp);
  };

  const fetchPendingRequest = async (id: string) => {
    await firestore()
      .collection('Requests')
      .where('userId', '==', id)
      .get()
      .then(snapshot => {
        let temp: any = [];
        snapshot.forEach(item => {
          temp.push({...item.data(), reqDocId: item.id});
        });
        setPendingRequest(temp);
      });
  };

  const handleSignOut = () => {
    signOut();
    auth().signOut();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              if (user.role === 'admin') {
                onRefresh();
              } else {
                fetchUserDevice(user.id);
                fetchPendingRequest(user.id);
              }
            }}
            refreshing={false}
          />
        }>
        <View style={{padding: 20}}>
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
          {user.role === 'admin' && (
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
          )}

          {user.role === 'employee' && (
            <View style={styles.boxWrap}>
              <View>
                {pendingRequest.length !== 0 && (
                  <Text style={styles.boldText}>Pending Requests</Text>
                )}
                {pendingRequest.map((device: any, i) => {
                  return (
                    <DeviceCardUser
                      key={i}
                      item={device}
                      type="request"
                      fetchUserDevice={fetchUserDevice}
                      fetchPendingRequest={fetchPendingRequest}
                    />
                  );
                })}
              </View>

              <Text style={styles.boldText}>My Devices</Text>
              {userDevice.map((item: any) => {
                return (
                  <DeviceCardUser
                    key={item.deviceId}
                    item={item}
                    users={users.filter((usr: any) => usr.id !== user.id)}
                    fetchUserDevice={fetchUserDevice}
                    fetchPendingRequest={fetchPendingRequest}
                  />
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.lightBlack,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
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
  modalView: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
  },
  modalItem: {
    backgroundColor: '#f7f7f7',
    padding: 20,
    marginBottom: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
});
