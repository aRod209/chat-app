// Include express module
const express = require('express');
// Create an Express application / function handler
const app = express();
// Include http module
const http = require('http');
// Turn computer to a computer. Create http server object. Supply app to http server.
const server = http.createServer(app);
// Add socket.io to server
const { Server } = require("socket.io");
// Initialize a new socket.io instance by passing the server(http server) object
const io = new Server(server);
const path = require('path')

app.use('/public', express.static('public'));

// Define a route handler / that gets called when we hit our website home.
app.get('/', (req, res) => {
    // Send contents of file to website home
    res.sendFile(__dirname + '/index.html');
  });

// Listen on the connection event for incoming sockets and log it to the console
io.on('connection', (socket) => {
    console.log('a user connected');
    io.emit('user available', 'USER');
    socket.on('disconnect', () => {
        console.log('user disconnected');
      });
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
  });

// Make http server listen on port 3000
server.listen(3000, () => {
  console.log('listening on *:3000');
});