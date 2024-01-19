
const Nav = ({ minimal, authToken, setShowModal, showModal, setIsSignUp }) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

    return (
        <nav>
            {!authToken && !minimal && <button
            onClick={handleClick}
                disabled={showModal}>
                Log in</button>}
        </nav>
    )
}

export default Nav