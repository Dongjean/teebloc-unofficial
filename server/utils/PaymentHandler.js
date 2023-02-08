const dotenv = require('dotenv');

dotenv.config();

function Pay(PaymentCount) {
    const PayperQN = process.env.PayperQN

    const NetPay = PayperQN * PaymentCount

    console.log(NetPay + 'SGD')
}

module.exports = {Pay}