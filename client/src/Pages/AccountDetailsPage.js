import {useParams} from 'react-router-dom';
import {useState, useEffect} from 'react';
import API from '../utils/API';

function AccountDetailsPage(props) {
    let {Email} = useParams();
    const [isLoading, setisLoading] = useState(true); //Page is loading initially
    const [UserInfo, setUserInfo] = useState();

    useEffect(() => {
        getUserInfo(Email)
    }, [])

    //get the user's account information
    async function getUserInfo(Email) {
        try {
            const result = await API.get('/Accounts/GetInfo/' + Email)
            setUserInfo(result.data)
            setisLoading(false)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {isLoading ?
                null
            :
                <div>
                    Name: {UserInfo.firstname + ' ' + UserInfo.lastname} <br />
                    Email: {UserInfo.email} <br />
                    Account Type: {UserInfo.type} <br />

                    {/* Only show these if you are the requested user */}
                    {UserInfo.email == props.LoginData.Email ?
                        <div>
                            <button onClick={() => props.OpenSaved(UserInfo.email)}>Saved</button> <br />
                            <button onClick={() => props.OpenCompleted(UserInfo.email)}>Completed</button> <br />
                            {/* for Creator accounts, have posts section */}
                            {props.LoginData.AccType == 'Creator' ?
                                <button onClick={() => props.OpenPosts(UserInfo.email)}>Posts</button>
                            :
                                null
                            }
                        </div>
                    :
                        null
                    }
                </div>
            }
        </div>
    )
}

export default AccountDetailsPage;