//Component imports
import GuestNavBar from './Components/NavBars/GuestNavBar.js';
import UserNavBar from './Components/NavBars/UserNavBar.js';
import CreatorNavBar from './Components/NavBars/CreatorNavBar.js';

//Page imports
import HomePage from './Pages/HomePage.js';
import LoginPage from './Pages/LoginPage.js';
import SignUpPage from './Pages/SignUpPage.js';
import PostPage from './Pages/PostPage.js';

import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import Cookies from './utils/Cookies.js';

function App() {
	const navigate = useNavigate();

	const LoginDataJSON = {
		Email: Cookies.get('LoginEmail'),
		FirstName: Cookies.get('LoginFirstName'),
		LastName: Cookies.get('LoginLastName'),
		AccType: Cookies.get('LoginType')
	}

	const NullLoginDataJSON = {
		Email: undefined,
		FirstName: undefined,
		LastName: undefined,
		AccType: undefined
	}

	const [LoginData, setLoginData] = useState(LoginDataJSON)

	function Login(LoginDataJSON) {
		setLoginData(LoginDataJSON)
		navigate('/')
	}

	function Logout() {
		//remove login info from cookies
		Cookies.remove('LoginEmail')
		Cookies.remove('LoginFirstName')
		Cookies.remove('LoginLastName')
		Cookies.remove('LoginType')

		//set the LoginData state to the new empty login info cookies
		setLoginData({
			Email: Cookies.get('LoginEmail'),
			FirstName: Cookies.get('LoginFirstName'),
			LastName: Cookies.get('LoginLastName'),
			AccType: Cookies.get('LoginType')
		})
		navigate('/')
	}

	return (
    	<div>
			{LoginData.Email ? null : <GuestNavBar /> /* NavBar for Guests who arent logged in */}
			{LoginData.AccType == 'User' ? <UserNavBar Logout={Logout} /> : null /* NavBar for Users who can only churn questions */}
			{LoginData.AccType == 'Creator' ? <CreatorNavBar Logout={Logout} /> : null /* NavBar for Creators who can post questions */}
        	<Routes>
				<Route path='/' exact element={<HomePage />}/>
				<Route path='/Login' exact element={<LoginPage Login={Login} />} />
				<Route path='/SignUp' exact element={<SignUpPage />} />
				<Route path='/Post' exact element={<PostPage />} />
			</Routes>
    	</div>
  	);
}

export default App;
