import express from 'express';
import { Server } from 'socket.io';
import { createServer } from 'http';

const app = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const port = process.env.PORT || 3000;

httpServer.listen(port, () => {
    console.log(` Chat server up an running on ${port}`);
})

const users = {};

io.on('connection', (socket) => {
    // console.log('a user connected');
    //this is custom event we emit on the server side. it can be called anything
    socket.emit("CONNECTED", socket.id);

    socket.on('user-joined', (data) => {
        users[socket.id] = data.user;
        console.log(users);

        io.emit('joined', {user: users});
        socket.broadcast.emit('user-has-joined', {user: socket.id, message: `${users[socket.id]} has Joined the room.`});
        console.log(`${users[socket.id]} has connected`);
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', {user: socket.id, messageDisconnect: `${users[socket.id]} has left the room.`})
        console.log(`${users[socket.id]} disconnected.`);
    })

    //listen for incoming messages
    socket.on('SEND_MESSAGE', function(data){
        console.log('someone sent a message', data);

        io.emit('MESSAGE', data);
    })
    socket.on("TYPING", (data) => {
        console.log(`${data.username} is typing ... `);
    })
});
