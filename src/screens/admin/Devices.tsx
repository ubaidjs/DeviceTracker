import React, {useState, useEffect, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import BackBtn from '../../components/BackBtn';
import colors from '../../constants/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

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

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <View style={{padding: 20, paddingTop: 0}}>
        <View style={styles.header}>
          <Text style={styles.h1}>Devices</Text>
          <Pressable
            onPress={() => {
              navigation.navigate('AddDevice');
            }}>
            <Icon name="pluscircleo" size={26} />
          </Pressable>
        </View>
        <ScrollView>
          <View style={{marginTop: 20}}>
            <View>
              <TextInput
                onChangeText={setTerm}
                placeholder="Search"
                style={styles.search}
              />
            </View>
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
                  <View key={i} style={styles.card}>
                    <Text style={styles.deviceName}>{item.deviceName}</Text>
                    <View style={styles.row}>
                      <Icon name="link" color={colors.lightBlack} size={20} />
                      <Text style={{color: colors.lightBlack, marginLeft: 10}}>
                        {item.serialNo}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Icon name="user" color={colors.lightBlack} size={20} />
                      <Text style={{color: colors.lightBlack, marginLeft: 10}}>
                        {item.manageBy}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Icon
                        name="calendar"
                        color={colors.lightBlack}
                        size={20}
                      />
                      <Text style={{color: colors.lightBlack, marginLeft: 10}}>
                        {item.issueDate}
                      </Text>
                    </View>
                  </View>
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
  },
});