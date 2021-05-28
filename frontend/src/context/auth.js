import {createContext} from 'react';

export const AuthContext = createContext({
    username: null,
    token: null,
    isLoggedIn: false,
    login: () => {},
    logout: () => {}
})