import React, {useState, useEffect} from 'react';
import {StyleSheet, View, ScrollView, RefreshControl} from 'react-native';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import DeviceCard from '../../components/DeviceCard';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';

const Devices = () => {
  const [devices, setDevices] = useState([]);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDevices();
  }, []);

  const fetchDevices = async () => {
    try {
      setLoading(true);
      firestore()
        .collection('Devices')
        .get()
        .then(snapshot => {
          let temp: any = [];
          snapshot.forEach(item => {
            temp.push(item.data());
          });
          setDevices(temp);
          setLoading(false);
        })
        .catch(err => {
          setLoading(false);
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="All Devices" />
      <View style={{padding: 0, paddingTop: 0}}>
        <SearchBar value={term} onChangeText={setTerm} />
        <ScrollView
          contentContainerStyle={{paddingBottom: 100}}
          refreshControl={
            <RefreshControl onRefresh={fetchDevices} refreshing={loading} />
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
                    type="employee"
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

const styles = StyleSheet.create({});
