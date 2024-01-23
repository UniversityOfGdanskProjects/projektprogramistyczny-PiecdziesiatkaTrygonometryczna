import React, { useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';
import '../index.css';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios'
import ProfileUpdateForm from '../components/ProfileUpdateForm';

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [genderedUsers, setGenderedUsers] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [lastDirection, setLastDirection] = useState();
  const [visibleIndex, setVisibleIndex] = useState(0);
  const [editMode, setEditMode] = useState(false);

  const userId = cookies.UserId

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleFormSubmit = () => {
    setEditMode(false);
  };

  const getUser = async () => {
    try {
      const response = await axios.get('http://localhost:8000/user', {

        params: { userId }
      })
      setUser(response.data)
    } catch (error) {
      console.error(error)
    }
  }

  const getGenderedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8000/gendered-users', {
        params: { gender: user?.gender_interest }
      })

      setGenderedUsers(response.data)
    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {
    getUser()

}, [])

useEffect(() => {
    if (user) {
        getGenderedUsers()
    }
}, [user])


const updatedMatches = async (matchedUserId) => {
  try {
    await axios.put('http://localhost:8000/addmatch', {
      userId,
      matchedUserId
    })
    getUser()
  } catch (error) {
    console.error(error)
  }
}

  const swiped = (direction, swipedUserId) => {

    if (direction === 'right') {
    updatedMatches(swipedUserId)
    }
    setLastDirection(direction);

    setVisibleIndex((prevIndex) => prevIndex + 1);
  };

  const handleSwipeLeft = () => {
    swiped('left', genderedUsers[visibleIndex].user_id);
  };

  const handleSwipeRight = () => {
    swiped('right', genderedUsers[visibleIndex].user_id);
  };


  const matchedUserIds = user?.matches?.map(({ user_id}) => user_id).concat(userId)

const filteredGenderedUsers = genderedUsers?.filter(
  genderedUser => !matchedUserIds.includes(genderedUsers.user_id)

)

const handleDeleteAccount = async () => {
  try {
    await axios.delete(`http://localhost:8000/delete-account?userId=${userId}`);
    window.location.href = '/'; 
  } catch (error) {
    console.error(error);
  }
};


  return (
    <>
      {user &&
        <div>
          <div className='editprofileform'>
          <button onClick={handleDeleteAccount}>Delete Account</button>
          <button onClick={handleEditClick}>Edytuj profil</button>
          {editMode && (
            <ProfileUpdateForm
              userId={userId}
              user={user}
              onFormSubmit={handleFormSubmit}
            />
          )}
          </div>
          <ChatContainer user={user} />
          <div>
            <div className="card-container">
              {filteredGenderedUsers?.slice(visibleIndex, visibleIndex + 1).map((genderedUser) => (
                <div
                  key={genderedUser.user_id}
                  className="swipe top-card"
                  style={{
                    backgroundImage: `url(${genderedUser.url})`,
                  }}
                  onClick={() => swiped('right', genderedUser.user_id)}
                >
                  <div className="card">
                    <h3>{genderedUser.first_name}</h3>
                  </div>
                </div>
              ))}
            </div>
            <div className="swipe-info">
              {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
            </div>
            <div className="buttons">
            <button onClick={handleSwipeLeft} disabled={visibleIndex === genderedUsers?.length}>Swipe Left</button>
            <button onClick={handleSwipeRight} disabled={visibleIndex === genderedUsers?.length}>Swipe Right</button>
            </div>
          </div>
        </div>}
    </>
  );
};

export default Dashboard;