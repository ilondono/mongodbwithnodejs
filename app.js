const MongoClient = require('mongodb').MongoClient;

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {

    const client = new MongoClient(url);
    await client.connect();

    try {
        const results = await circulationRepo.loadData(data);
        console.log(results.insertedCount, results.ops);
    } catch (error) {
        console.log(error);
    } finally {
        const admin = client.db(dbName).admin();

        // This line is used to clean the database and avoid overpopulating it in each run.
        await client.db(dbName).dropDatabase();
    
        console.log(await admin.listDatabases());
        client.close();
    }    
}

main();