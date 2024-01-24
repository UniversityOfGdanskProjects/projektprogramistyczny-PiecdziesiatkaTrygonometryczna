const express = require('express');
const { MongoClient } = require('mongodb');
const { ObjectId } = require('mongodb');
const app = express();
const port = 8000;

const uri = 'mongodb://localhost:27069/';
const client = new MongoClient(uri);
    
app.use(express.json());

app.get('/api/search-users', async (req, res) => {
    const searchCriteria = req.query;

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const searchResults = await users.find({
            $and: [
                { $or: [{ first_name: new RegExp(searchCriteria.keyword, 'i') }, { about: new RegExp(searchCriteria.keyword, 'i') }] },
                { gender_identity: searchCriteria.gender },
                { dob_day: searchCriteria.dob_day },
                { dob_month: searchCriteria.dob_month },
                { dob_year: searchCriteria.dob_year },
            ],
        }).toArray();

        res.json(searchResults);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    } finally {
        await client.close();
    }
});

// funckaj wyszukujaca potencjalnych kandydatow

app.get('/api/search-matching-users/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const user = await users.findOne({ user_id: userId });

        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const matchingUsers = await users.find({
            $and: [
                { gender_identity: user.gender_interest },
            ],
        }).toArray();

        const matchingUserIds = matchingUsers.map(matchingUser => matchingUser.user_id);
        res.json(matchingUserIds);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    } finally {
        await client.close();
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});