import {useState} from 'react';
import API from '../utils/API.js';

import Cookies from '../utils/Cookies.js';

function LoginPage(props) {
    const [Email, setEmail] = useState('');
    const [PW, setPW] = useState('');

    const [isValid, setValid] = useState(true) //Dont display error message at first

    async function Submit(event) {
        event.preventDefault();

        try {
            //GET whether or not entered Email exists in DB
            const response = await API.get('/Login/CheckEmail/' + Email)
            if (!response.data) { //if Email doesnt exist,
                setValid(false)
                return
            } else { //if Email exists,
                //proceed to check if PW is correct
                const response2 = await API.get('/Login/CheckPW/' + Email + '/' + PW)
                if (response2.data) { //if PW is correct, 
                    const response3 = await API.get('/Login/GetLoginInfo/' + Email)
                    const Data = response3.data
                    SetLoginCookies(Data) //save the login details in the cookies

                    const LoginData = {
                        Email: Data.email,
                        FirstName: Data.firstname,
                        LastName: Data.lastname,
                        AccType: Data.type
                    }
                    props.Login(LoginData)
                } else { //if PW is wrong,  
                    setValid(false)
                }
            }
        } catch(err) {
            console.log(err)
        }
    }

    function SetLoginCookies(Data) {
        Cookies.set('LoginEmail', Data.email)
        Cookies.set('LoginFirstName', Data.firstname)
        Cookies.set('LoginLastName', Data.lastname)
        Cookies.set('LoginType', Data.type)
        Cookies.set('JWT', Data.token, {httpOnly: true})
    }

    return(
        <div>
            {isValid ? null : <div>The Email or Password entered is incorrect!</div> /*display error message if invalid*/ }
            <form onSubmit={Submit}>
                Email: <input type='text' required value={Email} onChange={(event) => {setEmail(event.target.value)}} /> <br />
                Password: <input type='text' required value={PW} onChange={(event) => {setPW(event.target.value)}} /> <br />
                <input type='submit' />
            </form>
        </div>
    )
}

export default LoginPage;