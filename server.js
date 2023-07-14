const express = require('express')
const app = express()
const path = require('path')
const formatMsg = require('./utils/messages')
const { userJoin, leaveRoom, getRoomUsers, getCurrentUser } = require('./utils/user')
const port = 3000

app.use(express.static(path.join(__dirname, 'public')))

const server = app.listen(port, () => console.log(`Backend Server listening on port ${port}!`))
const io = require('socket.io')(server, {
    cors: "*"
})
const chatName = 'Chat Io'

io.on('connection', socket => {
    socket.on("userroom", ({ username, room }) => {
        const user = userJoin(socket.id, username, room)
        socket.join(user.room)
        //welcome current user
        socket.emit("message", formatMsg(chatName, `welcome ${user.username} to Chat Io!`))
        //send user has joined to room
        socket.broadcast.to(user.room).emit("message", formatMsg(chatName, `${user.username} has joined!`))
        // Send users and room info
        io.to(user.room).emit("roomUsers", {
            room: user.room,
            users: getRoomUsers(user.room),
        });
        //recive message from client side and send it to online user
        socket.on("chatMsg", message => {
            const user = getCurrentUser(socket.id);
            io.to(user.room).emit("message", formatMsg(user.username, message))
        })
        //disconnect user
        socket.on('disconnect', () => {
            const user = leaveRoom(socket.id)
            if (user) {
                io.to(user.room).emit("message", formatMsg(chatName, `${user.username} has left the Chat`))
                // Send users and room info
                io.to(user.room).emit("roomUsers", {
                    room: user.room,
                    users: getRoomUsers(user.room),
                });
            }
        })
    })
})
