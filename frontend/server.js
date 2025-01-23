const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'build')));

// Add info endpoint
app.get('/pod-info', (req, res) => {
  res.json({
    pod: process.env.HOSTNAME || 'unknown',
    server: req.socket.localAddress || 'unknown'
  });
});

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 