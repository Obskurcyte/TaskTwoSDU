import React, {useState, useContext, useEffect} from 'react';
import {Formik} from 'formik';
import './LoginScreen.css';
import axios from "axios";
import {AuthContext} from "../context/auth";
import io from "socket.io-client";
import {uri} from "../config";

let socket;
const CONNECTION_PORT = `${uri}/`;

const LoginScreen = () => {

    const initialValues = {
        username: '',
        password: ''
    }

    useEffect(() => {
        socket = io(CONNECTION_PORT)
    }, [CONNECTION_PORT]);

    const [login, setLogin] = useState(false);
    const auth = useContext(AuthContext)
    const [error, setError] = useState();
    console.log(error)
    if (!login) {
        return (
            <div className="container">
                <h1 style={{textAlign: 'center'}}>Welcome to this new game ! Before starting you first need to register !</h1>
                <div className='loginFormContainer'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            try {
                                const response = await axios.post(`${uri}/signup`, {
                                    username: values.username,
                                    password: values.password
                                })
                                auth.login(response.data.username, response.data.token);
                                socket.emit('join_room', "1")
                                window.location.reload()
                            } catch (err) {
                                setError(err.message)
                                console.log('wola', err)
                            }

                            console.log(values)
                        }}
                    >
                        {props => (
                            <div className="loginForm">
                                <div>
                                    <label htmlFor="username">Please enter your username</label>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={props.values.username}
                                        onChange={props.handleChange('username')}
                                    />
                                </div>



                                <div>
                                    <label htmlFor="username">Please enter your password</label>
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={props.values.password}
                                        onChange={props.handleChange('password')}
                                    />
                                </div>

                                {error === "Request failed with status code 422" && (
                                    <p style={{color: 'red'}}>This user already exists ! Please login !</p>
                                )}

                                <button onSubmit={props.handleSubmit} type="submit" onClick={props.handleSubmit}>Sign up</button>
                                <p>Already a member ? <a href="#" onClick={() => setLogin(true)}>Login</a></p>
                            </div>
                        )}

                    </Formik>
                </div>
            </div>
        );
    } else {
        return (
            <div className="container">
                <h1 style={{textAlign: 'center'}}>Welcome back to the game ! Now you can log in !</h1>
                <div className='loginFormContainer'>
                    <Formik
                        initialValues={initialValues}
                        onSubmit={async (values) => {
                            try {
                                const response = await axios.post(`${uri}/login`, {
                                    username: values.username,
                                    password: values.password
                                })
                                auth.login(response.data.username, response.data.token);
                                socket.emit('join_room', "1")

                            } catch (err) {
                                setError(err.message)
                            }

                            console.log(values)
                        }}
                    >
                        {props => (
                            <div className="loginForm">
                                <div>
                                    <label htmlFor="username">Please enter your username</label>
                                </div>
                                <div>
                                    <input
                                        type="text"
                                        value={props.values.username}
                                        onChange={props.handleChange('username')}
                                    />
                                </div>


                                <div>
                                    <label htmlFor="username">Please enter your password</label>
                                </div>
                                <div>
                                    <input
                                        type="password"
                                        value={props.values.password}
                                        onChange={props.handleChange('password')}
                                    />
                                </div>

                                {error === "Request failed with status code 401" && (
                                    <p style={{color: 'red'}}>Wrong Credentials ! Please try again </p>
                                )}
                                <button onSubmit={props.handleSubmit} type="submit" onClick={props.handleSubmit}>Log In</button>
                                <p>Already a member ? <a href="#" onClick={() => setLogin(false)}>Sign Up</a></p>
                            </div>
                        )}

                    </Formik>
                </div>
            </div>
        );
    }
};

export default LoginScreen;