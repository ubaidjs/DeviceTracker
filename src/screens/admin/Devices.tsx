import React, {useState, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  RefreshControl,
} from 'react-native';
import BackBtn from '../../components/BackBtn';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';
import DeviceCard from '../../components/DeviceCard';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';

const Devices = ({navigation}: any) => {
  const [devices, setDevices] = useState([]);
  const [term, setTerm] = useState('');

  useFocusEffect(
    useCallback(() => {
      fetchDevices();
    }, []),
  );

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
        });
    } catch (error) {
      console.log(error);
    }
  };

  const navigateToAdd = () => {
    navigation.navigate('AddDevice', {
      type: 'Add',
      data: {},
    });
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header
        title="Devices"
        showBack
        rightComp={
          <Pressable onPress={navigateToAdd}>
            <Icon name="pluscircleo" size={26} color="black" />
          </Pressable>
        }
      />
      <View style={{padding: 0, paddingTop: 0}}>
        <SearchBar value={term} onChangeText={setTerm} />
        <ScrollView
          contentContainerStyle={{paddingBottom: 200}}
          refreshControl={
            <RefreshControl onRefresh={fetchDevices} refreshing={false} />
          }>
          <View style={{padding: 20}}>
            {devices
              .filter((item: any) => {
                if (
                  item.deviceName.toLowerCase().includes(term.toLowerCase())
                ) {
                  return true;
                }
                if (item.serialNo.toLowerCase().includes(term.toLowerCase())) {
                  return true;
                }
                if (item.manageBy.toLowerCase().includes(term.toLowerCase())) {
                  return true;
                }
              })
              .map((item: any, i) => {
                return (
                  <DeviceCard
                    key={i}
                    item={item}
                    fetchDevices={fetchDevices}
                    type="admin"
                  />
                );
              })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Devices;

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
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: '#f7f7f7',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  deviceName: {
    fontWeight: '500',
    color: colors.lightBlack,
    fontSize: 18,
    marginBottom: 3,
  },
  row: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  search: {
    backgroundColor: '#f7f7f7',
    height: 40,
    borderRadius: 50,
    paddingLeft: 10,
    marginBottom: 20,
    marginHorizontal: 20,
  },
});
