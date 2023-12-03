import { MongoClient } from 'mongodb';

const uri = 'mongodb://localhost:27017'
const client = new MongoClient(uri);

let database;

async function connectToDatabase(){
    try{
        await client.connect();
        console.log('Connected to MongoDB');
        database = client.db('mymamcet');
    }
    catch(err) {
        console.error('Error connecting to MongoDB', err);
    }
}

function getDatabase() {
    return database
}

export {getDatabase, connectToDatabase}