import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Home from '../screens/employee/Home';
import colors from '../constants/colors';
import fonts from '../constants/fonts';

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
          height: 60,
          borderTopWidth: 0,
          backgroundColor: colors.primary,
        },
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#1F1F1F',
        tabBarLabelStyle: {
          marginBottom: 5,
          fontSize: 13,
          fontFamily: fonts.bold,
        },
      }}>
      <Tabs.Screen name="My Devices" component={Home} />
    </Tabs.Navigator>
  );
};

export default TabNavigation;
