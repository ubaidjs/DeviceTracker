import React, {useState} from 'react';
import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import colors from '../constants/colors';
import Icon from 'react-native-vector-icons/AntDesign';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import useStore from '../constants/store';

const DeviceCardUser = ({
  item,
  users,
  type,
  fetchUserDevice,
  fetchPendingRequest,
}: any) => {
  const store = useStore();
  const navigation: any = useNavigation();

  const cancelRequest = async () => {
    console.log(item.reqDocId);
    await firestore().collection('Requests').doc(item.reqDocId).delete();
    await firestore()
      .collection('Devices')
      .doc(item.deviceId)
      .update({pendingRequest: false, reqDocId: ''});

    fetchUserDevice(store.user.id);
    fetchPendingRequest(store.user.id);
  };

  const acceptRequest = async () => {
    let res;
    let requestData: any;
    await firestore()
      .collection('Requests')
      .where('deviceId', '==', item.deviceId)
      .get()
      .then(snap =>
        snap.forEach(snapItem => {
          res = snapItem.id;
          requestData = snapItem.data();
        }),
      );
    await firestore()
      .collection('Devices')
      .doc(item.deviceId)
      .collection('Logs')
      .add({
        from: requestData?.requestFrom,
        to: requestData?.userData,
        deviceId: requestData.deviceId,
        acceptDate: new Date().getTime(),
        createdAt: firestore.Timestamp.now(),
      });
    await firestore().collection('Requests').doc(res).delete();
    await firestore().collection('Devices').doc(item.deviceId).update({
      pendingRequest: false,
      reqDocId: '',
      manageBy: store.user.name,
      manageById: store.user.id,
      updatedAt: firestore.Timestamp.now(),
      issueDate: new Date().toLocaleDateString(),
    });
    fetchUserDevice(store.user.id);
    fetchPendingRequest(store.user.id);
  };

  const cancelAlert = () => {
    Alert.alert('', 'Do you want to cancel this request?', [
      {text: 'No', onPress: () => {}},
      {text: 'Yes', onPress: cancelRequest},
    ]);
  };

  const acceptAlert = () => {
    Alert.alert('', 'Do you want to accept this request?', [
      {text: 'No', onPress: () => {}},
      {text: 'Yes', onPress: acceptRequest},
    ]);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.deviceName}>{item.deviceName}</Text>
        {type === 'request' ? (
          <>
            <Pressable style={{marginLeft: 15}} onPress={acceptAlert}>
              <Icon name="checkcircleo" size={25} color="#27ae60" />
            </Pressable>
            <Pressable style={{marginLeft: 15}} onPress={cancelAlert}>
              <Icon name="closecircleo" size={25} color="orangered" />
            </Pressable>
          </>
        ) : (
          <>
            {item.pendingRequest === true ? (
              <>
                <Pressable onPress={cancelAlert}>
                  <Icon name="closecircleo" size={25} color="orangered" />
                </Pressable>
              </>
            ) : (
              <>
                <Pressable
                  onPress={() => {
                    navigation.navigate('UserList', {
                      users: users,
                      deviceData: item,
                    });
                  }}>
                  <Feather name="external-link" size={25} color="#16a085" />
                </Pressable>
              </>
            )}
          </>
        )}
      </View>
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
        <Icon name="calendar" color={colors.lightBlack} size={20} />
        <Text style={{color: colors.lightBlack, marginLeft: 10}}>
          {item.issueDate}
        </Text>
      </View>
      {item.pendingRequest === true && (
        <Text style={{color: 'orangered', marginTop: 5}}>
          Handover request pending for this device
        </Text>
      )}
    </View>
  );
};

export default DeviceCardUser;

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
    flex: 1,
  },
  row: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
