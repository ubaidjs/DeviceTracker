import React from 'react';
import {StyleSheet, Text, View, TextInput, TextInputProps} from 'react-native';
import Icon from 'react-native-vector-icons/EvilIcons';
import colors from '../constants/colors';

const SearchBar = ({value, onChangeText, ...otherProps}: TextInputProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search"
        value={value}
        onChangeText={onChangeText}
        {...otherProps}
      />
      <View style={styles.iconContain}>
        <Icon name="search" size={24} color="#fff" />
      </View>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    margin: 20,
    marginVertical: 10,
    borderRadius: 50,
    paddingLeft: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingRight: 5,
  },
  input: {
    height: 50,
    flex: 1,
  },
  iconContain: {
    backgroundColor: colors.primary,
    // alignSelf: 'stretch',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 50,
  },
});
