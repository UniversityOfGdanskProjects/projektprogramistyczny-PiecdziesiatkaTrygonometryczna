const port = 8000
const express = require('express');
const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27023/';
const app = express()
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const bcrypt = require('bcrypt')

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.post('/signup', async (req, res) => {
  const client = new MongoClient(uri)
  const { email, password } = req.body


  const generatedUserId = uuidv4()

  const hashedPassword = await bcrypt.hash(password, 10)
  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const existingUser = await users.findOne({ email })

    if (existingUser) {
      res.status(409).send('User already exists')
      return
    }

    const sanitizedEmail = email.toLowerCase()

    const data = {
      user_id: generatedUserId,
      email: sanitizedEmail,
      hased_password: hashedPassword,
    }
    const insertedUser = await users.insertOne(data)

    const token = jwt.sign(insertedUser, sanitizedEmail, {
      expiresIn: 60 * 24,
    })

    res.status(201).json({ token, userId: generatedUserId, email: sanitizedEmail })


  } catch (err) {
    console.log(err)
  }
}
)

app.post('/login', async (req,res) => {
const client = new MongoClient(uri)
const { email, password } = req.body

try {
  await client.connect()
  const database = client.db('app-data')
  const users = database.collection('users')

  const user = await users.findOne({ email })

  const correctPassword = await bcrypt.compare(password, user.hased_password)
  if (user && correctPassword) {
    const token = jwt.sign(user, email, {
      expiresIn: 60 * 24,
    })
    res.status(201).json({ token, userId: user.user_id, email})
}
res.status(400).send('Invalid credentials')
} catch (err) {
  console.log(err)
}


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

