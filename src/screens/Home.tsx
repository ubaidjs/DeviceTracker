import React, {useContext, useState, useEffect} from 'react';
import {StyleSheet, Text, View, ScrollView} from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AppNavigation';

const Home = () => {
  const {signOut} = useContext(AuthContext);
  const [user, setUser] = useState<any>({
    email: '',
    id: '',
    name: '',
    password: '',
    phone: '',
    role: '',
  });

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    const currentUser = auth().currentUser;
    await firestore()
      .collection('Users')
      .where('email', '==', currentUser?.email)
      .get()
      .then(snap => {
        snap.forEach(item => {
          console.log(item.data());
          setUser(item.data());
        });
      });
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View style={{padding: 20}}>
          <Text>{user.role}</Text>
          <Text
            style={{
              fontSize: 30,
              // fontWeight: 'bold',
              color: colors.lightBlack,
            }}>
            Dashboard
          </Text>

          <Button
            label="Logout"
            containerStyle={{marginTop: 40}}
            outline
            onPress={() => {
              signOut();
              auth().signOut();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
