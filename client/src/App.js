//Component imports
import GuestNavBar from './Components/NavBars/GuestNavBar.js';
import UserNavBar from './Components/NavBars/UserNavBar.js';
import CreatorNavBar from './Components/NavBars/CreatorNavBar.js';
import AdminNavBar from './Components/NavBars/AdminNavBar.js';

//Page imports
import HomePage from './Pages/HomePage.js';
import LoginPage from './Pages/LoginPage.js';
import SignUpPage from './Pages/SignUpPage.js';
import PostQuestionPage from './Pages/PostQuestionPage.js';
import PostCategoryPage from './Pages/PostCategoryPage.js';
import AccountDetailsPage from './Pages/AccountDetailsPage.js';
import OpenedQuestionPage from './Pages/OpenedQuestionPage.js';
import SavedQuestionsPage from './Pages/SavedQuestionsPage.js';
import MyQuestionsPage from './Pages/MyQuestionsPage.js';
import CompletedQuestionsPage from './Pages/CompletedQuestionsPage.js';
import EditCategoryPage from './Pages/EditCategoryPage.js';
import ReportsPage from './Pages/ReportsPage.js';
import PayCreatorsPage from './Pages/PayCreatorsPage.js';
import EditQuestionPage from './Pages/EditQuestionPage.js';
import DeactivatedQuestionsPage from './Pages/DeactivatedQuestionsPage.js';
import VerifyEmailPage from './Pages/VerifyEmailPage.js';

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

	function OpenPosts(Email) {
		navigate('/Account/' + Email + '/Posts')
	}

	function OpenCompleted(Email) {
		navigate('/Account/' + Email + '/Completed')
	}

	function PostCategory() {
		navigate('/Post/Category')
	}

	function EditCategory() {
		navigate('/Admin/Category/Edit')
	}

	function OpenReports() {
		navigate('/Admin/Reports')
	}

	function OpenDeactivatedQuestions() {
		navigate('/Admin/Questions/Deactivated')
	}

	function OpenPayCreators() {
		navigate('/Admin/PayCreators')
	}

	return (
    	<div>
			<div className='NavBar'>
				{LoginData.Email ? null : <GuestNavBar /> /* NavBar for Guests who arent logged in */}
				{LoginData.AccType == 'User' ? <UserNavBar LoginData={LoginData} Logout={Logout} /> : null /* NavBar for Users who can only churn questions */}
				{LoginData.AccType == 'Creator' ? <CreatorNavBar LoginData={LoginData} Logout={Logout} /> : null /* NavBar for Creators who can post questions */}
				{LoginData.AccType == 'Admin' ? <AdminNavBar LoginData={LoginData} Logout={Logout} /> : null /* NavBar for Admins */}
			</div>
        	<Routes>
				<Route path='/' exact element={<HomePage OpenQuestion={OpenQuestion} LoginData={LoginData} />}/>
				<Route path='/Login' exact element={<LoginPage Login={Login} />} />
				<Route path='/SignUp' exact element={<SignUpPage />} />
				<Route path='/SignUp/Verify/Email' exact element={<VerifyEmailPage Login={Login} />} />
				<Route path='/Post/Question' exact element={<PostQuestionPage UserEmail={LoginData.Email} />} />
				<Route path='/Post/Category' exact element={<PostCategoryPage />} />

				<Route path='/Admin/Category/Edit' exact element={<EditCategoryPage />} />
				<Route path='/Admin/Reports' exact element={<ReportsPage OpenQuestion={OpenQuestion} />} />
				<Route path='/Admin/Questions/Deactivated' exact element={<DeactivatedQuestionsPage LoginData={LoginData} OpenQuestion={OpenQuestion} />} />
				<Route path='/Admin/PayCreators' exact element={<PayCreatorsPage />} />

				<Route path='/Account/:Email' exact element={<AccountDetailsPage LoginData={LoginData} OpenSaved={OpenSaved} OpenCompleted={OpenCompleted} OpenPosts={OpenPosts} PostCategory={PostCategory} EditCategory={EditCategory} OpenReports={OpenReports} OpenDeactivatedQuestions={OpenDeactivatedQuestions} OpenPayCreators={OpenPayCreators} />} />
				<Route path='/Account/:Email/Saved' exact element={<SavedQuestionsPage LoginData={LoginData} OpenQuestion={OpenQuestion} />} />
				<Route path='/Account/:Email/Posts' exact element={<MyQuestionsPage LoginData={LoginData} OpenQuestion={OpenQuestion} />} />
				<Route path='/Account/:Email/Completed' exact element={<CompletedQuestionsPage LoginData={LoginData} OpenQuestion={OpenQuestion} />} />

				<Route path='/OpenedQuestion' exact element={<OpenedQuestionPage LoginData={LoginData} />} />
				<Route path='/Question/Edit' exact element={<EditQuestionPage LoginData={LoginData} />} />
			</Routes>
    	</div>
  	);
}

export default App;
