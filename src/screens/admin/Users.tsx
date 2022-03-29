import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import BackBtn from '../../components/BackBtn';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import UserCard from '../../components/UserCard';

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const fetchedUsers = await firestore()
      .collection('Users')
      .get()
      .then(snap => {
        let temp: any = [];
        snap.forEach(item => {
          temp.push(item.data());
        });
        return temp;
      });
    setUsers(fetchedUsers);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <BackBtn />
      <ScrollView>
        <View style={{padding: 20, paddingTop: 0}}>
          <Text style={styles.h1}>Users</Text>
        </View>

        <View style={{padding: 20}}>
          {users.map((item: any) => {
            return <UserCard data={item} key={item.id} />;
          })}
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
