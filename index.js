/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
  if (remoteMessage.data?.title) {
    PushNotification.localNotification({
      channelId: 'valere',
      smallIcon: 'ic_notification',
      title: remoteMessage.data.title,
      message: remoteMessage.data.body,
      bigPictureUrl: remoteMessage.data?.imageUrl,
      playSound: true,
      priority: 'high',
      importance: 'high',
    });
  }
});

AppRegistry.registerComponent(appName, () => App);
