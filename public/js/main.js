const chatForm = document.getElementById('chat-form')
const messageInput = document.getElementById("msg")
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const messageTone = new Audio('/message-tone.mp3')

//connect server io
const socket = io('https://chatio-yotc.onrender.com/')
// Parse the query string using the qs library
var pageUrl = new URL(window.location.href);

var username = pageUrl.searchParams.get("username")
var room = pageUrl.searchParams.get("room")

//send username and room to server
socket.emit("userroom", ({ username, room }))

socket.on("roomUsers", ({ users, room }) => {
    outputRoomName(room)
    outputUsers(users)
})
//message from server
socket.on("message", data => {
    messageTone.play()
    outPut(data)
    chatMessages.scrollTop = chatMessages.scrollHeight;
    messageInput.value = " "
})

//submit chat-form
chatForm.addEventListener("submit", e => {
    e.preventDefault()
    const messages = messageInput.value
    if (messages) {
        //emitting event to server with the data of user input and sending it through sockets
        socket.emit("chatMsg", messages)
    }
})

//display message
function outPut(message) {
    const div = document.createElement("div")
    div.classList.add("message")
    div.innerHTML = `
    <p class='meta' >${message.username} <span> ${message.timeStamp} </span> </p>
    <p class ='text'> ${message.text} </p>
    `
    document.querySelector(".chat-messages").appendChild(div)
}
// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}

//Prompt the user before leave chat room
document.getElementById('leave-btn').addEventListener('click', () => {
    const leaveRoom = confirm('Are you sure you want to leave the chatroom?');
    if (leaveRoom) {
        window.location = '../index.html';
    } else {
    }
})