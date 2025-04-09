// client.js - Universal client for both roles
const readline = require('readline');
const socketIo = require('socket.io-client');
const clear = require('clear');

// Parse command line args
const args = process.argv.slice(2);
const isHelper = args.includes('-h');
const role = isHelper ? 'helper' : 'test-taker';

// Connect to server : choose only one server

//const SERVER_URL = 'http://localhost:3000'; // For local testing

const SERVER_URL = 'https://exam-relay-server.onrender.com';  // server 1

//const SERVER_URL = 'https://exam-relay-server-2.onrender.com'; // server 2

// const SERVER_URL = 'https://exam-relay-server-3.onrender.com'; // server 3

// const SERVER_URL = 'https://exam-relay-server-4.onrender.com'; // server 4




const socket = socketIo(SERVER_URL);

// Set up terminal interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Custom prompt based on role
const PROMPT = isHelper ? 'HELPER> ' : 'EXAM> ';

// Status indicators
let connected = false;
let peerConnected = false;

// Connect to server
socket.on('connect', () => {
  clear();
  socket.emit('register', role);
  connected = true;
  console.log(`✓ Connected as ${role}`);
  
  // Start input loop
  promptInput();
});

// Handle connection status updates
socket.on('status', ({helperConnected, takerConnected}) => {
  peerConnected = isHelper ? takerConnected : helperConnected;
  const statusMsg = peerConnected ? 
    '✓ Partner online' : 
    '× Partner offline';
  
  // Update status line (clear previous line first)
  process.stdout.write('\r\x1B[K');
  process.stdout.write(statusMsg + '\n');
  promptInput();
});

// Handle incoming messages
socket.on('message', (data) => {
  const {type, content, sender} = data;
  const prefix = sender === role ? '↑' : '↓';
  
  // Format based on message type
  switch(type) {
    case 'chat':
      console.log(`\n${prefix} ${content}`);
      break;
    case 'code':
      console.log(`\n${prefix} CODE:`);
      console.log(content);
      break;
    case 'question':
      console.log(`\n${prefix} QUESTION:`);
      console.log(content);
      break;
    case 'alert':
      console.log(`\n⚠️ ALERT: ${content}`);
      break;
  }
  
  promptInput();
});

// Handle disconnection
socket.on('disconnect', () => {
  connected = false;
  console.log('\n× Disconnected from server');
  promptInput();
});

// Process and send input
function processInput(input) {
  if (!input.trim()) return;
  
  // Command processing
  if (input.startsWith('!')) {
    const [cmd, ...args] = input.slice(1).split(' ');
    const content = args.join(' ');
    
    switch(cmd) {
      case 'q': // Question
        socket.emit('message', {type: 'question', content});
        break;
      case 'c': // Code
        socket.emit('message', {type: 'code', content});
        break;
      case 'p': // Panic - clear screen
        clear();
        break;
      case 'h': // Help
        showHelp();
        break;
      case 's': // Send alert signal
        socket.emit('message', {type: 'alert', content: content || 'Urgent assistance needed!'});
        break;
      case 'x': // Exit immediately
        console.log('Exiting...');
        socket.disconnect();
        rl.close();
        process.exit(0);
        break;
      default:
        console.log('Unknown command. Type !h for help.');
    }
  } else {
    // Regular chat message
    socket.emit('message', {type: 'chat', content: input});
  }
}

// Display help information
function showHelp() {
  console.log('\nCommands:');
  console.log('!q [text]  - Send exam question');
  console.log('!c [code]  - Send code snippet');
  console.log('!s [msg]   - Send alert signal');
  console.log('!p         - Panic (clear screen)');
  console.log('!x         - Exit immediately');
  console.log('!h         - Show this help');
  console.log('\nTips:');
  console.log('- Regular text is sent as chat');
  console.log('- Use !x to exit properly');
  console.log('- Minimize window size for stealth');
}

// Input prompt loop
function promptInput() {
  rl.question(PROMPT, (input) => {
    processInput(input);
    promptInput();
  });
}

// Proper force exit handlers
process.on('SIGINT', function() {
  console.log('\nForce exiting...');
  socket.disconnect();
  rl.close();
  process.exit(0);
});

process.on('exit', function() {
  socket.disconnect();
  if (rl) rl.close();
});
