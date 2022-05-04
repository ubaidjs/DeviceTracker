import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import colors from '../constants/colors';
import fonts from '../constants/fonts';
import Feather from 'react-native-vector-icons/Feather';
import {useNavigation} from '@react-navigation/native';

interface Props {
  title: string;
  showBack?: boolean;
  rightComp?: React.ReactNode;
}

const Header = ({title, showBack, rightComp}: Props) => {
  const navigation = useNavigation();
  const onLeftPress = () => {
    if (showBack) {
      navigation.goBack();
    }
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={onLeftPress} style={styles.left}>
        {showBack && <Feather size={28} name="chevron-left" />}
      </Pressable>
      <View style={styles.title}>
        <Text style={styles.titleText}>{title}</Text>
      </View>
      <View style={styles.right}>{rightComp}</View>
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  left: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingLeft: 15,
    // borderWidth: 1,
  },
  right: {
    flex: 1,
    alignSelf: 'stretch',
    justifyContent: 'center',
    paddingRight: 20,
    alignItems: 'flex-end',
    // borderWidth: 1,
  },
  title: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15,
  },
  titleText: {fontSize: 20, fontFamily: fonts.bold, color: colors.primary},
});
