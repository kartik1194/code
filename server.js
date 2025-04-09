// server.js - Enhanced relay server
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, { cors: { origin: "*" } });

// Track connections
let testTaker = null;
let helper = null;

// Minimal heartbeat to check connections
function broadcastStatus() {
  const status = {
    takerConnected: !!testTaker,
    helperConnected: !!helper
  };

  if (testTaker) testTaker.emit('status', status);
  if (helper) helper.emit('status', status);
}

// Handle connections
io.on('connection', (socket) => {
  console.log('Connection:', socket.id);

  // Register role
  socket.on('register', (role) => {
    if (role === 'test-taker') {
      if (testTaker) testTaker.disconnect();
      testTaker = socket;
      console.log('Test-taker registered:', socket.id);
    } else if (role === 'helper') {
      if (helper) helper.disconnect();
      helper = socket;
      console.log('Helper registered:', socket.id);
    }

    broadcastStatus();
  });

  // Relay messages
  socket.on('message', (data) => {
    // Add sender info
    data.sender = socket === testTaker ? 'test-taker' : 'helper';

    // Relay to other party
    if (socket === testTaker && helper) {
      helper.emit('message', data);
    } else if (socket === helper && testTaker) {
      testTaker.emit('message', data);
    }

    // Echo back to sender for confirmation
    socket.emit('message', data);
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    if (socket === testTaker) {
      console.log('Test-taker disconnected');
      testTaker = null;
    }
    if (socket === helper) {
      console.log('Helper disconnected');
      helper = null;
    }

    broadcastStatus();
  });
});

// Basic health endpoint
app.get('/', (req, res) => {
  res.send('Server running');
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));