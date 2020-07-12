//Same result as the first line of app.js, but here is more simple using destructuring.
const { MongoClient, ObjectID } = require('mongodb');

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

    function get(query, skipped, maxResults) {
        return new Promise(async (resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);
                let items = await db.collection('newspapers').find(query);

                // THESE ARE EXAMPLES OF ANOTHER FUNCTIONS THAT CAN BE USED:
                    // collection.find({}).project({ a: 1 })                             // Create a projection of field a
                    // collection.find({}).skip(1).limit(10)                          // Skip 1 and limit 10
                    // collection.find({}).batchSize(5)                               // Set batchSize on cursor to 5
                    // collection.find({}).filter({ a: 1 })                              // Set query on the cursor
                    // collection.find({}).comment('add a comment')                   // Add a comment to the query, allowing to correlate queries
                    // collection.find({}).addCursorFlag('tailable', true)            // Set cursor as tailable
                    // collection.find({}).addCursorFlag('oplogReplay', true)         // Set cursor as oplogReplay
                    // collection.find({}).addCursorFlag('noCursorTimeout', true)     // Set cursor as noCursorTimeout
                    // collection.find({}).addCursorFlag('awaitData', true)           // Set cursor as awaitData
                    // collection.find({}).addCursorFlag('exhaust', true)             // Set cursor as exhaust
                    // collection.find({}).addCursorFlag('partial', true)             // Set cursor as partial
                    // collection.find({}).addQueryModifier('$orderby', { a: 1 })        // Set $orderby {a:1}
                    // collection.find({}).max(10)                                    // Set the cursor max
                    // collection.find({}).maxTimeMS(1000)                            // Set the cursor maxTimeMS
                    // collection.find({}).min(100)                                   // Set the cursor min
                    // collection.find({}).returnKey(10)                              // Set the cursor returnKey
                    // collection.find({}).setReadPreference(ReadPreference.PRIMARY)  // Set the cursor readPreference
                    // collection.find({}).showRecordId(true)                         // Set the cursor showRecordId
                    // collection.find({}).sort([['a', 1]])                           // Sets the sort order of the cursor query
                    // collection.find({}).hint('a_1')                                // Set the cursor hint

                if (maxResults > 0) {
                    items = items.skip(skipped).limit(maxResults);
                }

                resolve(await items.toArray());
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }

        });
    }

    function getById(id) {
        return new Promise(async (resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);
                // The id received as a parameter is a String, but MongoDB requires a ObjectID.
                const item = await db.collection('newspapers').findOne({_id: ObjectID(id)});
                resolve(item);
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }

        });
    }

    function add(item) {
        return new Promise(async(resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);
                const addedItem = await db.collection('newspapers').insertOne(item);                
                resolve(addedItem.ops[0]);
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }
        });
    }

    function update(id, newItem) {
        return new Promise(async(resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);
                const updatedItem = await db.collection('newspapers')
                            .findOneAndReplace({_id: ObjectID(id)}, newItem, {returnOriginal: false});
                resolve(updatedItem.value);
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }
        });
    }

    function remove(id) {
        return new Promise(async(resolve, reject) => {

            const client = new MongoClient(url);

            try {
                await client.connect();
                const db = client.db(dbName);
                const removedItem = await db.collection('newspapers').deleteOne({_id: ObjectID(id)});
                resolve(removedItem.deletedCount === 1);
            } catch (error) {
                reject(error);
            } finally {
                client.close();
            }
        });
    }

    return { loadData, get, getById, add, update, remove }

}

module.exports = circulationRepo();