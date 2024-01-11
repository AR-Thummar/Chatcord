const socket = io();

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});


const chatMessagesDiv = document.querySelector('.chat-messages')
const chatForm = document.querySelector('#chat-form')
const users = document.querySelector('#users')
const roomName = document.querySelector('#room-name')

if(room){
    roomName.innerHTML = room
}

socket.emit('newUser', {username, room})

socket.on('message', (msg) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta">${msg.username} <span>${msg.timestamp}</span></p><p class="text">${msg.text}</p>`

    chatMessagesDiv.appendChild(div)

    // Scroll down
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
})

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const msgInput = document.querySelector('#msg')
    const userMsg = msgInput.value

    if (!userMsg.trim()) {
        return false;
    }

    socket.emit('chatMessage', userMsg)
    msgInput.value = ''
    msgInput.focus();
})

socket.on('roomUsers', (userList) => {
    users.innerHTML = ''
    userList.forEach(user => {
        const li = document.createElement('li')
        li.innerHTML = `${user.name}</p>`

        users.appendChild(li)
    });
})