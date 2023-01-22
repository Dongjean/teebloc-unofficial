//Component imports
import GuestNavBar from './Components/NavBars/GuestNavBar.js';
import UserNavBar from './Components/NavBars/UserNavBar.js';
import CreatorNavBar from './Components/NavBars/CreatorNavBar.js';

//Page imports
import HomePage from './Pages/HomePage.js';
import LoginPage from './Pages/LoginPage.js';
import SignUpPage from './Pages/SignUpPage.js';
import PostPage from './Pages/PostPage.js';
import AccountDetailsPage from './Pages/AccountDetailsPage.js';
import OpenedQuestionPage from './Pages/OpenedQuestionPage.js';
import SavedQuestionsPage from './Pages/SavedQuestionsPage.js';

import {Routes, Route, useNavigate} from 'react-router-dom';
import {useState} from 'react';
import Cookies from './utils/Cookies.js';
import API from './utils/API.js';
import './CSS/index.css';

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

	function OpenQuestion(QuestionID) {
		navigate('/OpenedQuestion?QuestionID=' + QuestionID)
	}

	function OpenSaved(Email) {
		navigate('/Account/' + Email + '/Saved')
	}

	return (
    	<div>
			<div className='NavBar'>
				{LoginData.Email ? null : <GuestNavBar /> /* NavBar for Guests who arent logged in */}
				{LoginData.AccType == 'User' ? <UserNavBar Logout={Logout} /> : null /* NavBar for Users who can only churn questions */}
				{LoginData.AccType == 'Creator' ? <CreatorNavBar LoginData={LoginData} Logout={Logout} /> : null /* NavBar for Creators who can post questions */}
			</div>
        	<Routes>
				<Route path='/' exact element={<HomePage OpenQuestion={OpenQuestion} LoginData={LoginData} />}/>
				<Route path='/Login' exact element={<LoginPage Login={Login} />} />
				<Route path='/SignUp' exact element={<SignUpPage />} />
				<Route path='/Post' exact element={<PostPage UserEmail={LoginData.Email} />} />

				<Route path='/Account/:Email' exact element={<AccountDetailsPage LoginData={LoginData} OpenSaved={OpenSaved} />} />
				<Route path='/Account/:Email/Saved' exact element={<SavedQuestionsPage LoginData={LoginData} OpenQuestion={OpenQuestion} />} />

				<Route path='/OpenedQuestion' exact element={<OpenedQuestionPage />} />
			</Routes>
    	</div>
  	);
}

export default App;
