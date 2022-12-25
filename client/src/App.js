//Component imports
import GuestNavBar from './Components/GuestNavBar.js';

//Page imports
import HomePage from './Pages/HomePage.js';
import LoginPage from './Pages/LoginPage.js';
import SignUpPage from './Pages/SignUpPage.js';

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

	const [LoginData, setLoginData] = useState(LoginDataJSON)

	function Login(LoginDataJSON) {
		setLoginData(LoginDataJSON)
		navigate('/')
	}
	console.log(LoginData)
	return (
    	<div>
        	<GuestNavBar /> {/* NavBar for Guests who arent logged in */}
			
        	<Routes>
				<Route path='/' exact element={<HomePage />}/>
				<Route path='/Login' exact element={<LoginPage Login={Login} />} />
				<Route path='/SignUp' exact element={<SignUpPage />} />
			</Routes>
    	</div>
  	);
}

export default App;
