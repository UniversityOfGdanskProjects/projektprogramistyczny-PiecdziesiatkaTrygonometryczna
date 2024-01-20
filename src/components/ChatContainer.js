import ChatHeader from "./ChatHeader"
import MatchesDisplay from "./MatchesDisplay"
import ChatDisplay from "./ChatDisplay"

const ChatContainer = () => {
    return <div>
        <ChatHeader/>

        <div>
            <button>Matches</button>
            <button>Chat</button>
        </div>

        <MatchesDisplay/>

        <ChatDisplay/>
    </div>
}

export default ChatContainer
