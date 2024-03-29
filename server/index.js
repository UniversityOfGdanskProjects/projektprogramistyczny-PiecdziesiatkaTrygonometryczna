const port = 8000
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const uri = 'mongodb://localhost:27069/';
const app = express()
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const bcrypt = require('bcrypt')
const aggregations = require('./aggregations');
const validator = require('validator');


const moment = require('moment');

function isValidDate(dateString) {
    return moment(dateString, moment.ISO_8601, true).isValid();
}

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json('Hello World!')
})

app.get('/find', (req, res) => {
  res.sendFile(__dirname + '/client/build/index.html');
});


app.get('/average-age-by-gender', async (req, res) => {
  await aggregations.getAverageAgeByGender();
  res.send('Check the console for the result.');
});

app.get('/count-by-gender', async (req, res) => {
  await aggregations.getCountByGender();
  res.send('Check the console for the result.');
});

app.get('/oldest-and-youngest-user', async (req, res) => {
  await aggregations.getOldestAndYoungestUser();
  res.send('Check the console for the result.');
});

app.get('/most-common-names', async (req, res) => {
  await aggregations.getMostCommonNames();
  res.send('Check the console for the result.');
});

app.get('/message-statistics', async (req, res) => {
  await aggregations.getMessageStatistics();
  res.send('Check the console for the result.');
});

app.get('/gender-message-statistics', async (req, res) => {
  await aggregations.getGenderMessageStatistics();
  res.send('Check the console for the result.');
});

app.get('/average-age-of-matched-users', async (req, res) => {
  await aggregations.getAverageAgeOfMatchedUsers();
  res.send('Check the console for the result.');
});

app.get('/most-common-words-in-about-section', async (req, res) => {
  await aggregations.getMostCommonWordsInAboutSection();
  res.send('Check the console for the result.');
});



app.get('/api/search-users', async (req, res) => {
  const { keyword, gender, dob_day, dob_month, dob_year, about } = req.query;

  if (!keyword && !gender && !dob_day && !dob_month && !dob_year && !about) {
    return res.status(400).json({ error: 'At least one search parameter is required.' });
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const query = {
      first_name: { $regex: keyword || '', $options: 'i' },
      about: { $regex: about || '', $options: 'i' },
      gender_identity: gender && gender !== 'all' ? gender : { $exists: true },
      dob_day: dob_day || { $exists: true },
      dob_month: dob_month || { $exists: true },
      dob_year: dob_year || { $exists: true },
    };

    const foundUsers = await users.find(query).toArray();


    res.json(foundUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'error' });
  } finally {
    await client.close();
  }
});


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
      return;
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

    res.status(201).json({ token, userId: generatedUserId })

  } catch (err) {
    console.log(err)
  }
}
)

app.post('/login', async (req, res) => {
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
      res.status(201).json({ token, userId: user.user_id })
    } else {
      res.status(400).send('Invalid credentials')
    }
  }
  catch (err) {
    console.log(err)


  }
})



app.get('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const userId = req.query.userId

  console.log('userId', userId)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id: userId }
    const user = await users.findOne(query)
    res.send(user)

  } finally {
    await client.close()
  }
})

app.get('/users', async (req, res) => {
  const client = new MongoClient(uri)
  const userIds = JSON.parse(req.query.userIds)

  console.log('userIds', userIds)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const pipeline =
      [
        {
          '$match': {
            'user_id': {
              '$in': userIds
            }
          }
        }
      ]
    const foundUsers = await users.aggregate(pipeline).toArray()
    console.log(foundUsers)
    res.send(foundUsers)
  } finally {
    await client.close()
  }
})


app.get('/users-db', async (req, res) => {
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const foundUsers = await users.find({}).toArray()
    console.log(foundUsers)
    res.send(foundUsers)
  } finally {
    await client.close()
  }
})













