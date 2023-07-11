const { processBatch } = require('./db');
const fs = require('fs');
const readline = require('readline');
const batchSize = 1000;

// Exclude node and script name from args
const args = process.argv.slice(2); 

const fileName = args[0];

if (args.length < 1) {
  console.error('Please provide the file full path');
  process.exit(1); 
}

async function processEventFile(fileName) {
    try {
        const fileStream = fs.createReadStream(fileName, 'utf-8');
        const rl = readline.createInterface({
            input: fileStream,
            crlfDelay: Infinity,
        });

        let batchData = [];

        for await (const line of rl) {
            try {
                const { userId, name, value } = JSON.parse(line);
                const revenue = name === 'add_revenue' ? value : -value;
                const existingData = batchData.find((data) => data.userId === userId);

                if (existingData) {
                    existingData.revenue += revenue;
                } else {
                    batchData.push({ userId, revenue });
                }

                if (batchData.length >= batchSize) {
                    await processBatch(batchData);
                    batchData = [];
                }
            } catch (error) {
                console.error('Error processing line:', line);
                console.error(error);
                // Handle or log the error as needed
            }
        }

        if (batchData.length > 0) {
            await processBatch(batchData);
        }
    } catch (error) {
        console.error('Error reading file:', fileName);
        console.error(error);
        // Handle or log the error as needed
    }
}

processEventFile(fileName)
    .then(() => {
        console.log('Event file processing completed successfully.');
    })
    .catch((error) => {
        console.error('Error processing event file:', error);
    });

module.exports = processEventFile;