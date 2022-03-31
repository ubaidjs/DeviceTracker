import React from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import BackBtn from '../../components/BackBtn';
import UserCardUser from '../../components/UserCardUser';
import colors from '../../constants/colors';

const UserList = ({route, navigation}: any) => {
  const {users, deviceData} = route.params;
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <ScrollView>
        <View style={{padding: 20, paddingTop: 0}}>
          <View style={styles.header}>
            <Text style={styles.h1}>Users</Text>
          </View>
        </View>

        <Text style={{margin: 20, marginTop: 0}}>
          Please select a user to assign this device
        </Text>

        <View style={{paddingHorizontal: 20}}>
          {users.map((item: any) => {
            return (
              <UserCardUser key={item.id} data={item} deviceData={deviceData} />
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
};

export default UserList;

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
  },
});
