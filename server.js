// Local dev server — mirrors the Vercel serverless routes
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const createHandler = require('./api/create');
const rHandler = require('./api/r');

app.post('/api/create', createHandler);
app.get('/api/r', rHandler);

app.get('/{*path}', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dev server running at http://localhost:${PORT}`);
});
