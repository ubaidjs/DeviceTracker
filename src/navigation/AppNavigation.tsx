import React, {useReducer} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
// import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Devices from '../screens/admin/Devices';
import Users from '../screens/admin/Users';
import AddDevice from '../screens/admin/AddDevice';
import UserList from '../screens/employee/UserList';
import History from '../screens/admin/History';
import AdminHome from '../screens/admin/AdminHome';
import AuthContext, {authReducer, initialState} from './AuthContext';
import firestore from '@react-native-firebase/firestore';
import TabNavigation from './TabNavigation';

const Stack = createNativeStackNavigator();
// export const AuthContext = React.createContext<any>({});

const AppNavigation = () => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const currentUser = auth().currentUser;
      if (currentUser === null) {
        dispatch({type: 'RESTORE_TOKEN', token: null});
      } else {
        await firestore()
          .collection('Users')
          .where('email', '==', currentUser?.email)
          .get()
          .then(snap => {
            snap.forEach(item => {
              dispatch({
                type: 'RESTORE_TOKEN',
                token: 'token',
                currentUser: item.data(),
              });
            });
          });
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async (currentUser: any) => {
        dispatch({
          type: 'SIGN_IN',
          token: 'dummy-auth-token',
          currentUser: currentUser,
        });
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async (currentUser: any) => {
        dispatch({
          type: 'SIGN_IN',
          token: 'dummy-auth-token',
          currentUser: currentUser,
        });
      },
    }),
    [],
  );

  if (state.isLoading) {
    return <View />;
  }

  return (
    <AuthContext.Provider value={authContext}>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {state.userToken == null ? (
          <>
            {/* <Stack.Screen name="Onboarding" component={Onboarding} /> */}
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="SignUp" component={SignUp} />
          </>
        ) : (
          <>
            {state.currentUser.role === 'admin' ? (
              <Stack.Screen name="Home" component={AdminHome} />
            ) : (
              <Stack.Screen name="Home" component={TabNavigation} />
            )}
            <Stack.Screen name="Devices" component={Devices} />
            <Stack.Screen name="Users" component={Users} />
            <Stack.Screen name="AddDevice" component={AddDevice} />
            <Stack.Screen name="UserList" component={UserList} />
            <Stack.Screen name="History" component={History} />
          </>
        )}
      </Stack.Navigator>
    </AuthContext.Provider>
  );
};

export default AppNavigation;
