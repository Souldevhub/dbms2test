import { MongoClient } from 'mongodb';

const mongoURI = 'mongodb://localhost:27017'; // Change this if needed
const dbName = 'test'; // Change this to match your DB
const client = new MongoClient(mongoURI);

const logonUsers = new Map(); // Keeps track of logged-in users

const connectDB = async () => {
    try {
        console.log("connectDB: Attempting to connect to MongoDB..."); // Debugging step
        if (!client.topology || !client.topology.isConnected()) {
            await client.connect();
        }
        console.log("connectDB: Successfully connected to MongoDB!"); // Debugging step
        return client.db(dbName);
    } catch (error) {
        console.error("connectDB: MongoDB connection failed!", error);
        throw error;
    }
};


// Executes a generic MongoDB query
const sendQuery = async (operation) => {
    try {
        console.log("sendQuery: Connecting to DB...");  // Debugging step
        const db = await connectDB();
        console.log("sendQuery: Connected to DB!"); // Debugging step

        const result = await operation(db);
        console.log("sendQuery: Query executed successfully!", result); // Debugging step

        return result;
    } catch (err) {
        console.error("sendQuery: MongoDB Query Error:", err);
        throw err;
    }
};


// Find a single user by username
const findOneUser = async (username) =>
    sendQuery(db => db.collection('users').findOne({ username }));

// Get all users
const getAllUsers = async () =>
    sendQuery(db => db.collection('users').find().toArray());


// Add a new user
const addOneUser = async (username, password) =>
    sendQuery(db => db.collection('users').insertOne({ username, password }));

// Get all data
const getAllData = async () =>
    sendQuery(db => db.collection('data').find().toArray());

// Get specific data by ID
const getDataById = async (id) =>
    sendQuery(db => db.collection('data').findOne({ id: Number(id) }));  // Convert to number

// Add new data
const getNextSequence = async (sequenceName) => {
    return sendQuery(async (db) => {
        const result = await db.collection("counters").findOneAndUpdate(
            { _id: sequenceName },
            { $inc: { sequence_value: 1 } },
            { returnDocument: "after", upsert: true }
        );

        // If result.value is null, manually fetch the updated counter
        if (!result.value) {
            const counter = await db.collection("counters").findOne({ _id: sequenceName });
            return counter ? counter.sequence_value : 1; // Default to 1 if something is wrong
        }

        return result.value.sequence_value;
    });
};




const addData = async ({ Firstname, Surname, userid }) => {
    const newId = await getNextSequence("data_id"); // Get next sequential ID
    return sendQuery(db => db.collection('data').insertOne({
        id: newId,
        Firstname,
        Surname,
        userid
    }));
};

/*
// Uncomment if needed
const deleteData = async (id, userid) =>
    sendQuery(db => db.collection('data').deleteOne({ id, userid }));
*/

// Close connection when exiting
const closeDB = async () => {
    await client.close();
};

export const insert_multiple_rows = async (num_rows) => {
    const data = [];
    for (let i = 0; i < num_rows; i++) {
        data.push({
            username: `user${i}`,
            password: `password${i}`
        });
    }

    return sendQuery(db => db.collection('data').insertMany(data));
};




export {
    addOneUser,
    getAllUsers,
    findOneUser,
    getAllData,
    getDataById,
    addData,
    logonUsers,
    closeDB
};
