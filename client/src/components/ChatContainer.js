import ChatHeader from "./ChatHeader"
import MatchesDisplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"

const ChatContainer = ({ user }) => {
    return <div>
        <ChatHeader user={user}/>

        <div>
            <button>Matches</button>
            <button>Chat</button>
        </div>

        <MatchesDisplay matches={user.matches}/>

        <ChatDisplay/>
    </div>
}

export default ChatContainer
