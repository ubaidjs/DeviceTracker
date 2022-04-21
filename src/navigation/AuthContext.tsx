import {createContext} from 'react';

const AuthContext = createContext<any>({});

export const authReducer = (prevState: any, action: any) => {
  switch (action.type) {
    case 'RESTORE_TOKEN':
      return {
        ...prevState,
        userToken: action.token,
        isLoading: false,
        currentUser: action.currentUser,
      };
    case 'SIGN_IN':
      return {
        ...prevState,
        isSignout: false,
        userToken: action.token,
        currentUser: action.currentUser,
      };
    case 'SIGN_OUT':
      return {
        ...prevState,
        isSignout: true,
        userToken: null,
        currentUser: {},
      };
  }
};

export const initialState = {
  isLoading: true,
  isSignout: false,
  userToken: null,
  currentUser: {},
};

export default AuthContext;