app.get('/gendered-users', async (req, res) => {
  const client = new MongoClient(uri)
  const gender = req.query.gender

  console.log('gender', gender)

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')
    const query = { gender_identity: { $eq: gender } }
    const foundUsers = await users.find(query).toArray()


    res.send(foundUsers)
  } catch (error) {
    console.error('An error occurred:', error)
    res.status(500).send('An error occurred while processing your request.')
  } finally {
    await client.close()
  }
})

app.put('/user', async (req, res) => {
  const client = new MongoClient(uri)
  const formData = req.body.formData

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id: formData.user_id }
    const updateDocument = {
      $set: {
        first_name: formData.first_name,
        dob_day: formData.dob_day,
        dob_month: formData.dob_month,
        dob_year: formData.dob_year,
        show_gender: formData.gender,
        gender_identity: formData.gender_identity,
        gender_interest: formData.gender_interest,
        url: formData.url,
        about: formData.about,
        matches: formData.matches
      }
    }
    const insertedUser = await users.updateOne(query, updateDocument)
    res.send(insertedUser)
  } finally {
    await client.close()
  }
})

app.put('/addmatch', async (req, res) => {
  const client = new MongoClient(uri)
  const { userId, matchedUserId } = req.body

  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users')

    const query = { user_id: userId }
    const updateDocument = {
      $push: {
        matches: { user_id: matchedUserId }
      }
    }


    const user = await users.updateOne(query, updateDocument)
    res.send(user)

  } finally {
    await client.close()
  }



})




app.get('/messages', async (req, res) => {
  const { userId, correspondingUserId } = req.query
  const client = new MongoClient(uri)

  try {
    await client.connect()
    const database = client.db('app-data')
    const messages = database.collection('messages')

    const query = {
      from_userId: userId, to_userId: correspondingUserId
    }
    const foundMessages = await messages.find(query).toArray()
    res.send(foundMessages)
  } finally {
    await client.close()
  }
})

