import {Link} from 'react-router-dom';

function GuestNavBar() {
    return(
        <div>
            <span className='Left'>
                <Link to='/' className='Link'>Home</Link>
                <Link to='/Login' className='Link'>Login</Link>
                <Link to='/SignUp' className='Link'>Sign Up</Link>
            </span>
        </div>
    )
}

export default GuestNavBar;