# Project README
## Setup
Remember to have Node.js installed on your system and the necessary dependencies installed by running npm install before running any of the commands above.
please install local postgres and configure the folowing in db.js:
```shell

const config = {
    user: <your username>,
    database: <name of your database>,
    password: <password>,
    port: 5432,
};
```
## Running the Server
To start the server, run the following command:
```shell
npm run start_server
```
## Running the Client
To run the client, use the following command:
```shell
npm run start_client
```

## Running the Data Processor Script
To run the data processor script, follow these steps:

1. Open a command-line interface.
2. Navigate to the directory where the data_processor.js script is located.
3. Execute the following command:

```shell
node data_processor.js <file fullpath>
```
Replace <file fullpath> with the full path to the file you want to process. Make sure to provide the appropriate file extension (e.g., .txt, .json).
