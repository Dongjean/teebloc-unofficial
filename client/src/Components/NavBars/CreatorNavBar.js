import {Link} from 'react-router-dom';
import Cookies from '../../utils/Cookies.js';

function CreatorNavBar(props) {
    function Logout() {
        props.Logout()
    }
    return(
        <div>
            <Link to='/'>Home</Link>
            <Link to='/Login' >Login</Link>
            <Link to='/SignUp'>Sign Up</Link>
            <Link to='/Post'>Post</Link>
            {Cookies.get('LoginFirstName') + ' ' + Cookies.get('LoginLastName')}
            <button onClick={Logout}>Logout</button>
        </div>
    )
}

export default CreatorNavBar;