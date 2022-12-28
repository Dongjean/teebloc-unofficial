import {Link} from 'react-router-dom';
import Cookies from '../../utils/Cookies.js';

function UserNavBar(props) {
    function Logout() {
        props.Logout()
    }
    return(
        <div>
            <Link to='/'>Home</Link>
            <Link to='/Login' >Login</Link>
            <Link to='/SignUp'>Sign Up</Link>
            {Cookies.get('LoginFirstName') + ' ' + Cookies.get('LoginLastName')}
            <button onClick={Logout}>Logout</button>
        </div>
    )
}

export default UserNavBar;