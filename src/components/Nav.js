
const Nav = ({ minimal, setShowModal, showModal, setIsSignUp }) => {

    const handleClick = () => {
        setShowModal(true)
        setIsSignUp(false)
    }

const authToken = false

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