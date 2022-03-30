import React, {useEffect} from 'react';
import {SafeAreaView, Platform} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import AppNavigation from './src/navigation/AppNavigation';
import messaging from '@react-native-firebase/messaging';
import PushNotification, {Importance} from 'react-native-push-notification';

const App = () => {
  useEffect(() => {
    if (Platform.OS === 'android') {
      PushNotification.createChannel(
        {
          channelId: 'valere',
          channelName: 'valere',
          channelDescription: 'A channel to categorise your notifications',
          playSound: true,
          soundName: 'default',
          importance: Importance.HIGH,
          vibrate: true,
        },
        () => {},
      );
    }
    const messagingUnsubscribe = messaging().onMessage(async remoteMessage => {
      console.log(remoteMessage);

      if (remoteMessage.data?.title) {
        PushNotification.localNotification({
          channelId: 'valere',
          smallIcon: 'ic_notification',
          title: remoteMessage.data.title,
          message: remoteMessage.data.body,
          bigPictureUrl: remoteMessage.data.imageUrl,
        });
      } else if (remoteMessage.notification?.title) {
        PushNotification.localNotification({
          channelId: 'valere',
          smallIcon: 'ic_notification',
          title: remoteMessage.notification.title,
          message: remoteMessage.notification.body || '',
          bigPictureUrl: remoteMessage.notification.android?.imageUrl,
        });
      }
    });
    return () => {
      messagingUnsubscribe();
    };
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;
