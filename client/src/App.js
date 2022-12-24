//Component imports
import GuestNavBar from './Components/GuestNavBar.js';

//Page imports
import HomePage from './Pages/HomePage.js';
import LoginPage from './Pages/LoginPage.js';
import SignUpPage from './Pages/SignUpPage.js';

import {Routes, Route} from 'react-router-dom';

function App() {
	return (
    	<div>
        	<GuestNavBar /> {/* NavBar for Guests who arent logged in */}
			
        	<Routes>
				<Route path='/' exact element={<HomePage />}/>
				<Route path='/Login' exact element={<LoginPage />} />
				<Route path='/SignUp' exact element={<SignUpPage />} />
			</Routes>
    	</div>
  	);
}

export default App;
