import { useState } from 'react'

const ChatInput = () => {
    const [textArea , setTextArea] = useState(null)
    return (
        <div>
            <textarea value={textArea} onChange={(e) => setTextArea(e.target.value)}/>
            <button>Submit</button>
        </div>
    )
}

export default ChatInput