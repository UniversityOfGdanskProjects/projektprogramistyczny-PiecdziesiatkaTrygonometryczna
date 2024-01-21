import React, { useEffect, useReducer, useState } from 'react';
import { useCookies } from 'react-cookie';
import '../index.css';
import ChatContainer from '../components/ChatContainer';
import axios from 'axios'

const Dashboard = () => {
  const [user, setUser] = useState(null)
  const [genderedUsers, setGenderedUsers] = useState(null)
  const [cookies, setCookie, removeCookie] = useCookies(['user']);
  const [lastDirection, setLastDirection] = useState();
  const [visibleIndex, setVisibleIndex] = useState(0);

  const userId = cookies.UserId


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
    getGenderedUsers()
  }, [user, genderedUsers])

  console.log('genderedUsers', genderedUsers)




  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete);
    setLastDirection(direction);

    setVisibleIndex((prevIndex) => prevIndex + 1);
  };

  const handleSwipeLeft = () => {
    swiped('left', genderedUsers[visibleIndex].name);
  };

  const handleSwipeRight = () => {
    swiped('right', genderedUsers[visibleIndex].name);
  };

  return (
    <>
      {user &&
        <div>
          <ChatContainer user={user} />
          <div>
            <div className="card-container">
              {genderedUsers?.slice(visibleIndex, visibleIndex + 1).map((genderedUser) => (
                <div
                  key={genderedUser.first_name}
                  className="swipe top-card"
                  style={{
                    backgroundImage: `url(${genderedUser.url})`,
                  }}
                  onClick={() => swiped('right', genderedUser.first_name)}
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
              <button onClick={handleSwipeLeft} disabled={visibleIndex === genderedUsers.length}>Swipe Left</button>
              <button onClick={handleSwipeRight} disabled={visibleIndex === genderedUsers.length}>Swipe Right</button>
            </div>
          </div>
        </div>}
    </>
  );
};

export default Dashboard;