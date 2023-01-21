function AccountDetailsPage(props) {
    return (
        <div>
            Name: {props.LoginData.FirstName + ' ' + props.LoginData.LastName} <br />
            Email: {props.LoginData.Email} <br />
            Account Type: {props.LoginData.AccType} <br />

            <button>Saved</button> <br />
            <button>Completed</button> <br />
            {/* for cretor accounts, have posts section */}
            {props.LoginData.AccType == 'Creator' ?
                <button>Posts</button>
            :
                null
            }
        </div>
    )
}

export default AccountDetailsPage;