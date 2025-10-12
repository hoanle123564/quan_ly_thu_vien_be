const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const add = require('./addCollection');
const connection = async () => {
    try {
        await client.connect();
        console.log("connect successfull");
        const db = client.db('QuanLyMuonSach');
        db = await add(db);
        return db;
    } catch (error) {
        console.log("Error: ", error);
    }
}
module.exports = connection;