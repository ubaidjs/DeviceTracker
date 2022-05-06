import React, {useState, useCallback} from 'react';
import {StyleSheet, Text, View, ScrollView, RefreshControl} from 'react-native';
import colors from '../../constants/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import DeviceCardUser from '../../components/DeviceCardUser';
import useStore from '../../constants/store';
import messaging from '@react-native-firebase/messaging';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import fonts from '../../constants/fonts';

const Home = () => {
  const store = useStore();
  const [user, setUser] = useState<any>({});
  const [userDevice, setUserDevice] = useState([]);
  const [pendingRequest, setPendingRequest] = useState([]);
  const [loading, setLoading] = useState(false);
  const [term, setTerm] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchCurrentUser();
    }, []),
  );

  const fetchCurrentUser = async () => {
    let id;
    setLoading(true);
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
          fetchUserDevice(item.data().id);
          fetchPendingRequest(item.data().id);
        });
      });

    const token = await messaging().getToken();

    await firestore().collection('Users').doc(id).update({
      pushToken: token,
    });
    setLoading(false);
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

  const onRefresh = () => {
    fetchUserDevice(user.id);
    fetchPendingRequest(user.id);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="My Devices" />
      <SearchBar value={term} onChangeText={setTerm} />
      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={onRefresh} refreshing={loading} />
        }>
        <View style={{padding: 20}}>
          {user.role === 'employee' && (
            <View>
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

              {userDevice
                .filter((item: any) => {
                  if (
                    item.deviceName.toLowerCase().includes(term.toLowerCase())
                  ) {
                    return true;
                  }
                  if (
                    item.serialNo.toLowerCase().includes(term.toLowerCase())
                  ) {
                    return true;
                  }
                })
                .map((item: any) => {
                  return (
                    <DeviceCardUser
                      key={item.deviceId}
                      item={item}
                      fetchUserDevice={fetchUserDevice}
                      fetchPendingRequest={fetchPendingRequest}
                    />
                  );
                })}

              {userDevice.length === 0 && !loading && (
                <Text style={styles.placeholder}>You dont have any device</Text>
              )}
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
  boldText: {
    fontWeight: 'bold',
    color: colors.lightBlack,
    marginBottom: 20,
  },
  placeholder: {
    fontSize: 18,
    color: 'gray',
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginTop: 40,
  },
});
