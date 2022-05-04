import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import UserCard from '../../components/UserCard';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [term, setTerm] = useState('');

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
          if (item.data().role !== 'admin') {
            temp.push(item.data());
          }
        });
        return temp;
      });
    setUsers(fetchedUsers);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="Users" showBack />
      <SearchBar value={term} onChangeText={setTerm} />
      <ScrollView>
        <View style={{margin: 20, borderRadius: 20, overflow: 'hidden'}}>
          {users
            .filter((user: any) =>
              user.name.toLowerCase().includes(term.toLowerCase()),
            )
            .map((item: any) => {
              return <UserCard data={item} key={item.id} />;
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Users;
