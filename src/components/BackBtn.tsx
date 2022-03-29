import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import colors from '../constants/colors';

const BackBtn = () => {
  const navigation = useNavigation();
  return (
    <Pressable
      onPress={() => navigation.goBack()}
      style={{
        padding: 10,
        paddingVertical: 20,
        alignSelf: 'flex-start',
      }}>
      <Entypo name="chevron-small-left" size={35} color={colors.lightBlack} />
    </Pressable>
  );
};

export default BackBtn;

const styles = StyleSheet.create({});
