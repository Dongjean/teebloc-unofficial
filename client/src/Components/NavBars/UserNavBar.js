import {Link} from 'react-router-dom';

function UserNavBar(props) {
    function Logout() {
        props.Logout()
    }
    return(
        <div>
            <span className='Left'>
                <Link to='/' className='Link'>Home</Link>
                <Link to='/Login' className='Link'>Login</Link>
                <Link to='/SignUp' className='Link'>Sign Up</Link>
            </span>
            <span className='Right'>
                <Link to={'/Account/' + props.LoginData.Email} className='Link'>{props.LoginData.FirstName + ' ' + props.LoginData.LastName}</Link>
                <span className='button' onClick={Logout}>Logout</span>
            </span>
        </div>
    )
}

export default UserNavBar;