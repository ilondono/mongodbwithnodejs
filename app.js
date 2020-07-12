const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {

    const client = new MongoClient(url);
    await client.connect();

    try {
        const results = await circulationRepo.loadData(data);
        //console.log(results.insertedCount, results.ops);

        // get functionality (all results, no query specified):
        const getData = await circulationRepo.get();
        assert.equal(data.length, getData.length, 'Amount of documents returned are different than expected');

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