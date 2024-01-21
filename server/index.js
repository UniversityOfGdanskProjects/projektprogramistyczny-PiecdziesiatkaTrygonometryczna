const port = 8000

const express = require('express');

const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27023/';

const app = express()

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.post('/signup', (req, res) => {
    res.json('Hello World!')
  })
  app.get('/users', async (req, res) => {
    const client = new MongoClient(uri)

    try {
        await client.connect()
        const database = client.db('app-data')
        const users = database.collection('users')

        const returnedUsers = await users.find().toArray()
        res.send(returnedUsers)
    } finally {
        await client.close()
    }
  })

app.listen(port, () => console.log(`Server listening on port ${port}`))

