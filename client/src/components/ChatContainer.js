import ChatHeader from './ChatHeader'
import MatchesDisplay from './MatchesDisplay'
import ChatDisplay from './ChatDisplay'
import { useState } from 'react'

const ChatContainer = ({ user }) => {
    const [ clickedUser, setClickedUser ] = useState(null)

    return (
        <div >
            <ChatHeader user={user}/>

            <div>
                <button onClick={() => setClickedUser(null)}>Matches</button>
                <button disabled={!clickedUser}>Chat</button>
            </div>

            {!clickedUser && <MatchesDisplay matches={user.matches} setClickedUser={setClickedUser}/>}

            {clickedUser && <ChatDisplay user={user} clickedUser={clickedUser}/>}
        </div>
    )
}

export default ChatContainer