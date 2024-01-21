import React, { useState } from 'react';
import '../index.css';
import ChatContainer from '../components/ChatContainer';

const Dashboard = () => {
    const characters = [
      {
        name: 'lol lol',
        url: 'https://th.bing.com/th/id/OIG.jDYldViIJQmVHCw5fKSt?pid=ImgGn',
      },
      {
        name: 'lol lol2',
        url: 'https://th.bing.com/th/id/OIG.pS1KxDE1POyFeJVKMOdz?pid=ImgGn',
      },
      {
        name: 'lol lol3',
        url: 'https://th.bing.com/th/id/OIG.jDYldViIJQmVHCw5fKSt?pid=ImgGn',
      },
      {
        name: 'lol lol4',
        url: 'https://th.bing.com/th/id/OIG.Byldx5lCImKX7qR_y1pH?w=1024&h=1024&rs=1&pid=ImgDetMain',
      },
      {
        name: 'lol lol5',
        url: 'https://th.bing.com/th/id/OIG.syPXz33QvOwXE07BQDb4?pid=ImgGn',
      },
    ];
  
    const [lastDirection, setLastDirection] = useState();
    const [visibleIndex, setVisibleIndex] = useState(0);
  
    const swiped = (direction, nameToDelete) => {
      console.log('removing: ' + nameToDelete);
      setLastDirection(direction);
  
      setVisibleIndex((prevIndex) => prevIndex + 1);
    };
  
    const outOfFrame = (name) => {
      console.log(name + ' left the screen!');
    };
  
    const handleSwipeLeft = () => {
      swiped('left', characters[visibleIndex].name);
    };
  
    const handleSwipeRight = () => {
      swiped('right', characters[visibleIndex].name);
    };
  
    return (
      <div>
        <ChatContainer/>
        <div>
          <div className="card-container">
            {characters.slice(visibleIndex, visibleIndex + 1).map((character) => (
              <div
                key={character.name}
                className="swipe top-card"
                style={{
                  backgroundImage: `url(${character.url})`,
                }}
                onClick={() => swiped('right', character.name)}
              >
                <div className="card">
                  <h3>{character.name}</h3>
                </div>
              </div>
            ))}
          </div>
          <div className="swipe-info">
            {lastDirection ? <p>You swiped {lastDirection}</p> : <p />}
          </div>
          <div className="buttons">
            <button onClick={handleSwipeLeft} disabled={visibleIndex === characters.length}>Swipe Left</button>
            <button onClick={handleSwipeRight} disabled={visibleIndex === characters.length}>Swipe Right</button>
          </div>
        </div>
      </div>
    );
  };
  
  export default Dashboard;