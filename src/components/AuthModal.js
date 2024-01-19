import React, { useState } from 'react'

const AuthModal = ({ setShowModal, isSignUp }) => {
    const [ email, setEmail ] = useState(null)
    const [ password, setPassword] = useState(null)
    const [ confirmPassword, setConfirmPassword] = useState(null)
    const [error, setError] = useState(null)

    console.log(email, password, confirmPassword)

    const handleClick = () => {
        setShowModal(false)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        try {
            if( isSignUp && (password !== confirmPassword)) {
                setError('Passwords do not match')
            }
            console.log('post do bazy danych')
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <div onClick={handleClick}>X</div>
            <h2>{isSignUp ? 'Create account' : 'Log in'}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="email"
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                 />
                 <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="password"
                    required={true}
                    onChange={(e) => setPassword(e.target.value)}
                 />
                {isSignUp && <input
                    type="password-check"
                    id="password-check"
                    name="password-check"
                    placeholder="password-check"
                    required={true}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                 />}

                 <input type="submit"/>
                 <p>{error}</p>
                
                

            </form>

        </div>
    )
}

export default AuthModal