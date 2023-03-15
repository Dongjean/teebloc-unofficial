import {useState, useRef} from 'react';
import API from "../utils/API";
import Cookies from '../utils/Cookies.js';

//Loading GIF import
import LoadingGIF from '../Images/Loading.gif';

function VerifyEmailPage(props) {
    const OTPRef = useRef('')
    const [isVerified, setisVerified] = useState(true)

    const [isLoading, setisLoading] = useState(false)

    const Email = Cookies.get('NewEmail')
    const NewPW = Cookies.get('NewPW')
    const FirstName = Cookies.get('NewFirstName')
    const LastName = Cookies.get('NewLastName')

    async function Verify(event) {
        event.preventDefault()

        try {
            setisLoading(true)
            const result = await API.get('/Accounts/Check/OTP/isCorrect/' + OTPRef.current)
            setisLoading(false)

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
            await API.post('/Accounts/Create/Account', data)
        } catch(err) {
            console.log(err)
        }
    }

    async function Send_New_OTP(Email, NewPW, FirstName, LastName) {
        try {
            setisLoading(true)
            const response = await API.post('/Accounts/Email/Send/OTP', {
                Email: Email,
                NewPW: NewPW,
                FirstName: FirstName,
                LastName: LastName
            })
            setisLoading(false)

            return response.data
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            <form onSubmit={Verify}>
                An One-Time Password (OTP) has been sent to your email, please check it and input it below within 60 seconds to verify your Email<br />
                OTP: <input type='text' onChange={event => OTPRef.current = event.target.value} /><br />
                <input type='submit' /> <br />

                <button type='button' onClick={() => Send_New_OTP(Email, NewPW, FirstName, LastName)}>Resend OTP</button>
                {isVerified ?
                    null
                :
                    <span>
                        <br />
                        The OTP inputed is incorrect.
                    </span>
                }

                <br />

                {/* Loading GIF for when the system is loading when it sends new OTPs or Checks inputted OTPs */}
                {isLoading ?
                    <img src={LoadingGIF} width={20} />
                :
                    null
                }
            </form>
        </div>
    )
}

export default VerifyEmailPage;