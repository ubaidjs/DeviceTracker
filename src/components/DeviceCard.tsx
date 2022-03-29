import {Alert, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import colors from '../constants/colors';
import {Menu, MenuItem, MenuDivider} from 'react-native-material-menu';
import Icon from 'react-native-vector-icons/AntDesign';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const DeviceCard = ({item, fetchDevices}: any) => {
  const navigation: any = useNavigation();
  const [visible, setVisible] = useState(false);

  const hideMenu = () => setVisible(false);

  const showMenu = () => setVisible(true);

  const deleteDevice = async () => {
    await firestore().collection('Devices').doc(item.deviceId).delete();
    fetchDevices();
  };

  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={styles.deviceName}>{item.deviceName}</Text>

        <Menu
          anchor={
            <Pressable onPress={showMenu}>
              <Icon name="ellipsis1" size={25} />
            </Pressable>
          }
          visible={visible}
          onRequestClose={hideMenu}>
          <MenuItem
            textStyle={{color: '#000'}}
            onPress={() => {
              hideMenu();
              navigation.navigate('AddDevice', {
                type: 'Update',
                data: item,
              });
            }}>
            Update
          </MenuItem>
          <MenuItem
            textStyle={{color: '#000'}}
            onPress={() => {
              hideMenu();
              Alert.alert('', 'Do you want to delete this device?', [
                {text: 'Yes', onPress: deleteDevice},
                {text: 'Cancel', onPress: () => {}},
              ]);
            }}>
            Delete
          </MenuItem>
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
    </View>
  );
};

export default DeviceCard;

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
