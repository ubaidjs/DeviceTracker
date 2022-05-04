import React, {useState, useEffect} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text, View} from 'react-native';
import UserCardUser from '../../components/UserCardUser';
import colors from '../../constants/colors';
import firestore from '@react-native-firebase/firestore';
import Header from '../../components/Header';
import SearchBar from '../../components/SearchBar';
import useStore from '../../constants/store';

const UserList = ({route, navigation}: any) => {
  const store = useStore();
  const {deviceData} = route.params;
  const [users, setUsers] = useState([]);
  const [term, setTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    const fetchedUsers = await firestore()
      .collection('Users')
      .orderBy('name')
      .get()
      .then(snap => {
        let temp: any = [];
        snap.forEach(item => {
          temp.push(item.data());
        });
        return temp;
      });
    setUsers(
      fetchedUsers.filter(
        (item: any) => item.role !== 'admin' && item.id !== store.user.id,
      ),
    );
    setLoading(false);
  };

  return (
    <View style={{flex: 1, backgroundColor: colors.bg}}>
      <Header title="Assign To" showBack />

      <SearchBar value={term} onChangeText={setTerm} />

      <ScrollView
        refreshControl={
          <RefreshControl onRefresh={fetchUsers} refreshing={loading} />
        }>
        <View style={{margin: 20, borderRadius: 15, overflow: 'hidden'}}>
          {users
            .filter((item: any) =>
              item.name.toLowerCase().includes(term.toLowerCase()),
            )
            .map((item: any) => {
              return (
                <UserCardUser
                  key={item.id}
                  data={item}
                  deviceData={deviceData}
                />
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
