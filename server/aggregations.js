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

const getMessageStatistics = async () => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('app-data');
        const messages = database.collection('messages');

        const pipeline = [
            {
                $group: {
                    _id: "$from_userId",
                    sentMessages: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "user_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    user_id: "$_id",
                    first_name: "$userDetails.first_name",
                    sentMessages: 1
                }
            },
            {
                $sort: { sentMessages: -1 }
            },
            {
                $limit: 10
            }
        ];

        const result = await messages.aggregate(pipeline).toArray();
        console.log(result);
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
};

const getGenderMessageStatistics = async () => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('app-data');
        const messages = database.collection('messages');
        const users = database.collection('users');

        const pipeline = [
            {
                $lookup: {
                    from: "users",
                    localField: "from_userId",
                    foreignField: "user_id",
                    as: "fromUserDetails"
                }
            },
            {
                $unwind: "$fromUserDetails"
            },
            {
                $group: {
                    _id: "$fromUserDetails.gender_identity",
                    sentMessages: { $sum: 1 }
                }
            }
        ];

        const result = await messages.aggregate(pipeline).toArray();
        console.log(result)
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
};

const getAverageAgeOfMatchedUsers = async () => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const pipeline = [
            {
                $match: {
                    matches: { $exists: true, $ne: [] }
                }
            },
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
                    averageAge: { $avg: "$age" }
                }
            }
        ];

        const result = await users.aggregate(pipeline).toArray();
        console.log(result)
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
};

const getMostCommonWordsInAboutSection = async () => {
    const client = new MongoClient(uri);

    try {
        await client.connect();
        const database = client.db('app-data');
        const users = database.collection('users');

        const pipeline = [
            {
                $project: {
                    _id: 0,
                    about: 1
                }
            },
            {
                $unwind: "$about"
            },
            {
                $project: {
                    words: { $split: ["$about", " "] }
                }
            },
            {
                $unwind: "$words"
            },
            {
                $group: {
                    _id: "$words",
                    count: { $sum: 1 }
                }
            },
            {
                $sort: {
                    count: -1
                }
            },
            {
                $limit: 20
            }
        ];

        const result = await users.aggregate(pipeline).toArray();
        console.log(result)
    } catch (error) {
        console.error('An error occurred:', error);
        return [];
    } finally {
        await client.close();
    }
};







module.exports = {
    getAverageAgeByGender, getCountByGender, getOldestAndYoungestUser, getMostCommonNames, getMessageStatistics,
    getGenderMessageStatistics, getAverageAgeOfMatchedUsers, getMostCommonWordsInAboutSection
};
