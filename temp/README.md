# RS232 Badge Server

This server replaces the NFC-PCSC badge reader with an RS232 serial communication badge reader while maintaining the same WebSocket interface for your Mini Golf Event Hub.

## Files Overview

- **`nfc-badger.js`** - Original NFC-PCSC based badge server (working production version)
- **`arduino.js`** - Source file containing RS232 serial communication logic
- **`rs232-badger.js`** - New RS232 badge server (extracted and integrated logic)

## Key Changes Made

### Extracted from arduino.js:
- RS232 serial port detection logic (vendor ID: `0403`)
- Serial port initialization with 9600 baud rate
- Data reception and parsing logic
- Badge ID extraction (removes first 2 characters from received message)

### Maintained from nfc-badger.js:
- WebSocket server on port 8000
- Event emitter pattern for badge events
- Same message format: `{"action": "badge_in", "data": "BADGE_UID"}`
- Test command functionality (type "test" to simulate badge scan)
- Timestamp logging and formatting

## Installation

1. Install dependencies:
```bash
npm install
```

2. Connect your RS232 badge reader to your machine

3. Run the server:
```bash
npm start
# or
node rs232-badger.js
```

## Usage

### Starting the Server
```bash
node rs232-badger.js
```

The server will:
1. List all available serial ports
2. Automatically detect RS232 device (vendor ID: 0403)
3. Initialize the serial connection
4. Start WebSocket server on port 8000
5. Wait for badge scans

### Testing
Type `test` in the console to simulate a badge scan with ID "123456".

### Expected Output
```
[2024-01-15 10:30:45] AVAILABLE SERIAL PORTS: ['/dev/ttyUSB0', '/dev/ttyUSB1']
[2024-01-15 10:30:45] SELECTED RS232 SERIAL PORT: /dev/ttyUSB0
[2024-01-15 10:30:47] INIT RS232 PORT => /dev/ttyUSB0
[2024-01-15 10:30:47] RS232 port opened successfully, waiting for badges...
[2024-01-15 10:30:47] RS232 Badge Server started on port 8000
[2024-01-15 10:30:47] Type 'test' to simulate a badge scan
[2024-01-15 10:30:50] Client connected.
----------------------------------------------------
[2024-01-15 10:30:55] Badge ID: A1B2C3D4
[2024-01-15 10:30:55] Sent badge message: {"action":"badge_in","data":"A1B2C3D4"}
```

## Configuration

### RS232 Settings
- **Baud Rate**: 9600
- **Vendor ID**: 0403 (FTDI)
- **Data Format**: Messages ending with `\r\n` and minimum 12 characters
- **Badge ID Extraction**: Removes first 2 characters from received message

### WebSocket Settings
- **Port**: 8000
- **Message Format**: `{"action": "badge_in", "data": "BADGE_UID"}`

## Troubleshooting

### RS232 Port Not Found
If you see "RS232 SERIAL PORT NOT FOUND", check:
1. Badge reader is connected
2. Correct drivers are installed
3. Check available vendor IDs in the console output
4. Update `Rs232vendorId` in the code if needed

### Permission Issues (Linux/Mac)
```bash
sudo chmod 666 /dev/ttyUSB0
# or add user to dialout group
sudo usermod -a -G dialout $USER
```

### Different Vendor ID
If your RS232 device has a different vendor ID:
1. Check the console output for available vendor IDs
2. Update the `Rs232vendorId` variable in `rs232-badger.js`

## Integration with Mini Golf Event Hub

This server is designed to work seamlessly with your existing Mini Golf Event Hub frontend. The WebSocket message format remains identical to the NFC version:

```javascript
{
  "action": "badge_in",
  "data": "BADGE_UID_HERE"
}
```

Your frontend badge WebSocket client will automatically receive these messages and navigate to the team-info page as expected.