app.delete('/delete-account', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.query.userId;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const result = await users.deleteOne({ user_id: userId });

    if (result.deletedCount === 1) {
      res.status(200).send('Account deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});



app.put('/update-profile', async (req, res) => {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const { userId, updatedData } = req.body;

    const query = { user_id: userId };
    const updateDocument = { $set: updatedData };

    const result = await users.updateOne(query, updateDocument);

    if (result.modifiedCount === 1) {
      res.status(200).send('Profile updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});

// nowe


// wiadomosci

//dodanie

app.post('/message', async (req, res) => {
  const client = new MongoClient(uri)
  const message = req.body.message



  try {
    await client.connect()
    const database = client.db('app-data')
    const users = database.collection('users');
    const messages = database.collection('messages');


    const senderId = message.from_userId;
    const sender = await users.findOne({ user_id: senderId });
    if (!sender) {
      return res.status(404).json({ error: 'Sender not found.' });
    }

    const recipientId = message.to_userId;
    const recipient = await users.findOne({ user_id: recipientId });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    if (!sender || !sender.matches.some(match => match.user_id === recipientId)) {
      return res.status(403).json({ error: 'You are not matched with the recipient.' });
    }

    if (!message.message || message.message.length > 500) {
      return res.status(400).json({ error: 'Invalid message. Message must be between 1 and 500 characters.' });
    }

    const timestamp = new Date(message.timestamp);
    if (isNaN(timestamp.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const isValid = isValidDate(message.timestamp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    const currentDate = new Date();
    if (timestamp > currentDate) {
      return res.status(400).json({ error: 'Invalid date. Message date cannot be in the future.' });
    }

    
    const insertedMessage = await messages.insertOne(message);
    res.send(insertedMessage);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});

//usuniecie

app.delete('/message/:messageId', async (req, res) => {
  const client = new MongoClient(uri);
  const messageId = req.params.messageId;

  try {
    await client.connect();
    const database = client.db('app-data');
    const messages = database.collection('messages');

    const result = await messages.deleteOne({ _id: new ObjectId(messageId) });

    if (result.deletedCount === 1) {
      res.status(200).send('Message deleted successfully');
    } else {
      res.status(404).send('Message not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});

// edycja

app.put('/message/:messageId', async (req, res) => {
  const client = new MongoClient(uri);
  const messageId = req.params.messageId;
  const updatedMessage = req.body.updatedMessage;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const messages = database.collection('messages');

    const existingMessage = await messages.findOne({ _id: new ObjectId(messageId) });

    if (!existingMessage) {
      return res.status(404).json({ error: 'Message not found.' });
    }


    const recipientId = existingMessage.to_userId;
    const recipient = await users.findOne({ user_id: recipientId });
    if (!recipient) {
      return res.status(404).json({ error: 'Recipient not found.' });
    }

    if (!sender || !sender.matches.some(match => match.user_id === recipientId)) {
      return res.status(403).json({ error: 'You are not matched with the recipient.' });
    }

    if (!updatedMessage || updatedMessage.length > 500) {
      return res.status(400).json({ error: 'Invalid message. Message must be between 1 and 500 characters.' });
    }

    const timestamp = new Date(updatedMessage.timestamp);
    if (isNaN(timestamp.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const isValid = isValidDate(updatedMessage.timestamp);
    if (!isValid) {
      return res.status(400).json({ error: 'Invalid date.' });
    }

    const currentDate = new Date();
    if (timestamp > currentDate) {
      return res.status(400).json({ error: 'Invalid date. Message date cannot be in the future.' });
    }

    const result = await messages.updateOne(
      { _id: new ObjectId(messageId) },
      {
        $set: {
          timestamp: updatedMessage.timestamp,
          from_userId: updatedMessage.from_userId,
          to_userId: updatedMessage.to_userId,
          message: updatedMessage.message,
        }
      }
    );

    if (result.modifiedCount === 1) {
      res.status(200).send('Message updated successfully');
    } else {
      res.status(404).send('Message not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});


// uzytkownicy

// dodanie

app.post('/users-curl', async (req, res) => {
  const client = new MongoClient(uri);
  const userData = req.body.userData;

  try {
    if (!validator.isEmail(userData.email)) {
      return res.status(400).send('Invalid email format');
    }

    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');
    const generatedUserId = uuidv4();


       const existingUserWithEmail = await users.findOne({ email: userData.email });
       if (existingUserWithEmail) {
         return res.status(400).json({ error: 'Email already exists in the database.' });
       }

    if (!userData.first_name || userData.first_name.length > 20) {
      return res.status(400).send('Invalid "first_name" field. It must not be empty.');
    }

    if (!userData.about || userData.about.length > 500) {
      return res.status(400).send('Invalid "about" field. It must not be empty and should be at most 500 characters.');
    }
    const dobYear = parseInt(userData.dob_year, 10);
    const dobMonth = parseInt(userData.dob_month, 10);
    const dobDay = parseInt(userData.dob_day, 10);

    if (
      isNaN(dobYear) || isNaN(dobMonth) || isNaN(dobDay) ||
      dobMonth < 1 || dobMonth > 12 ||
      dobDay < 1 || dobDay > new Date(dobYear, dobMonth, 0).getDate()
    ) {
      return res.status(400).json({ error: 'Invalid date. Please provide a valid date of birth.' });
    }

    const dobTimestamp = new Date(dobYear, dobMonth - 1, dobDay);

    if (isNaN(dobTimestamp.getTime())) {
      return res.status(400).json({ error: 'Invalid date format.' });
    }

    const currentDate = new Date();
    if (dobTimestamp > currentDate) {
      return res.status(400).json({ error: 'Invalid date. Date of birth cannot be in the future.' });
    }

    if (!['man', 'woman', 'other'].includes(userData.gender_identity)) {
      return res.status(400).json({ error: 'Invalid "gender_identity". It must be "man", "woman", or "other".' });
    }

    if (!['man', 'woman', 'all'].includes(userData.gender_interest)) {
      return res.status(400).json({ error: 'Invalid "gender_interest". It must be "man", "woman", or "all".' });
    }

    const existingUserIds = (await users.find({}, { projection: { user_id: 1 } }).toArray()).map(user => user.user_id);

    for (const match of userData.matches) {
      if (!existingUserIds.includes(match.user_id) || match.user_id === userData.user_id) {
        return res.status(400).json({ error: 'Invalid "matches" field. Each user_id must exist in the database and be different from the current user.' });
      }
    }

    if (userData.show_gender !== 'true' && userData.show_gender !== 'false') {
      return res.status(400).send('Invalid "show_gender" field. It must be either "true" or "false".');
    }

    if (!validator.isURL(userData.url)) {
      return res.status(400).send('Invalid "url" field. It must be a valid URL');
    }
    
    


    userData.user_id = generatedUserId;x``

    const insertedUser = await users.insertOne(userData);
    res.status(201).send('User added successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});

// edycja uzytkownika

app.put('/users/:userId', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;
  const updatedUserData = req.body.updatedUserData;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const existingUser = await users.findOne({ user_id: userId });

    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (!updatedUserData.first_name || updatedUserData.first_name.length > 20) {
      return res.status(400).send('Invalid "first_name" field. It must not be empty and should be at most 20 characters.');
    }

    if (updatedUserData.email && !validator.isEmail(updatedUserData.email)) {
      return res.status(400).send('Invalid email format');
    }

    if (updatedUserData.email && updatedUserData.email !== existingUser.email) {
      const emailExists = await users.findOne({ email: updatedUserData.email });
      if (emailExists) {
        return res.status(400).json({ error: 'Email already exists in the database.' });
      }
    }

    if (updatedUserData.about && (typeof updatedUserData.about !== 'string' || updatedUserData.about.length > 500)) {
      return res.status(400).send('Invalid "about" field. It must be a string and should be at most 500 characters.');
    }

    if (updatedUserData.gender_identity && !['man', 'woman', 'other'].includes(updatedUserData.gender_identity)) {
      return res.status(400).json({ error: 'Invalid "gender_identity". It must be "man", "woman", or "other".' });
    }

    if (updatedUserData.gender_interest && !['man', 'woman', 'all'].includes(updatedUserData.gender_interest)) {
      return res.status(400).json({ error: 'Invalid "gender_interest". It must be "man", "woman", or "all".' });
    }

    if (updatedUserData.url && !validator.isURL(updatedUserData.url)) {
      return res.status(400).send('Invalid "url" field. It must be a valid URL');
    }

    if (updatedUserData.matches) {
      const existingUserIds = (await users.find({}, { projection: { user_id: 1 } }).toArray()).map(user => user.user_id);

      for (const match of updatedUserData.matches) {
        if (!existingUserIds.includes(match.user_id) || match.user_id === userId) {
          return res.status(400).json({ error: 'Invalid "matches" field. Each user_id must exist in the database and be different from the current user.' });
        }
      }
    }

    const result = await users.updateOne(
      { user_id: userId },
      {
        $set: {
          first_name: updatedUserData.first_name,
          email: updatedUserData.email,
          about: updatedUserData.about,
          gender_identity: updatedUserData.gender_identity,
          gender_interest: updatedUserData.gender_interest,
          url: updatedUserData.url,
          matches: updatedUserData.matches,
        }
      }
    );

    if (result.modifiedCount === 1) {
      res.status(200).send('User updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});

app.delete('/users/:userId', async (req, res) => {
  const client = new MongoClient(uri);
  const userId = req.params.userId;

  try {
    await client.connect();
    const database = client.db('app-data');
    const users = database.collection('users');

    const existingUser = await users.findOne({ user_id: userId });
    if (!existingUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const result = await users.deleteOne({ user_id: userId });

    if (result.deletedCount === 1) {
      res.status(200).send('User deleted successfully');
    } else {
      res.status(500).send('An error occurred while deleting the user.');
    }
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing your request.');
  } finally {
    await client.close();
  }
});








app.listen(port, () => console.log(`Server listening on port ${port}`))

