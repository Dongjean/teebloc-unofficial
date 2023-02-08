import {useState, useEffect} from 'react';
import API from '../utils/API';

function PayCreatorsPage() {
    const [AllPendingPayments, setAllPendingPayments] = useState([])

    useEffect(() => {
        GetAllPendingPayments()
    }, [])

    async function GetAllPendingPayments() {
        try {
            const result = await API.get('/Questions/Get/Payments/Pending/All')

            setAllPendingPayments(result.data)
        } catch(err) {
            console.log(err)
        }
    }

    async function PayCreator(Email) {
        try {
            await API.post('/Questions/Payments/Pay/' + Email)

            //reload the page after payment
            window.location.reload(true)
        } catch(err) {
            console.log(err)
        }
    }

    return (
        <div>
            {AllPendingPayments.map(PendingPayment => 
                <div key={PendingPayment.email}>
                    Creator Email: {PendingPayment.email} <br />
                    Number of Pending Payments: {PendingPayment.paymentcount} <br />
                    <button onClick={() => PayCreator(PendingPayment.email)}>Pay</button>
                    <br /> <br />
                </div>
            )}
        </div>
    )
}

export default PayCreatorsPage;