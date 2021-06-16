var socket = io();
var messages = document.getElementById('messages')
var form = document.getElementById('form');
var input = document.getElementById('input');

// Get query the url for paramter
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const username = urlParams.get('username');

// Show that user is available
socket.emit('show user', username);

form.addEventListener('submit', function(e) {
    e.preventDefault();
    if (input.value) {
        socket.emit('chat message', input.value);
        input.value = '';
    } 
});

socket.on('chat message', function(msg) {
    var item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});

socket.on('show user', function(user) {
    displayUser(user);
});

socket.on('show users', function(users) {
    console.log(users);
    users.forEach(displayUser);
});

socket.on('erase user', function(user) {
    var item = document.getElementById(user.id);
    item.remove();
})

function displayUser(user) {
    var item = document.createElement('li');
    item.textContent = user.name;
    item.id = user.id;
    availableUsers.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
}