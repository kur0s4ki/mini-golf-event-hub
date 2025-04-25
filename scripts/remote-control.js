#!/usr/bin/env node
const WebSocket = require('ws');
const readline = require('readline');

// Create WebSocket connection to the server
const ws = new WebSocket('ws://localhost:8080');

// Create interface for reading user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Player info for start command
const defaultPlayer = {
  displayName: "Remote Player",
  team: { name: "Remote Team" }
};

// Handle connection open
ws.on('open', () => {
  console.log('Connected to the game server!');
  showCommands();
  promptUser();
});

// Handle messages from the server
ws.on('message', (data) => {
  try {
    const message = JSON.parse(data);
    console.log(`\nServer: ${message.type === 'info' ? message.message : JSON.stringify(message)}`);
    promptUser();
  } catch (error) {
    console.error('Error parsing message:', error);
  }
});

// Handle connection close
ws.on('close', () => {
  console.log('Disconnected from the server');
  process.exit(0);
});

// Handle connection error
ws.on('error', (error) => {
  console.error(`WebSocket error: ${error.message}`);
  process.exit(1);
});

// Function to show available commands
function showCommands() {
  console.log('\n--- GAME REMOTE CONTROL ---');
  console.log('Available commands:');
  console.log('  start        - Start a new game');
  console.log('  win [points] - Win the game (optional: specify points)');
  console.log('  loss [points] - Lose the game (optional: specify points)');
  console.log('  bonus        - Add a bonus of 500 points');
  console.log('  timeup       - End the game due to time up');
  console.log('  reset        - Reset the game');
  console.log('  help         - Show this help message');
  console.log('  exit         - Exit the program');
  console.log('---------------------------');
}

// Function to prompt the user for input
function promptUser() {
  rl.question('> ', (input) => {
    handleCommand(input.trim());
  });
}

// Track bonus points (similar to keyboard simulator)
let bonusPoints = 0;

// Function to handle user input
function handleCommand(input) {
  const [command, ...args] = input.split(' ');

  switch (command.toLowerCase()) {
    case 'start':
      const playerName = args[0] || defaultPlayer.displayName;
      const teamName = args[1] || defaultPlayer.team.name;
      
      sendMessage({
        action: 'start',
        playerDisplayName: playerName,
        teamName: teamName,
        timer: 20
      });
      
      console.log(`Game started for ${playerName} (${teamName})`);
      break;
      
    case 'win':
      const winBase = 500;
      const winBonus = args[0] ? parseInt(args[0]) : Math.floor(Math.random() * 200);
      const winScore = winBase + winBonus + bonusPoints;
      
      sendMessage({
        action: 'win',
        points: winScore
      });
      
      console.log(`Win triggered with ${winScore} points (base + bonus + accumulated)`);
      bonusPoints = 0; // Reset bonus after win
      break;
      
    case 'loss':
      const lossBase = 200;
      const lossBonus = args[0] ? parseInt(args[0]) : Math.floor(Math.random() * 100);
      const lossScore = lossBase + lossBonus + bonusPoints;
      
      sendMessage({
        action: 'loss',
        points: lossScore
      });
      
      console.log(`Loss triggered with ${lossScore} points (base + bonus + accumulated)`);
      bonusPoints = 0; // Reset bonus after loss
      break;
      
    case 'bonus':
      bonusPoints += 500;
      
      // For bonus, we need to trigger the UI action in the client
      // This is a special custom message that our app needs to handle
      sendMessage({
        action: 'custom',
        command: 'bonus'
      });
      
      console.log(`Bonus added! Total bonus: ${bonusPoints}`);
      break;
      
    case 'timeup':
      const timeupScore = args[0] ? parseInt(args[0]) : 100 + bonusPoints;
      
      sendMessage({
        action: 'timeUp',
        points: timeupScore
      });
      
      console.log(`Time's up triggered with ${timeupScore} points`);
      bonusPoints = 0; // Reset bonus after time's up
      break;
      
    case 'reset':
      sendMessage({
        action: 'reset'
      });
      
      bonusPoints = 0; // Reset bonus
      console.log('Game reset');
      break;
      
    case 'help':
      showCommands();
      break;
      
    case 'exit':
      console.log('Exiting...');
      ws.close();
      rl.close();
      process.exit(0);
      return;
      
    default:
      console.log(`Unknown command: ${command}`);
      console.log('Type "help" to see available commands');
  }
  
  promptUser();
}

// Function to send a message to the server
function sendMessage(message) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(message));
  } else {
    console.error('WebSocket is not connected');
  }
}

// Handle program exit
process.on('SIGINT', () => {
  console.log('\nExiting...');
  ws.close();
  rl.close();
  process.exit(0);
}); 