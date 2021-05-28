import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import bcrypt from 'bcryptjs';
import cors from 'cors';
import http from 'http';
import {User} from "./models/user.js";
import {validationResult} from "express-validator";
import jwt from 'jsonwebtoken';
import {Server} from "socket.io";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
app.use(bodyParser.json());
app.use(cors());

const server = http.createServer(app)
const io = new Server(server, {cors : {origin: '*'}});
const port = process.env.PORT || 5000;


//Socket connection
io.on('connection', socket => {
    console.log('New WS connection')

    socket.on('join_room1', (data) => {
        socket.join(data)
        console.log(data)
        console.log('user joined room' + data)
    });

    socket.on("send_message", (data) => {
        console.log(data.room)
        socket.to(data.room.toString()).emit("receive_message", data.content)
    })


    socket.on('disconnect', () => {
        console.log('user disconnected')
    })
});


//Login logic
app.post('/signup', async (req, res, next) => {
    const {username, password} = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({username: username})
    } catch(err) {
        res.status(500)
        const error = new Error(
            'Signup failed ! Please try again later'
        )
    }

    if (existingUser) {
        res.status(422)
        const error = new Error(
            "User exists already, please login instead"
        )
        return next(error)
    }

    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
        res.status(500)
        const error = new Error (
            'Problem with bcrypt !'
        );
        return next(error)
    }

    const createdUser = new User({
        username,
        password: hashedPassword,
        room: 1,
        health: 100,
        experience: 0,
        score: 0
    })

    try {
        await createdUser.save();
    } catch (err) {
        res.status(500)
        const error = new Error(
            'Signup failed !'
        )
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({userId: createdUser.id, username: createdUser.username},
            'secret',
            { expiresIn: '365d'})

    } catch (err) {
        res.status(500)
        const error = new Error(
            'Signup failed !'
        )
        return next(error)
    }

    res.status(201).json({userID: createdUser.id, username: createdUser.username, token: token})
});

app.post('/login', async (req, res, next) => {

    const {username, password} = req.body;
    let existingUser
    try {
        existingUser = await User.findOne({username: username})
    } catch(err) {
        res.status(500)
        const error = new Error(
            'Log in failed ! Please try again later'
        )
    }

    if (!existingUser) {
        res.status(401)
        const error = new Error(
            'This user does not exist!'
        )
        return next(error)
    }

    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch(err) {
        res.status(401)
        const error = new Error (
            'Could not log you in !'
        );
        return next(error)
    }

    if (!isValidPassword) {
        res.status(401)
        const error = new Error (
            'Could not log you in !'
        );
        return next(error)
    }

    let token;
    try {
        token = jwt.sign({userId: existingUser.id, username: existingUser.username},
            'secret',
            { expiresIn: '365d'})

    } catch (err) {
        res.status(500)
        const error = new Error(
            'Log in failed !'
        )
        return next(error)
    }


    res.json({
        userId: existingUser.id,
        username: existingUser.username,
        token: token
    });
});


app.post('/', async (req, res, next) => {

    const {username} = req.body

    let user
    try {
        user = await User.findOne({username: username})
        console.log(user)
    } catch (err) {
        const error = new Error('Something went wrong !')
        return next(error)
    }

    res.json({
        user
    })

});

app.patch('/updatescore', async (req, res, next) => {

    const {health, score, experience, username} = req.body;

    console.log(req.body)
    let user;
    try {
        user = await User.findOne({username: username})
        console.log(user)
    } catch (err) {
        const error = new Error('Something went wrong')
        return next(error)
    }
    user.health = health;
    user.experience = experience;
    user.score = score;

    try {
        await user.save();
    } catch (err) {
        const error = new Error('Something went wrong')
        return next(error)
    }

    res.status(200).json({user: user.toObject({getters: true})})
});

app.post('/changeroom', async (req, res, next) => {
    const {room, username} = req.body;

    let user;
    try {
        user = await User.findOne({username: username})
    } catch (err) {
        const error = new Error('Something went wrong')
        return next(error)
    }
    user.room = room;

    try {
        await user.save()
    } catch (err) {
        const error = new Error('Something went wrong')
        return next(error)
    }

    res.status(200).json({user: user.toObject({getters: true})})
})

app.get('/', async (req, res, next) => {
    let users;
    try {
        users = await User.find()
    } catch(err) {
        res.status(500)
        const error = new Error('Something went wrong !')
        return next(error)
    }
    res.json({users: users.map(user => user.toObject({getters: true}))})
});

app.use(express.static(path.join(__dirname, 'frontend', 'build')));

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'frontend', 'build', 'index.html'));
});

const dbURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.0auvp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
    .then(() => {
        server.listen(port, () => {
            console.log(`listening on port ${port}`)
        })
    })
    .catch(err => console.log(err))



