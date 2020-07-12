const MongoClient = require('mongodb').MongoClient;

const assert = require('assert');

const circulationRepo = require('./repos/circulationRepo');
const data = require('./circulation.json');
const { AssertionError } = require('assert');

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

        // get functionality (with query and limit of results):
        const filteredData = await circulationRepo.get({Newspaper: getData[4].Newspaper});
        assert.deepEqual(filteredData[0], getData[4], 'Object searched is not deeply equal to the retrieved.');

            // get with skip and limit functionality
        const skippedAndLimitedData = await circulationRepo.get({}, 6, 3);
        assert.equal(skippedAndLimitedData.length, 3, 'The limit of data is not equals to the result lenght');
            // if we skipped 6 documents, the first element in the result must be Newspaper: 'New York Post'
        assert.equal(skippedAndLimitedData[0].Newspaper, 'New York Post');    
        
        // get a specific record by id.
        const id = getData[13]._id.toString();
        const resultById = await circulationRepo.getById(id);
        assert.deepEqual(resultById, getData[13], 'Object searched is not deeply equal to the retrieved.');

        // add
        const newItem = {
            'Newspaper': 'Daily Planet',
            'Daily Circulation, 2004': 1,
            'Daily Circulation, 2013': 2,
            'Change in Daily Circulation, 2004-2013': 100,
            'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
            'Pulitzer Prize Winners and Finalists, 2004-2014': 0,
            'Pulitzer Prize Winners and Finalists, 1990-2014': 0
        };
        const addedItem = await circulationRepo.add(newItem);
        assert.equal(addedItem.Newspaper, newItem.Newspaper, 'Newspaper attribute of the retrieved document is not equal to the one in the inserted document.');
        const addedItemSearched = await circulationRepo.getById(addedItem._id);
        assert.deepEqual(addedItemSearched, newItem, 'Document retrieved is not equal to the inserted one.');

        // update
        const updatedItem = await circulationRepo.update(addedItem._id, {
            'Newspaper': 'Daily Prophet',
            'Daily Circulation, 2004': 1,
            'Daily Circulation, 2013': 2,
            'Change in Daily Circulation, 2004-2013': 100,
            'Pulitzer Prize Winners and Finalists, 1990-2003': 0,
            'Pulitzer Prize Winners and Finalists, 2004-2014': 0,
            'Pulitzer Prize Winners and Finalists, 1990-2014': 0
        });
        assert.equal(updatedItem.Newspaper, 'Daily Prophet');

        const updatedItemSearched = await circulationRepo.getById(updatedItem._id);
        assert.deepEqual(updatedItemSearched.Newspaper, 'Daily Prophet');

        // remove
        const removed = await circulationRepo.remove(addedItem._id);
        assert(removed);
        const deletedItem = await circulationRepo.getById(addedItem._id);
        assert.equal(deletedItem, null);

        //  ### MONGO DB AGGREGATION PIPELINE ###

        const avg = await circulationRepo.averageFinalists();
        console.log('Average finalists:', avg);



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