// Include express module
const express = require('express');
// Include http module. Used by express
const http = require('http');
// Add socket.io to server
const { Server } = require("socket.io");
// Add path
const path = require("path");

// Create PORT number
const PORT = 3000;
// Create an Express application / function handler
const app = express();
// Turn computer to a server. Create http server object. Supply app to http server.
const server = http.createServer(app);
// Initialize a new socket.io instance by passing the server(http server) object
const io = new Server(server);

// Create User class
class User {
  constructor(username, id) {
      this.name = username;
      this.id = id;
  }
}

// Create array of users
var users = new Array();

// Access public folder for front-end
app.use(express.static(__dirname + '/public'));

// Define a route handler / that gets called when we hit our website home.
app.get('/', (req, res) => {
    // Send contents of file to website home
    res.sendFile(path.join(__dirname, '/public', 'index.html'));
  });

// Listen on the connection event for incoming sockets and log it to the console
io.on('connection', (socket) => {
  socket.on('disconnect', () => {
    var user = users.find(user => user.id === socket.id);
    socket.broadcast.emit('erase user', user);
    socket.broadcast.emit('chat message', user.name + ' has disconnected');

    // remove user from users array
    const index = users.indexOf(user);
    if (index > -1) {
      users.splice(index, 1);
    }
  });

  socket.on('chat message', (msg) => {
    var user = users.find(user => user.id === socket.id);
    console.log(user.name + ': ' + msg);
    io.emit('chat message', user.name + ': ' + msg);
  });
    
  socket.on('show user', (username) => {
    // Create new User object with unique socket id
    var user = new User(username, socket.id);
    // Show a user is connected to chat
    console.log('a user connected');
    socket.emit('chat message', user.name + ', welcome to the chat');
    socket.broadcast.emit('chat message', user.name + ' has joined the chat');
    // Show user is available in current users side bar
    io.emit('show user', user);
    socket.emit('show users', users);
    users.push(user);
  })
});

// Make http server listen on port 3000
server.listen(PORT, () => {
  console.log(`listening on *:${PORT}`);
});