import React, { useState } from 'react';
import axios from 'axios';

const ProfileUpdateForm = ({ userId, user, onLoadDataFromFile  }) => {
    const [formData, setFormData] = useState({
        first_name: user.first_name || '',
        dob_day: user.dob_day || '',
        dob_month: user.dob_month || '',
        dob_year: user.dob_year || '',
        show_gender: user.show_gender || 'false',
        gender_identity: user.gender_identity || 'man',
        gender_interest: user.gender_interest || 'woman',
        url: user.url || '',
        about: user.about || '',
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put('http://localhost:8000/update-profile', {
                userId,
                updatedData: formData,
            });

            console.log(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const loadUserDataFromFile = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = (readerEvent) => {
            const userDataFromFile = JSON.parse(readerEvent.target.result);
            setFormData(userDataFromFile.user);
            if (onLoadDataFromFile && typeof onLoadDataFromFile === 'function') {
                onLoadDataFromFile(userDataFromFile.user);
            }
        };
        reader.readAsText(file);
    };

    return (
        <form onSubmit={handleFormSubmit}>
            <label htmlFor="first_name">First name:</label>
            <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleInputChange}
            />

            <label>Date of Birth:</label>
            <div>
                <input
                    type="number"
                    id="dob_day"
                    name="dob_day"
                    placeholder="DD"
                    value={formData.dob_day}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    id="dob_month"
                    name="dob_month"
                    placeholder="MM"
                    value={formData.dob_month}
                    onChange={handleInputChange}
                />
                <input
                    type="number"
                    id="dob_year"
                    name="dob_year"
                    placeholder="YYYY"
                    value={formData.dob_year}
                    onChange={handleInputChange}
                />
            </div>

            <label>Show Gender:</label>
            <input
                type="checkbox"
                id="show_gender"
                name="show_gender"
                checked={formData.show_gender === 'true'}
                onChange={handleInputChange}
            />

            <label>Gender Identity:</label>
            <select
                id="gender_identity"
                name="gender_identity"
                value={formData.gender_identity}
                onChange={handleInputChange}
            >
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="other">Other</option>
            </select>

            <label>Gender Interest:</label>
            <select
                id="gender_interest"
                name="gender_interest"
                value={formData.gender_interest}
                onChange={handleInputChange}
            >
                <option value="man">Man</option>
                <option value="woman">Woman</option>
                <option value="everyone">Everyone</option>
            </select>

            <label htmlFor="url">URL:</label>
            <input
                type="url"
                id="url"
                name="url"
                value={formData.url}
                onChange={handleInputChange}
            />

            <label htmlFor="about">About:</label>
            <textarea
                id="about"
                name="about"
                value={formData.about}
                onChange={handleInputChange}
            ></textarea>

            <label htmlFor="loadUserData">Load Data from File:</label>
            <input
                type="file"
                id="loadUserData"
                name="loadUserData"
                accept=".json"
                onChange={loadUserDataFromFile}
            />

            <button type="submit">Update Profile</button>
        </form>
    );
};

export default ProfileUpdateForm;
