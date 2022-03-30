import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import BackBtn from '../../components/BackBtn';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';

const History = ({route}: any) => {
  const {id} = route.params;
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    await firestore()
      .collection('Devices')
      .doc(id)
      .collection('Logs')
      .orderBy('acceptDate')
      .get()
      .then(snap => {
        let temp: any = [];
        snap.forEach(item => {
          temp.push(item.data());
        });
        setHistory(temp);
      });
    setLoading(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <View style={{padding: 20, paddingTop: 0}}>
        <Text style={styles.h1}>Assign History</Text>
      </View>
      <ScrollView>
        <View style={{padding: 20}}>
          {loading && <ActivityIndicator size="large" color="gray" />}
          {history.map((item: any, i) => {
            return (
              <View
                key={i}
                style={{
                  borderLeftWidth: 1,
                  borderLeftColor: 'gray',
                  padding: 20,
                }}>
                <View style={styles.dot} />
                <Text style={{fontWeight: 'bold', color: '#000'}}>
                  {moment(item.acceptDate).format('DD/MM/YY hh:mm A')}
                </Text>
                <View style={styles.row}>
                  <Text style={styles.grayText}>From</Text>
                  <Text style={styles.grayText}>To</Text>
                </View>
                <View style={styles.row}>
                  <Text style={styles.blackText}>{item.from.name}</Text>
                  <Text style={styles.blackText}>{item.to.name}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.lightBlack,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  grayText: {
    fontWeight: 'bold',
    color: 'gray',
  },
  blackText: {
    fontWeight: 'bold',
    color: 'black',
    fontSize: 18,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 40,
    backgroundColor: colors.lightBlack,
    position: 'absolute',
    left: -5,
    top: 23,
  },
});
