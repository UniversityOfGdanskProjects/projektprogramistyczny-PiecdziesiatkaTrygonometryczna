import { useState } from 'react'
import AuthModal from '../components/AuthModal'
import Nav from '../components/Nav'

const Home = () => {

    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)

    const authToken = false

    const handleClick = () => {
        console.log('clicked')
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div>
        <Nav minimal={false}
        setShowModal={ setShowModal}
        showModal={showModal}
        setIsSignUp={setIsSignUp}/>
        <div>
            <h1>Tinder</h1>
            <button onClick={handleClick}>
                {authToken ? 'Signout' : 'Create Account'}
            </button>


            {showModal && (
                <AuthModal setShowModal={setShowModal} setIsSignUp={setIsSignUp} isSignUp={isSignUp}/>
            )}

        </div>
        </div> 
    )
}

export default Home