import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import Header from '../../components/Header';
import fonts from '../../constants/fonts';

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
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="Assign History" showBack />
      <ScrollView>
        <View style={{padding: 20}}>
          {loading && <ActivityIndicator size="large" color="gray" />}
          {history.map((item: any, i) => {
            return (
              <View
                key={i}
                style={{
                  borderLeftWidth: 5,
                  borderLeftColor: 'lightgray',
                  padding: 20,
                }}>
                <View style={styles.dot} />
                <Text style={{fontWeight: 'bold', color: colors.primary}}>
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
    fontFamily: fonts.bold,
    color: 'gray',
  },
  blackText: {
    fontFamily: fonts.bold,
    color: 'black',
    fontSize: 18,
  },
  blueText: {
    fontFamily: fonts.bold,
    color: 'black',
    fontSize: 18,
  },
  dot: {
    height: 10,
    width: 10,
    borderRadius: 40,
    backgroundColor: colors.primary,
    position: 'absolute',
    left: -7,
    top: 23,
  },
});
