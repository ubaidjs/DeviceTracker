import React, {useReducer} from 'react';
import {View} from 'react-native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import auth from '@react-native-firebase/auth';
// import Onboarding from '../screens/Onboarding';
import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import Home from '../screens/Home';
import Devices from '../screens/admin/Devices';
import Users from '../screens/admin/Users';
import AddDevice from '../screens/admin/AddDevice';
import UserList from '../screens/employee/UserList';
import History from '../screens/admin/History';

const Stack = createNativeStackNavigator();
export const AuthContext = React.createContext<any>({});

const AppNavigation = () => {
  const [state, dispatch] = useReducer(
    (prevState: any, action: any) => {
      switch (action.type) {
        case 'RESTORE_TOKEN':
          return {
            ...prevState,
            userToken: action.token,
            isLoading: false,
          };
        case 'SIGN_IN':
          return {
            ...prevState,
            isSignout: false,
            userToken: action.token,
          };
        case 'SIGN_OUT':
          return {
            ...prevState,
            isSignout: true,
            userToken: null,
          };
      }
    },
    {
      isLoading: true,
      isSignout: false,
      userToken: null,
    },
  );

  React.useEffect(() => {
    // Fetch the token from storage then navigate to our appropriate place
    const bootstrapAsync = async () => {
      const currentUser = auth().currentUser;
      if (currentUser === null) {
        dispatch({type: 'RESTORE_TOKEN', token: null});
      } else {
        dispatch({type: 'RESTORE_TOKEN', token: 'token'});
      }
    };

    bootstrapAsync();
  }, []);

  const authContext = React.useMemo(
    () => ({
      signIn: async () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
      },
      signOut: () => dispatch({type: 'SIGN_OUT'}),
      signUp: async () => {
        dispatch({type: 'SIGN_IN', token: 'dummy-auth-token'});
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
            <Stack.Screen name="Home" component={Home} />
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
