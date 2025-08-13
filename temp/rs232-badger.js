const WebSocket = require("ws");
const SerialPort = require("serialport");
const readline = require("readline");
const EventEmitter = require("events");

const wss = new WebSocket.Server({
  port: 8000,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getCurrentTimestamp = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

const logSeparator = () => {
  console.log("----------------------------------------------------");
};

// Initialize EventEmitter
const emitter = new EventEmitter();

// RS232 Badge Reader Configuration
const Rs232vendorId = "0403"; // FTDI vendor ID from arduino.js
let Rs232SerialPort;
let Rs232Port;
let receivedData = "";
let badgeUID = "";

// Find and initialize RS232 port
SerialPort.list()
  .then((ports) => {
    console.log(
      `[${getCurrentTimestamp()}] AVAILABLE SERIAL PORTS:`,
      ports.map((item) => item.path)
    );
    Rs232Port = ports.find((port) => port.vendorId === Rs232vendorId);

    if (Rs232Port) {
      console.log(
        `[${getCurrentTimestamp()}] SELECTED RS232 SERIAL PORT: ${Rs232Port.path}`
      );
      // Initialize RS232 port after a short delay
      setTimeout(() => {
        initRs232SerialPort(Rs232Port.path);
      }, 2000);
    } else {
      console.error(`[${getCurrentTimestamp()}] RS232 SERIAL PORT NOT FOUND.`);
      console.log(`[${getCurrentTimestamp()}] Available vendor IDs:`, ports.map(p => p.vendorId));
    }
  })
  .catch((error) => {
    console.error(`[${getCurrentTimestamp()}] ERROR LISTING SERIAL PORTS:`, error);
  });

function initRs232SerialPort(portPath) {
  console.log(`[${getCurrentTimestamp()}] INIT RS232 PORT => ${portPath}`);

  Rs232SerialPort = new SerialPort(portPath, {
    baudRate: 9600,
    autoOpen: false,
  });

  Rs232SerialPort.open((err) => {
    if (err) {
      console.error(`[${getCurrentTimestamp()}] Error opening RS232 port:`, err);
      return;
    }
    console.log(`[${getCurrentTimestamp()}] RS232 port opened successfully, waiting for badges...`);
  });

  Rs232SerialPort.on("data", function (data) {
    receivedData += data.toString();

    // Check if we have a complete message (ends with \r\n and has minimum length)
    if (receivedData.endsWith("\r\n") && receivedData.length >= 12) {
      const message = receivedData.trim();
      // Extract badge ID (remove first 2 characters as per arduino.js logic)
      badgeUID = message.substring(2).toUpperCase();

      logSeparator();
      console.log(`[${getCurrentTimestamp()}] Badge ID: ${badgeUID}`);

      // Emit badge event
      emitter.emit("send_badge_id");

      // Reset buffer
      receivedData = "";
    }
  });

  Rs232SerialPort.on("error", (err) => {
    console.error(`[${getCurrentTimestamp()}] RS232 port error:`, err);
  });

  Rs232SerialPort.on("close", () => {
    console.log(`[${getCurrentTimestamp()}] RS232 port closed`);
  });
}

// WebSocket Script (same as nfc-badger.js)
wss.on("connection", function connection(ws) {
  console.log(`[${getCurrentTimestamp()}] Client connected.`);

  const sendBadgeId = () => {
    const messageSent = {
      action: "badge_in",
      data: badgeUID,
    };
    ws.send(JSON.stringify(messageSent));
    console.log(`[${getCurrentTimestamp()}] Sent badge message:`, messageSent);
  };

  emitter.on("send_badge_id", sendBadgeId);

  ws.on("close", () => {
    console.log(`[${getCurrentTimestamp()}] Client disconnected.`);
    emitter.off("send_badge_id", sendBadgeId);
  });
});

// Readline Script for testing (same as nfc-badger.js)
rl.on("line", (input) => {
  if (input.toLowerCase() === "test") {
    badgeUID = "123456";
    logSeparator();
    console.log(`[${getCurrentTimestamp()}] [TEST BADGE] Badge ID: ${badgeUID}`);
    emitter.emit("send_badge_id");
  }
});

console.log(`[${getCurrentTimestamp()}] RS232 Badge Server started on port 8000`);
console.log(`[${getCurrentTimestamp()}] Type 'test' to simulate a badge scan`);