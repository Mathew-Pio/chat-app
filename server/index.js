import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'
import {Server} from 'socket.io';

dotenv.config();
const port = process.env.PORT;
const mongourl = process.env.MONGODB_URL
const app = express();

const corsOptions = {
    origin: true,
    credentials: true
}

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', userRoutes);
app.use('/api/messages', messageRoutes)

mongoose.set('strictQuery', false);

const connectDb = async () => {
    try{
        await mongoose.connect(mongourl);
        console.log(`Mongodb database is connected`)
    }catch(err){
        console.log(err)
    }
}

const server = app.listen(port, () => {
    connectDb();
    console.log(`app is listening on port ${port}`)
})



const io = new Server(server, {
    cors: {
        origin: "https://chat-app-client-brown.vercel.app",
        credentials: true,
    }
})

global.onlineUsers = new Map();


io.on('connection', (socket) => {
    global.chatSocket = socket;
    socket.on('add-user', (userId) => {
        onlineUsers.set(userId, socket.id)
    })
    socket.on('send-msg',(data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if(sendUserSocket){
            io.to(sendUserSocket).emit('msg-recieve', data.message);
        }
    })
});                                  