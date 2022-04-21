import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

interface Props {
  title: string;
}

const Header = ({title}: Props) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
      <View style={{flex: 1}}></View>
      <View
        style={{
          flex: 3,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 15,
        }}>
        <Text
          style={{fontSize: 20, fontFamily: fonts.bold, color: colors.primary}}>
          {title}
        </Text>
      </View>
      <View style={{flex: 1}}></View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({});
