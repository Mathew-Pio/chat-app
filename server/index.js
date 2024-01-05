import express from "express";
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from "mongoose";
import userRoutes from './routes/user.js'
import messageRoutes from './routes/message.js'
import {Server} from 'socket.io';
import path from 'path';

dotenv.config();
const port = process.env.PORT;
const mongourl = process.env.MONGODB_URL
const app = express();

app.use(cors());
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

const __dirname = path.resolve();


const io = new Server(server, {
    cors: {
        origin: "https://chat-app-jet-mu.vercel.app/",
        credentials: true,
    }
})

global.onlineUsers = new Map();

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Handle client-side routing for any other request
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

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