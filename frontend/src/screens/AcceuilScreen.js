import React, {useEffect, useState} from 'react';
import {Nav, Navbar} from "react-bootstrap";
import {Table} from "react-bootstrap";
import {Formik} from "formik";
import io from 'socket.io-client';
import {faSmile} from "@fortawesome/free-solid-svg-icons";
import {faComments} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import './AcceuilScreen.css';
import axios from 'axios'
import {uri} from "../config";

let socket;
const CONNECTION_PORT = `${uri}/`;

const AcceuilScreen = () => {

    const [userData, setUserData] = useState({})
    const [username, setUsername] = useState();
    const [users, setUsers] = useState()
    const [isLoading, setIsLoading] = useState(false);

    console.log(users)
    console.log(userData);

    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true)
            try {
                const response = await axios.get(`${uri}/`);
                console.log(response.data.users)
                setUsers(response.data.users);
                setIsLoading(false)
            } catch (err) {
                setIsLoading(false)
                console.log(err)
            }
        }
        sendRequest();

    }, [])
    useEffect(() => {
        if (username) {
            const storedData = JSON.parse(localStorage.getItem('userData'));
            setUsername(storedData.username)
        }
    }, [username])

    useEffect(() => {
        const sendRequest = async () => {
            setIsLoading(true)
            try {
                const storedData = JSON.parse(localStorage.getItem('userData'));
                const response = await axios.post(`${uri}/`, {
                    username : storedData.username
                })
                setUserData(response.data)
                setIsLoading(false)
            } catch (err) {

                console.log(err)
            }
        };
        sendRequest().then(() => console.log('ok'))
    }, [])

    const [message, setMessage] = useState('');
    const [messageList1, setMessageList1] = useState([]);
    const [messageList2, setMessageList2] = useState([]);
    const [messageList3, setMessageList3] = useState([]);

    useEffect(() => {
        socket = io(CONNECTION_PORT)
    }, [CONNECTION_PORT]);

    useEffect(() => {
        socket.on("receive_message1", data => {
            setMessageList1([...messageList1, data])
        })
    });

    const sendMessage1 = () => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        let messageContent = {
            room: userData.user.room,
            content: {
                author: storedData.username,
                message: message
            }

        }
        socket.emit('send_message', messageContent);
        setMessageList1([...messageList1, messageContent.content])
        setMessage('')
    };

    const sendMessage2 = () => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        let messageContent = {
            room: userData.user.room,
            content: {
                author: storedData.username,
                message: message
            }
        }
        socket.emit('send_message', messageContent);
        setMessageList2([...messageList2, messageContent.content])
        setMessage('')
    };

    const sendMessage3 = () => {
        const storedData = JSON.parse(localStorage.getItem('userData'));
        let messageContent = {
            room: userData.user.room,
            content: {
                author: storedData.username,
                message: message
            }
        }
        socket.emit('send_message3', messageContent);
        setMessageList3([...messageList3, messageContent.content])
        setMessage('')
    };


    const [hp, setHp] = useState(100);
    const [xp, setXp] = useState(0);
    const [text, setText] = useState('');

    let isUserLost = false
    let unknown = false

    const initialValues = {
        email: ''
    }

    const initialValues2 = {
        action: ''
    }

    const logout = () => {
        localStorage.removeItem('userData')
        window.location.reload();
    }


    if (isLoading) {
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Welcome ! </Nav.Link>
                            <Nav.Link> <p onClick={() => logout()}>Log out</p></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <div className="loader" />
            </div>
        )
    }

    if (!isLoading && userData.user && users) {
        const score = parseInt(userData.user.score, 10);
        const experience = parseInt(userData.user.experience, 10);
        const health = parseInt(userData.user.health, 10);

        console.log(score, health, experience)
        console.log(health - 5)
        return (
            <div>
                <Navbar bg="light" expand="lg">
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            <Nav.Link href="#home">Welcome {userData.user.username}! </Nav.Link>
                            <Nav.Link> <p onClick={() => logout()}>Log out</p></Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>

                    <div className="App" style={{padding: '1%'}}>
                        <h1 style={{textAlign: 'center'}}>Task2_ChatApp_With rooms ! Welcome {userData.user.username} !</h1>
                        <p style={{textAlign: 'center'}}>Good morning, {userData.user.username}, welcome to this new game.
                            Currently you are in the main room but you'll be able to move between
                            rooms by clicking on the 'next room' button. To play this game, you have to enter in the input field below some actions
                            (search, kill or quit). According to the actions you chose, you will receive some experience, and your score will increase.
                            The aim of the game, like in most games, is to have the best score possible. Good luck new player !
                        </p>


                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Players</th>
                                <th>Best scores</th>
                            </tr>
                            </thead>
                            <tbody>
                            {users.map(item => (
                                <tr>
                                    <td>{item.username}</td>
                                    <td>{item.score}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>


                        {userData.user.room === "1" && (
                            <div style={{padding: '2% 2%'}}>
                                <h1>You are in the main room</h1>

                                <p>Your status is now : </p>
                                <div style={{display: 'flex', justifyContent: 'space-around', width: '80%', margin: '0 auto'}}>
                                    <div>
                                        <p>Hp : {health}</p>
                                        <p>XP: {experience}</p>
                                        <p>Score: {score}</p>
                                    </div>

                                </div>

                                <div className="imgContainer">
                                    <img src="https://cdn.akamai.steamstatic.com/steam/apps/1240730/extras/Details_Img05.jpg?t=1605642252" alt="" className='imageDarkroom'/>
                                </div>
                                <p>You are in a dark room, no windows, but there is a candle and some strange shapes in the corners of the room. There is a door on the west wall. What do you want do to?</p>

                                <Formik
                                    initialValues={initialValues2}
                                    onSubmit={async values => {
                                        console.log(values)
                                        if (values.action === 'search') {
                                            let dice = Math.floor(Math.random() * 6) + 1;
                                            if (dice === 1) {
                                                setText('You found some coins !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 250,
                                                    experience: experience + 20,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 2) {
                                                setText('You found a treasure !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 350,
                                                    health: health,
                                                    experience: experience + 40,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 3) {
                                                setText('You found poisonous mushrooms !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    health: health,
                                                    experience: experience + 5,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 4) {
                                                setText('You found a ghost !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    health: health,
                                                    experience: experience + 5,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 5) {
                                                setText('You found nothing...')
                                            }
                                            if (dice === 6) {
                                                setText('You found nothing...')
                                            }
                                        }
                                        if (values.action === 'kill') {
                                            let dice = Math.floor(Math.random() * 6) + 1;
                                            if (dice === 1) {
                                                setText('You killed a goblin !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 250,
                                                    health: health,
                                                    experience: experience + 20,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 2) {
                                                setText('You killed a huge monster !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 350,
                                                    health: health,
                                                    experience: experience + 40,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 3) {
                                                setText('You were injured !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    username: userData.user.username,
                                                    experience: experience + 5,
                                                    health: health - 5
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 4) {
                                                setText('You were seriously injured !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health - 10,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 5) {
                                                setText('Oh no ! You lost your sword !...')
                                            }
                                            if (dice === 6) {
                                                setText('You are too scared to move...')
                                            }
                                        }
                                        if (values.action === 'quit') {
                                            logout()
                                        }
                                        else {
                                            unknown = true
                                        }
                                    }}
                                >
                                    {props => (
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                {unknown && (
                                                    <p>This command is unknown...</p>
                                                )}
                                                <div>
                                                    <label htmlFor="">What do you want to do ? (search/kill/quit)</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.action}
                                                        onChange={props.handleChange('action')}
                                                    />
                                                    <button onClick={props.handleSubmit}>Submit</button>
                                                    <p>{text}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <button onClick={ async () => {
                                                    await axios.post(`${uri}/changeroom`, {
                                                        room: 2,
                                                        username: userData.user.username
                                                    })
                                                    setText(null)
                                                    socket.emit('join_room', "2")
                                                    socket.emit('disconnect1')
                                                    window.location.reload()
                                                }}>Go to the next room</button>
                                            </div>
                                        </div>

                                    )}
                                </Formik>

                                <div className="chat-container">
                                    <header className="chat-header">
                                        <h1><FontAwesomeIcon icon={faSmile} />Chat with users in this room !</h1>
                                    </header>
                                    <main className="chat-main">
                                        <div className="chat-sidebar">
                                            <h3><FontAwesomeIcon icon={faComments} /> Room Name:</h3>
                                            <h2 id="room-name">Main room</h2>
                                        </div>
                                        <div className="chat-messages">
                                            {messageList1.map((val, key) => {
                                                return (
                                                    <div className="message">
                                                        <p className="meta">{val.author}</p>
                                                        <p className="text">
                                                            {val.message}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </main>
                                    <div className="chat-form-container">
                                        <div id="chat-form">
                                            <input
                                                id="msg"
                                                type="text"
                                                placeholder="Enter Message"
                                                required
                                                onChange={(e) => setMessage(e.target.value)}
                                                autoComplete="off"
                                            />
                                            <button className="btn" onClick={() => sendMessage1()}><i className="fas fa-paper-plane"></i> Send</button>
                                        </div>
                                    </div>
                                </div>


                            </div>
                        )}


                        {userData.user.room === "2" && (
                            <div style={{padding: '2% 2%'}}>
                                <h1>You are in the second room</h1>

                                <p>Your status is now : </p>
                                <div style={{display: 'flex', justifyContent: 'space-around', width: '80%', margin: '0 auto'}}>
                                    <p>Hp : {health}</p>
                                    <p>XP: {experience}</p>
                                    <p>Score: {score}</p>
                                </div>

                                <div className="imgContainer">
                                    <img src="https://st.depositphotos.com/2627989/4694/i/600/depositphotos_46941945-stock-photo-spring-forrest-sunset.jpg" alt="" className='imageDarkroom'/>
                                </div>
                                <p>You are now in the forrest room. This may seem like a peaceful place, but careful young adventurer...
                                    What do you want do to?</p>

                                <Formik
                                    initialValues={initialValues2}
                                    onSubmit={async values => {
                                        console.log(values)
                                        if (values.action === 'search') {
                                            let dice = Math.floor(Math.random() * 6) + 1;
                                            if (dice === 1) {
                                                setText('You found some coins !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 250,
                                                    experience: experience + 20,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 2) {
                                                setText('You found a treasure !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 350,
                                                    experience: experience + 40,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 3) {
                                                setText('You found poisonous mushrooms !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 4) {
                                                setText('You found a troll !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 100,
                                                    experience: experience + 5,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 5) {
                                                setText('You found nothing...')
                                            }
                                            if (dice === 6) {
                                                setText('You found nothing...')
                                            }
                                        }
                                        if (values.action === 'kill') {
                                            let dice = Math.floor(Math.random() * 6) + 1;
                                            if (dice === 1) {
                                                setText('You killed a goblin !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 250,
                                                    experience: experience + 20,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 2) {
                                                setText('You killed a huge monster !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 350,
                                                    experience: experience + 40,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 3) {
                                                setText('You were injured !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health - 5,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 4) {
                                                setText('You were seriously injured !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health - 10,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 5) {
                                                setText('Oh no ! You lost your sword !...')
                                            }
                                            if (dice === 6) {
                                                setText('You are too scared to move...')
                                            }
                                        }
                                        if (values.action === 'quit') {
                                            logout()
                                        }
                                        unknown = true
                                    }}
                                >
                                    {props => (
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div>
                                                <button onClick={ async () => {
                                                    await axios.post(`${uri}/changeroom`, {
                                                        room: 1,
                                                        username: userData.user.username
                                                    })
                                                    setText(null)
                                                    socket.emit('join_room', "1")
                                                    socket.emit('disconnect2')
                                                    window.location.reload()
                                                }}>Go to the previous room</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                {unknown && (
                                                    <p>This command is unknown...</p>
                                                )}
                                                <div>
                                                    <label htmlFor="">What do you want to do ? (search/kill/quit)</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.action}
                                                        onChange={props.handleChange('action')}
                                                    />
                                                    <button onClick={props.handleSubmit}>Submit</button>
                                                    <p>{text}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <button onClick={ async () => {
                                                    await axios.post(`${uri}/changeroom`, {
                                                        room: 3,
                                                        username: userData.user.username
                                                    })
                                                    setText(null)
                                                    socket.emit('join_room', "3")
                                                    socket.emit('disconnect2')
                                                    window.location.reload()
                                                }}>Go to the next room</button>
                                            </div>
                                        </div>

                                    )}
                                </Formik>

                                <div className="chat-container">
                                    <header className="chat-header">
                                        <h1><FontAwesomeIcon icon={faSmile} />Chat with users in this room !</h1>
                                    </header>
                                    <main className="chat-main">
                                        <div className="chat-sidebar">
                                            <h3><FontAwesomeIcon icon={faComments} /> Room Name:</h3>
                                            <h2 id="room-name">Forrest room</h2>
                                        </div>
                                        <div className="chat-messages">
                                            {messageList2.map((val, key) => {
                                                return (
                                                    <div className="message">
                                                        <p className="meta">{val.author}</p>
                                                        <p className="text">
                                                            {val.message}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </main>
                                    <div className="chat-form-container">
                                        <div id="chat-form">
                                            <input
                                                id="msg"
                                                type="text"
                                                placeholder="Enter Message"
                                                required
                                                onChange={(e) => setMessage(e.target.value)}
                                                autoComplete="off"
                                            />
                                            <button className="btn" onClick={() => sendMessage2()}><i className="fas fa-paper-plane"></i> Send</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}


                        {userData.user.room === "3" && (
                            <div style={{padding: '2% 2%'}}>
                                <h1>You are in the third room</h1>

                                <p>Your status is now : </p>
                                <div style={{display: 'flex', justifyContent: 'space-around', width: '80%', margin: '0 auto'}}>
                                    <p>Hp : {health}</p>
                                    <p>XP: {experience}</p>
                                    <p>Score: {score}</p>
                                </div>

                                <div className="imgContainer">
                                    <img src="https://static.euronews.com/articles/stories/05/00/14/58/1440x810_cmsv2_3031d677-63ce-54f2-baa9-1deb93f016c1-5001458.jpg" alt="" className='imageDarkroom'/>
                                </div>
                                <p>You are now in the ocean room. Be careful to the creature you find around you
                                    What do you want do to?</p>


                                <Formik
                                    initialValues={initialValues2}
                                    onSubmit={async values => {
                                        console.log(values)
                                        if (values.action === 'search') {
                                            let dice = Math.floor(Math.random() * 6) + 1;
                                            if (dice === 1) {
                                                setText('You found some coins !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 250,
                                                    experience: experience + 20,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 2) {
                                                setText('You found a treasure !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 350,
                                                    experience: experience + 40,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 3) {
                                                setText('You found a poisonous fish !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 4) {
                                                setText('You found a shark !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 100,
                                                    experience: experience + 5,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 5) {
                                                setText('You found nothing...')
                                            }
                                            if (dice === 6) {
                                                setText('You found nothing...')
                                            }
                                        }
                                        if (values.action === 'kill') {
                                            let dice = Math.floor(Math.random() * 6) + 1;
                                            if (dice === 1) {
                                                setText('You killed a whale !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 250,
                                                    experience: experience + 20,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 2) {
                                                setText('You killed a shark !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score + 350,
                                                    experience: experience + 40,
                                                    health: health,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 3) {
                                                setText('You were injured !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health - 5,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 4) {
                                                setText('You were seriously injured !')
                                                await axios.patch(`${uri}/updatescore`, {
                                                    score: score - 50,
                                                    experience: experience + 5,
                                                    health: health - 10,
                                                    username: userData.user.username
                                                })
                                                window.location.reload()
                                            }
                                            if (dice === 5) {
                                                setText('Oh no ! You lost your harpoon !...')
                                            }
                                            if (dice === 6) {
                                                setText('You are too scared to move...')
                                            }
                                        }
                                        if (values.action === 'quit') {
                                            logout()
                                        }
                                        else {
                                            unknown = true
                                        }
                                    }}
                                >
                                    {props => (
                                        <div style={{display: 'flex', justifyContent: 'space-between'}}>
                                            <div>
                                                <button onClick={ async () => {
                                                    await axios.post(`${uri}/changeroom`, {
                                                        room: 2,
                                                        username: userData.user.username
                                                    })
                                                    setText(null)
                                                    socket.emit('join_room', "2")
                                                    socket.emit('disconnect3')
                                                    window.location.reload()
                                                }}>Go to the previous room</button>
                                            </div>

                                            <div style={{display: 'flex', flexDirection: 'column'}}>
                                                {unknown && (
                                                    <p>This command is unknown...</p>
                                                )}
                                                <div>
                                                    <label htmlFor="">What do you want to do ? (search/kill/quit)</label>
                                                    <input
                                                        type="text"
                                                        value={props.values.action}
                                                        onChange={props.handleChange('action')}
                                                    />
                                                    <button onClick={props.handleSubmit}>Submit</button>
                                                    <p>{text}</p>
                                                </div>
                                            </div>
                                        </div>

                                    )}
                                </Formik>

                                <div className="chat-container">
                                    <header className="chat-header">
                                        <h1><FontAwesomeIcon icon={faSmile} />Chat with users in this room !</h1>
                                    </header>
                                    <main className="chat-main">
                                        <div className="chat-sidebar">
                                            <h3><FontAwesomeIcon icon={faComments} /> Room Name:</h3>
                                            <h2 id="room-name">Ocean room</h2>
                                        </div>
                                        <div className="chat-messages">
                                            {messageList3.map((val, key) => {
                                                return (
                                                    <div className="message">
                                                        <p className="meta">{val.author}</p>
                                                        <p className="text">
                                                            {val.message}
                                                        </p>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </main>
                                    <div className="chat-form-container">
                                        <div id="chat-form">
                                            <input
                                                id="msg"
                                                type="text"
                                                placeholder="Enter Message"
                                                required
                                                onChange={(e) => setMessage(e.target.value)}
                                                autoComplete="off"
                                            />
                                            <button className="btn" onClick={() => sendMessage3()}><i className="fas fa-paper-plane"></i> Send</button>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        )}

                    </div>

            </div>
        )
    } else {
        return <div>
            <h1>Test</h1>
        </div>
    }
};

export default AcceuilScreen;