const users = []

function userJoin(id, username, room) {
    const user = { id, username, room }
    users.push(user);
    return user;
}
function getCurrentUser(id) {
    users.find(user => user.id === id)
}
//leave room
function leaveRoom(id) {
    let index = users.findIndex(u => u.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
}
// Get current user
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}
// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}
module.exports = {
    userJoin,
    getCurrentUser,
    leaveRoom,
    getRoomUsers
}