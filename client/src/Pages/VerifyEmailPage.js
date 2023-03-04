import {useState, useRef} from 'react';
import API from "../utils/API";
import Cookies from '../utils/Cookies.js';

function VerifyEmailPage(props) {
    const OTPRef = useRef('')
    const [isVerified, setisVerified] = useState(true)

    async function Verify(event) {
        event.preventDefault()

        try {
            const result = await API.get('/SignUp/Verify?OTP=' + OTPRef.current)
            if (result.data.isVerified) {
                CreateAccount(result.data.firstname, result.data.lastname, result.data.email, result.data.password, 'User')
                
                Cookies.set('LoginEmail', result.data.email)
                Cookies.set('LoginFirstName', result.data.firstname)
                Cookies.set('LoginLastName', result.data.lastname)
                Cookies.set('LoginType', 'User')
                props.Login()
            } else if (!result.data.isVerified) {
                setisVerified(false)
            }
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

    return (
        <div>
            <form onSubmit={Verify}>
                An One-Time Password (OTP) has been sent to your email, please check it and input it below to verify your Email<br />
                OTP: <input type='text' onChange={event => OTPRef.current = event.target.value} /><br />
                <input type='submit' />
                {isVerified ?
                    null
                :
                    <span>
                        <br />
                        The OTP inputed is incorrect.
                    </span>
                }
            </form>
        </div>
    )
}

export default VerifyEmailPage;