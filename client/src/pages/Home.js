import { useState } from 'react'
import AuthModal from '../components/AuthModal'
import Nav from '../components/Nav'
import {useCookies} from 'react-cookie'

const Home = () => {

    const [showModal, setShowModal] = useState(false)
    const [isSignUp, setIsSignUp] = useState(true)
    const [cookies, setCookie, removeCookie] = useCookies(['user']);

    const authToken = cookies.AuthToken

    const handleClick = () => {
        if (authToken) {
            removeCookie('UserId', cookies.UserId)
            removeCookie('AuthToken', cookies.AuthToken)
            window.location.reload()
            return
        }
        setShowModal(true)
        setIsSignUp(true)
    }

    return (
        <div>
        <Nav
        authToken={authToken}
        minimal={false}
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