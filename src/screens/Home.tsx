import React, {useContext, useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  Pressable,
  Dimensions,
} from 'react-native';
import Button from '../components/Button';
import colors from '../constants/colors';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {AuthContext} from '../navigation/AppNavigation';
import Icon from 'react-native-vector-icons/AntDesign';

const {width} = Dimensions.get('screen');

const Home = ({navigation}: any) => {
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
          setUser(item.data());
        });
      });
  };

  const handleSignOut = () => {
    signOut();
    auth().signOut();
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView>
        <View style={{padding: 20}}>
          <View style={styles.header}>
            <View>
              <Text>{user.role}</Text>
              <Text style={styles.h1}>Dashboard</Text>
            </View>
            <Pressable
              onPress={() => {
                Alert.alert('', 'Are you sure you want to log out?', [
                  {text: 'Yes', onPress: handleSignOut},
                  {text: 'Cancel', onPress: () => {}},
                ]);
              }}>
              <Icon name="logout" size={25} color="orangered" />
            </Pressable>
          </View>
          {user.role === 'admin' && (
            <View style={styles.boxWrap}>
              <Pressable
                style={styles.box}
                onPress={() => navigation.navigate('Devices')}>
                <Icon name="mobile1" size={25} color={colors.lightBlack} />
                <Text style={styles.boxTitle}>Devices</Text>
              </Pressable>

              <Pressable
                style={styles.box}
                onPress={() => navigation.navigate('Users')}>
                <Icon name="user" size={25} color={colors.lightBlack} />
                <Text style={styles.boxTitle}>Users</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Home;

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
  box: {
    width: width / 2 - 30,
    backgroundColor: '#f7f7f7',
    padding: 20,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  boxTitle: {
    marginLeft: 10,
    color: colors.lightBlack,
  },
  boxWrap: {
    marginTop: 40,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});
