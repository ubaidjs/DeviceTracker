import React from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import BackBtn from '../../components/BackBtn';
import colors from '../../constants/colors';

const Users = () => {
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <ScrollView>
        <View style={{padding: 20, paddingTop: 0}}>
          <Text style={styles.h1}>Users</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Users;

const styles = StyleSheet.create({
  h1: {
    fontSize: 30,
    fontWeight: '500',
    color: colors.lightBlack,
  },
});
