const fs = require('fs');
const axios = require('axios');
const serverUrl = 'http://localhost:8000/';
const liveEventApi = 'liveEvent';

function sendEvents() {
  try {
    const events = fs.readFileSync('events.jsonl', 'utf8').split('\n');
    events.forEach(async (event) => {
      if (event.trim() !== '') {
        const eventData = JSON.parse(event);
        const { userId, name, value } = eventData;

        const config = {
          headers: {
            Authorization: 'secret',
            'Content-Type': 'application/json'
          },
        };

        await axios.post(`${serverUrl}${liveEventApi}`, eventData, config);
        console.log('Event has sent:', eventData);
      }
    });
  } catch (error) {
    console.error('Error in sending events:', error);
  }
}

sendEvents();
