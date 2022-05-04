import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import Icon from 'react-native-vector-icons/AntDesign';
import colors from '../constants/colors';

const UserCard = ({data}: any) => {
  return (
    <View style={styles.card}>
      <Text style={styles.deviceName}>{data.name}</Text>
      <View style={styles.row}>
        <Icon name="phone" color={colors.primary} size={20} />
        <Text style={{color: colors.lightBlack, marginLeft: 10}}>
          {data.phone}
        </Text>
      </View>
      <View style={styles.row}>
        <Icon name="mail" color={colors.primary} size={20} />
        <Text style={{color: colors.lightBlack, marginLeft: 10}}>
          {data.email}
        </Text>
      </View>
    </View>
  );
};

export default UserCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 15,
    // borderRadius: 20,
    // marginBottom: 20,
  },
  deviceName: {
    fontWeight: '500',
    color: colors.primary,
    fontSize: 18,
    marginBottom: 3,
  },
  row: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
