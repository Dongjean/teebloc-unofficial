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
import API from './utils/API.js';

function App() {
	const navigate = useNavigate();

	const LoginDataJSON = {
		Email: Cookies.get('LoginEmail'),
		FirstName: Cookies.get('LoginFirstName'),
		LastName: Cookies.get('LoginLastName'),
		AccType: Cookies.get('LoginType')
	}

	const [LoginData, setLoginData] = useState(LoginDataJSON)

	function Login() {
		const LoginDataJSON = {
			Email: Cookies.get('LoginEmail'),
			FirstName: Cookies.get('LoginFirstName'),
			LastName: Cookies.get('LoginLastName'),
			AccType: Cookies.get('LoginType')
		}
		setLoginData(LoginDataJSON)
		navigate('/')
	}

	async function Logout() {
		//remove login info from cookies
		await API.get('/Login/Logout')

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
			{console.log(LoginData.Email)}
			{LoginData.Email ? null : <GuestNavBar /> /* NavBar for Guests who arent logged in */}
			{LoginData.AccType == 'User' ? <UserNavBar Logout={Logout} /> : null /* NavBar for Users who can only churn questions */}
			{LoginData.AccType == 'Creator' ? <CreatorNavBar Logout={Logout} /> : null /* NavBar for Creators who can post questions */}
        	<Routes>
				<Route path='/' exact element={<HomePage />}/>
				<Route path='/Login' exact element={<LoginPage Login={Login} />} />
				<Route path='/SignUp' exact element={<SignUpPage />} />
				<Route path='/Post' exact element={<PostPage UserEmail={LoginData.Email} />} />
			</Routes>
    	</div>
  	);
}

export default App;
