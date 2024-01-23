import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FindUsers = () => {
    const [searchCriteria, setSearchCriteria] = useState({
        keyword: '',
        gender: 'all',
        dob_day: '',
        dob_month: '',
        dob_year: '',
        description: '',
    });
    const [searchResults, setSearchResults] = useState([]);
    const [allUsers, setAllUsers] = useState([]);

    const searchUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/search-users', {
                params: { ...searchCriteria},
            });
            setSearchResults(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getAllUsers = async () => {
        try {
            const response = await axios.get('http://localhost:8000/users-db');
            setAllUsers(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getAllUsers();
    }, []);

    return (
        <div>
            <h2>Search Users</h2>

            <label>Keyword:</label>
            <input
                type="text"
                value={searchCriteria.keyword}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, keyword: e.target.value })}
            />

            <label>Gender:</label>
            <select
                value={searchCriteria.gender}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, gender: e.target.value })}
            >
                <option value="all">All</option>
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="other">Other</option>
            </select>

            <label>Day of Birth:</label>
            <input
                type="text"
                placeholder="Specific Day"
                value={searchCriteria.dob_day}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, dob_day: e.target.value })}
            />
            <label>Month of Birth:</label>
            <input
                type="text"
                placeholder="Specific Month"
                value={searchCriteria.dob_month}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, dob_month: e.target.value })}
            />

            <label>Year of Birth:</label>
            <input
                type="text"
                placeholder="Specific Day"
                value={searchCriteria.dob_year}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, dob_year: e.target.value })}
            />


            <label>About:</label>
            <input
                type="text"
                value={searchCriteria.about}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, about: e.target.value })}
            />


            <button onClick={searchUsers}>Search</button>

            <div>
                <h2>Search Results:</h2>
                <ul>
                    {searchResults.map((user) => (
                        <li key={user._id}>{user.first_name}</li>
                    ))}
                </ul>
            </div>

            <div>
                <h2>All Users:</h2>
                <ul>
                    {allUsers.map((user) => (
                        <li key={user._id}>{user.first_name}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default FindUsers;
