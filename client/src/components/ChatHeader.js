import { useCookies } from 'react-cookie'

const ChatHeader = ( {user}) => {

    const [ cookies, setCookie, removeCookie ] = useCookies(['user'])

    const logout = () => {
        removeCookie('UserId', cookies.UserId)
        removeCookie('AuthToken', cookies.AuthToken)
        window.location.reload()
    }
    return (
        <div>
            <div>
                <div>
                    <img src={user.url} alt={"photo of " + user.first_name} style={{width: '50px', height: '50px'}}/>
                </div>
                <h3>{user.first_name}</h3>
            </div>
            <i onClick={logout}>←</i>
        </div>
    )
    }

    export default ChatHeader