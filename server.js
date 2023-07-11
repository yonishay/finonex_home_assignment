const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const db = require('./db');
const {getByUserId, createTable}= require('./db');
const dp = require('./data_processor');

const PORT = 8000;
const app = express();

createTable();
app.use(bodyParser.json());

const authenticate = (req, res, next) => {
  const authorization = req.headers['authorization'];
  if (authorization && authorization === 'secret') {
    next();
  } else {
    res.sendStatus(401);
    console.log('Unauthorized user');
  }
};

app.post('/liveEvent', authenticate, async (req, res, next) => {
  const event = req.body;
  await fs.appendFile('events.txt', JSON.stringify(event) + '\n', (err) => {
    if (err) {
      console.error('Error saving event:', err);
      res.sendStatus(500);
    } else {
      res.sendStatus(200);
    }
  });
});

app.get('/userEvents/:userId', authenticate, async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const data = await getByUserId(userId);
    
    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }
    return res.json(data);
    
  } catch (error) {
    console.error('Error retrieving data:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});