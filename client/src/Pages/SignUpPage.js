import {useState} from 'react';
import {useNavigate} from 'react-router-dom';

//import the API
import API from '../utils/API.js';

function SignUpPage() {
    const navigate = useNavigate();

    const [isPWValid, setPWValidity] = useState(true); //initially dont display the error message
    const [isEmailValid, setEmailValidity] = useState(true); //initially dont display the error message

    const [FirstName, setFirstName] = useState('');
    const [LastName, setLastName] = useState('');
    const [Email, setEmail] = useState('');
    const [NewPW, setNewPW] = useState('');
    const [RepeatPW, setRepeatPW] = useState('');

    const [AccType, setAccType] = useState('User'); //all accounts created by default are User accounts.
    //Account Types include:
    //User(only able to read posts and post things that belong to them)
    //Admin(has full access to be able to edit all posts and receives reports)

    async function Submit(event) {
        event.preventDefault();

        var isPWValid;
        var isEmailValid;

        isPWValid = await GetPWValidity(NewPW, RepeatPW)
        if (isPWValid) {
            isEmailValid = await GetEmailValidity(Email)
        }
        
        if (isEmailValid) {
            const WasEmailSent = await Send_OTP(Email, NewPW, FirstName, LastName)
            console.log(WasEmailSent)
            if (WasEmailSent) {
                navigate('/SignUp/Verify/Email')
            } else {
                isEmailValid = false
            }
        }

        setPWValidity(isPWValid)
        setEmailValidity(isEmailValid)
    }

    function GetPWValidity(NewPW, RepeatPW) {
        if (NewPW !== RepeatPW) { //if PWs inputted is not the same
            setNewPW('')
            setRepeatPW('')
            return false //PW is invalid
        } else {
            return true //PW is valid
        }
    }

    async function GetEmailValidity(Email) {
        //call the API to check if Email already exists
        try {
            const response = await API.get('/SignUp/CheckEmail/' + Email)
            //response.data is whether or not the Email exists in the DB

            if (response.data) {
                return false //email is invalid if it already exists in the DB
            } else {
                return true //email is valid if it doenst yet exist in the DB
            }
        } catch(err) {
            console.log(err)
        }
    }

    async function Send_OTP(Email, NewPW, FirstName, LastName) {
        try {
            const response = await API.post('/SignUp/Send_OTP', {
                Email: Email,
                NewPW: NewPW,
                FirstName: FirstName,
                LastName: LastName
            })

            return response.data
        } catch(err) {

        }
    }

    return(
        <div>
            <form onSubmit={Submit}>
                First Name: <input type='text' required value={FirstName} onChange={(event) => {setFirstName(event.target.value)}} />
                Last Name: <input type='text' required value={LastName} onChange={(event) => {setLastName(event.target.value)}} /> <br />
                Email: <input type='text' required value={Email} onChange={(event) => {setEmail(event.target.value)}} /> <br />
                {isEmailValid ? null : <div>The Email is invalid.<br /></div>}
                New Password: <input type='text' required value={NewPW} onChange={(event) => {setNewPW(event.target.value)}} /> <br />
                Repeat Password: <input type='text' required value={RepeatPW} onChange={(event) => {setRepeatPW(event.target.value)}} /> <br />
                {isPWValid ? null : <div>The Passwords didnt match. Please try again.<br /></div> } {/* Error msg for PW */}
                <input type='submit' />
            </form>
        </div>
    )
}

export default SignUpPage;