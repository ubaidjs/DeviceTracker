import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Feather from 'react-native-vector-icons/Feather';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

import Devices from '../screens/employee/Devices';
import Home from '../screens/employee/Home';
import Account from '../screens/employee/Account';

const Tabs = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          margin: 20,
          marginBottom: 10,
          elevation: 0,
          borderRadius: 50,
          height: 65,
          borderTopWidth: 0,
          backgroundColor: colors.primary,
        },
        tabBarIconStyle: {marginTop: 5},
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#1F1F1F',
        tabBarLabelStyle: {
          marginBottom: 5,
          fontSize: 13,
          fontFamily: fonts.bold,
        },
      }}>
      <Tabs.Screen
        name="My Devices"
        component={Home}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Feather name="smartphone" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="All Devices"
        component={Devices}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Feather name="server" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="Account"
        component={Account}
        options={{
          tabBarIcon: ({focused, color, size}) => (
            <Feather name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs.Navigator>
  );
};

export default TabNavigation;
