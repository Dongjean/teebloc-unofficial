import {Link} from 'react-router-dom';

function GuestNavBar() {
    return(
        <div>
            <Link to='/'>Home</Link>
            <Link to='/Login' >Login</Link>
            <Link to='/SignUp'>Sign Up</Link>
        </div>
    )
}

export default GuestNavBar;