import React from 'react';
import {StyleSheet, Text, View, Pressable, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../constants/colors';
import firestore from '@react-native-firebase/firestore';
import useStore from '../constants/store';
import {useNavigation} from '@react-navigation/native';
import Toast from 'react-native-simple-toast';

const UserCardUser = ({data, deviceData}: any) => {
  const navigation = useNavigation();
  const store = useStore();
  const sendAssignRequest = async () => {
    const res = await firestore()
      .collection('Requests')
      .add({
        ...deviceData,
        userId: data.id,
        userData: data,
        requestFrom: store.user,
        createdAt: firestore.Timestamp.now(),
      });

    await firestore().collection('Devices').doc(deviceData.deviceId).update({
      pendingRequest: true,
      reqDocId: res.id,
    });
    sendNotification();
    Toast.show('Request Sent');
    navigation.goBack();
  };

  const sendNotification = async () => {
    try {
      const res = await fetch('https://fcm.googleapis.com/fcm/send', {
        method: 'POST',
        body: JSON.stringify({
          data: {
            title: 'New Device Request',
            body: `You have a device handover request from ${store.user.name}`,
          },
          notification: {
            foreground: true,
            title: 'New Device Request',
            body: `You have a device handover request from ${store.user.name}`,
          },
          to: data.pushToken,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'key=AAAA-fqwYuU:APA91bGrP4I1OA0OlSyHBUqrWaIbx0rk3N952AQjROwzb-LKwsmct6hj1LPvhjOl2qlivGhReAewoUeKBXro7qjp6p-3mMaEHCHYDiaK-ClG-hRMuUjvE8dDf5wjmXxEohLwFA3Rnrhe',
        },
      });
      const json = await res.json();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Pressable
      onPress={() =>
        Alert.alert('', `Do you want to assign this device to ${data.name}?`, [
          {text: 'Cancel', onPress: () => {}},
          {text: 'Yes', onPress: sendAssignRequest},
        ])
      }
      style={styles.card}>
      <Text style={styles.deviceName}>{data.name}</Text>
      <View style={styles.row}>
        <Icon name="phone" color={colors.lightBlack} size={20} />
        <Text style={{color: colors.lightBlack, marginLeft: 10}}>
          {data.phone}
        </Text>
      </View>
      <View style={styles.row}>
        <Icon name="mail" color={colors.lightBlack} size={20} />
        <Text style={{color: colors.lightBlack, marginLeft: 10}}>
          {data.email}
        </Text>
      </View>
    </Pressable>
  );
};

export default UserCardUser;

const styles = StyleSheet.create({
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
});
