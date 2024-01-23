const { MongoClient } = require('mongodb');
const uri = 'mongodb://localhost:27069/';

const getAverageAgeByGender = async () => {
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db('app-data');
      const users = database.collection('users');
  
      const pipeline = [
        {
          $addFields: {
            birthdate: {
              $dateFromString: {
                dateString: {
                  $concat: ["$dob_year", "-", "$dob_month", "-", "$dob_day"]
                }
              }
            }
          }
        },
        {
          $addFields: {
            age: {
              $divide: [
                { $subtract: [new Date(), "$birthdate"] },
                (1000 * 60 * 60 * 24 * 365)
              ]
            }
          }
        },
        {
          $group: {
            _id: "$gender_identity",
            averageAge: { $avg: "$age" }
          }
        }
      ];
  
      const result = await users.aggregate(pipeline).toArray();
      console.log(result);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await client.close();
    }
  };

  const getCountByGender = async () => {
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db('app-data');
      const users = database.collection('users');
  
      const pipeline = [
        {
          $group: {
            _id: "$gender_identity",
            count: { $sum: 1 }
          }
        }
      ];
  
      const result = await users.aggregate(pipeline).toArray();
      console.log(result);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await client.close();
    }
  };

  const getOldestAndYoungestUser = async () => {
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db('app-data');
      const users = database.collection('users');
  
      const pipeline = [
        {
          $addFields: {
            birthdate: {
              $dateFromString: {
                dateString: {
                  $concat: ["$dob_year", "-", "$dob_month", "-", "$dob_day"]
                }
              }
            }
          }
        },
        {
          $addFields: {
            age: {
              $divide: [
                { $subtract: [new Date(), "$birthdate"] },
                (1000 * 60 * 60 * 24 * 365)
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            oldest: { $max: "$age" },
            youngest: { $min: "$age" }
          }
        }
      ];
  
      const result = await users.aggregate(pipeline).toArray();
      console.log(result);
    } catch (error) {
      console.error('An error occurred:', error);
    } finally {
      await client.close();
    }
  };

  const getMostCommonNames = async () => {
    const client = new MongoClient(uri);
  
    try {
      await client.connect();
      const database = client.db('app-data');
      const users = database.collection('users');
  
      const pipeline = [
        {
          $group: {
            _id: "$first_name",
            count: { $sum: 1 }
          }
        },
        {
          $sort: {
            count: -1
          }
        },
        {
          $limit: 5
        }
      ];
  
      const result = await users.aggregate(pipeline).toArray();
      console.log(result);
    } catch (error) {
      console.error('An error occurred:', error);
      return [];
    } finally {
      await client.close();
    }
  };

  
  

module.exports = { getAverageAgeByGender, getCountByGender, getOldestAndYoungestUser, getMostCommonNames };
