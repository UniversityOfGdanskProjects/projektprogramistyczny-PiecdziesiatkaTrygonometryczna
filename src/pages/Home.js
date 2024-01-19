import { useState } from 'react'
import AuthModal from '../components/AuthModal'
import Nav from '../components/Nav'

const Home = () => {

    const [showModal, setShowModal] = useState(false)

    const authToken = false

    const handleClick = () => {
        console.log('clicked')
        setShowModal(true)
    }

    return (
        <div>
        <Nav minimal={false} authToken={authToken} setShowModal={ setShowModal} showModal={showModal}/>
        <div>
            <h1>Swipe Right</h1>
            <button onClick={handleClick}>
                {authToken ? 'Signout' : 'Create Account'}
            </button>


            {showModal && (
                <AuthModal setShowModal={setShowModal}/>
            )}

        </div>
        </div> 
    )
}

export default Home