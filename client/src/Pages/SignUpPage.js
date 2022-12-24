import {useRef, useState} from 'react';

//import the API
import API from '../utils/API.js';

function SignUpPage() {
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
        isEmailValid = await GetEmailValidity(Email)

        if (isPWValid && isEmailValid) {
            CreateAccount(FirstName, LastName, Email, NewPW, AccType)
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
            const Response = await API.get('/SignUp/CheckEmail/' + Email)
            return Response.data
        } catch(err) {
            console.log(err)
        }
    }

    async function CreateAccount(FirstName, LastName, Email, NewPW, AccType) {
        //call the API for a POST request to add account to Users table
        try {
            const data = {
                FirstName: FirstName,
                LastName: LastName,
                Email: Email,
                NewPW: NewPW,
                Type: AccType
            }
            await API.post('/SignUp/CreateAccount', data)
        } catch(err) {
            console.log(err)
        }
    }

    return(
        <div>
            <form onSubmit={Submit}>
                First Name: <input type='text' required value={FirstName} onChange={(event) => {setFirstName(event.target.value)}} />
                Last Name: <input type='text' required value={LastName} onChange={(event) => {setLastName(event.target.value)}} /> <br />
                Email: <input type='text' required value={Email} onChange={(event) => {setEmail(event.target.value)}} /> <br />
                {isEmailValid ? null : <div>The Email is already Taken. Please use another Email.<br /></div>}
                New Password: <input type='text' required value={NewPW} onChange={(event) => {setNewPW(event.target.value)}} /> <br />
                Repeat Password: <input type='text' required value={RepeatPW} onChange={(event) => {setRepeatPW(event.target.value)}} /> <br />
                {isPWValid ? null : <div>The Passwords didnt match. Please try again.<br /></div> } {/* Error msg for PW */}
                <input type='submit' />
            </form>
        </div>
    )
}

export default SignUpPage;