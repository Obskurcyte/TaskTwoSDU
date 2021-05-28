import React, {useState, useCallback, useContext, useEffect} from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import AcceuilScreen from "./screens/AcceuilScreen";
import LoginScreen from "./screens/LoginScreen";
import {AuthContext} from "./context/auth";



function App() {

    const [token, setToken] = useState(false);
    const [username, setUsername] = useState(false);

    const login = useCallback((username, token, expirationDate) => {
        setToken(token);
        setUsername(username);
        const tokenExpirationDate = expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365);
        localStorage.setItem('userData', JSON.stringify({
            username: username,
            token: token,
            expiration: tokenExpirationDate.toISOString()
        }));
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUsername(null)
        localStorage.removeItem('userData');
    }, [])


    useEffect(() => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        if (storedData &&
            storedData.token &&
            new Date(storedData.expiration) > new Date()
        ) {
            login(storedData.username, storedData.token, new Date(storedData.expiration))
        }
    }, [login]);

    let routes;

    if (token) {
        routes = (
            <React.Fragment>
                <Route path='/'>
                    <AcceuilScreen />
                </Route>
                <Redirect to="/" />
            </React.Fragment>
        );
    } else {
        routes = (
            <React.Fragment>
            <Route path='/login'>
                <LoginScreen />
            </Route>
            <Redirect to="/login" />
            </React.Fragment>
        )
    }

  return (
      <AuthContext.Provider
        value={{
            isLoggedIn: !!token,
            token: token,
            username: username,
            login: login,
            logout: logout
        }}
      >
      <React.Fragment>
        <Router>
            <Switch>
                {routes}
            </Switch>
        </Router>
      </React.Fragment>
      </AuthContext.Provider>
  );
}

export default App;
