import {useState} from 'react';
import API from '../utils/API.js';

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
                    await API.get('/Login/GetLoginInfo/' + Email) //get the LoginInfo as cookies with the JWT
                    
                    props.Login()
                } else { //if PW is wrong,  
                    setValid(false)
                }
            }
        } catch(err) {
            console.log(err)
        }
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