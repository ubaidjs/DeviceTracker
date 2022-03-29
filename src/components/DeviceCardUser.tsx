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
import {Menu, MenuItem} from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/AntDesign';
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
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

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
    await firestore()
      .collection('Requests')
      .where('deviceId', '==', item.deviceId)
      .get()
      .then(snap => snap.forEach(snapItem => (res = snapItem.id)));
    await firestore().collection('Requests').doc(res).delete();
    await firestore().collection('Devices').doc(item.deviceId).update({
      pendingRequest: false,
      reqDocId: '',
      manageBy: store.user.name,
      manageById: store.user.id,
      updatedAt: firestore.Timestamp.now(),
    });
    fetchUserDevice(store.user.id);
    fetchPendingRequest(store.user.id);
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <Text style={styles.deviceName}>{item.deviceName}</Text>

        <Menu
          anchor={
            <Pressable onPress={showMenu}>
              <Icon name="ellipsis1" size={25} />
            </Pressable>
          }
          visible={visible}
          onRequestClose={hideMenu}>
          {type === 'request' ? (
            <>
              <MenuItem
                textStyle={{color: '#000'}}
                onPress={() => {
                  hideMenu();
                  acceptRequest();
                }}>
                Accept Device
              </MenuItem>
            </>
          ) : (
            <>
              {item.pendingRequest === true ? (
                <>
                  <MenuItem
                    textStyle={{color: '#000'}}
                    onPressIn={() => {}}
                    onPress={() => {
                      hideMenu();
                      cancelRequest();
                    }}>
                    Cancel Request
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem
                    textStyle={{color: '#000'}}
                    onPressIn={() => {}}
                    onPress={() => {
                      hideMenu();
                      navigation.navigate('UserList', {
                        users: users,
                        deviceData: item,
                      });
                    }}>
                    Assign To
                  </MenuItem>
                </>
              )}
            </>
          )}
        </Menu>
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
