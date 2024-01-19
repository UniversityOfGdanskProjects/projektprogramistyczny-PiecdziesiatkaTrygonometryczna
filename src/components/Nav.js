
const Nav = ({ minimal, authToken, setShowModal, showModal }) => {

    const handleClick = () => {
        setShowModal(true)
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