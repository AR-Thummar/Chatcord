const express = require('express')
const { Server } = require("socket.io");
const http = require('http')
const {formatMsg} = require('./utils/message')
const {newUser, currentUser, removeUser, getAllUsersOfRoom} = require('./utils/user')

const app = express()
const server = http.createServer(app)
const io = new Server(server);

app.use(express.static("public"));

const chatName = `AT's ChatCord`

io.on('connection', (socket) => {
    socket.on('newUser', ({username, room}) => {
        //add user in room
        socket.join(room);
        //send welcom msg to current user only
        socket.emit('message', formatMsg(chatName, `Welcome ${username}`))
        //send user has joined msg to all the users on the room except current user
        socket.broadcast.to(room).emit('message', formatMsg(chatName, `${username} has joined the chat`))
        //add user in DB
        newUser(socket.id, username, room)

        const roomUsers = getAllUsersOfRoom(room)
        io.to(room).emit('roomUsers', roomUsers)
    })
    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = currentUser(socket.id)
        if(user) io.to(user.room).emit('message', formatMsg(user.name, msg))
    })
    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = removeUser(socket.id)
        if(user){
            socket.broadcast.to(user.room).emit('message', formatMsg(chatName, `${user.name} has left the chat`))
            const users = getAllUsersOfRoom(user.room)
            io.to(user.room).emit('roomUsers', users)
        }
    });
});

const port = process.env.PORT || 9000
server.listen(port, () => {
    console.log('server started...')
})

/*
NOTES:
    socket.emit('topic name', msg) --send msg to current user
    socket.brodcast.emit('topic name', msg)  --send msg to all users except current user
    socket.brodcast.to().emit('topic name', msg)  --send msg to all room users except current user
    io.emit('topic name', msg)  --send msg to all users
    io.to().emit('topic name', msg)  --send msg to all room users

    socket.on('topic name', callbackFn) --to listen the msg

    socket.join(roomName); --to join the room

Summary:
    If you want to send msg to client use emit() 
    and 
    To listen/receive the msg from client use on().

    same from client side as well,
    To send msg to server use emit() 
    and 
    To listen/receive the msg from server use on().
*/