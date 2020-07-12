//Same result as the first line of app.js, but here is more simple using destructuring.
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

function circulationRepo() {

    function loadData(data) {

        const client = new MongoClient(url);

        return new Promise(async (resolve, reject) => {

            try {
                await client.connect();
                const db = client.db(dbName);
                results = await db.collection('newspapers').insertMany(data);                
                resolve(results);                
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }

        });

        
    }

    function get() {
        return new Promise(async (resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);
                const items = await db.collection('newspapers').find().toArray();
                resolve(items);
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }

        });
    }

    return { loadData, get }

}

module.exports = circulationRepo();