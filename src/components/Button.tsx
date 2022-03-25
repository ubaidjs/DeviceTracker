import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import colors from '../constants/colors';

interface Props {
  onPress: () => void;
  loading?: boolean;
  label: string;
  containerStyle?: ViewStyle;
  outline?: boolean;
}

const Button = (props: Props) => {
  return (
    <TouchableOpacity onPress={props.onPress} disabled={props.loading}>
      <View
        style={[
          styles.btn,
          props.containerStyle,
          props.outline && styles.outline,
        ]}>
        {props.loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text
            style={[styles.btnTxt, props.outline && {color: colors.primary}]}>
            {props.label}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  btn: {
    height: 45,
    backgroundColor: colors.primary,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 50,
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.primary,
    backgroundColor: '#fff',
  },
  btnTxt: {
    fontSize: 16,
    color: '#fff',
    fontFamily: 'Poppins-Regular',
  },
});
