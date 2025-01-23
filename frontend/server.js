const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'build')));

// Add info endpoint
app.get('/pod-info', (req, res) => {
  res.json({
    pod: process.env.HOSTNAME || 'unknown',
    server: req.socket.localAddress || 'unknown'
  });
});

// Handle React routing, return all requests to React app
app.get('/*', function(req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Serving static files from: ${path.join(__dirname, 'build')}`);
}); 