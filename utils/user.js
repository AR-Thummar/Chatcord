let users = []

const newUser = (id, name, room) => {
    users.push({id, name, room})
}

const currentUser = (id) => {
    return users.find((user) => user.id === id)
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    return users.splice(index, 1)[0]
}

const getAllUsersOfRoom = (room) => {
    return users.filter((user) => user.room === room)
}

module.exports = {
    newUser,
    currentUser,
    removeUser,
    getAllUsersOfRoom
}