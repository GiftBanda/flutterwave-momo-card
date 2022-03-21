const Flutterwave = require('flutterwave-node-v3');
const open = require('open');

const flw = new Flutterwave(process.env.PUBLIC_KEY, process.env.SECRET_KEY);

//mobile money payment controller ZM
const mobilePayment = async (req, res) => {
    try {

        // const payload = {
        //     "tx_ref": "MC-15852113s09v5050e8",
        //     "amount": "1500",
        //     "currency": "ZMW",
        //     "email": "olufemi@flw.com",
        //     "phone_number": "054709929220",
        //     "fullname": "Olufemi Obafunmiso",
        //     "order_id": "URF_MMGH_1585323540079_5981535" //Unique identifier for the mobilemoney transaction to be provided by the merchant
        // }

       const payload = req.body
       const response =  await flw.MobileMoney.zambia(payload)
       res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }    
}

const cardPayment = async (req, res) => {
    const payload = {
        "card_number": "5531886652142950",
        "cvv": "564",
        "expiry_month": "09",
        "expiry_year": "21",
        "currency": "NGN",
        "amount": "100",
        "redirect_url": "https://www.bongohive.co.zm",
        "fullname": "Olufemi Obafunmiso",
        "email": "olufemi@flw.com",
        "phone_number": "0902620185",
        "enckey": process.env.ENCRYPTION_KEY || "611d0eda25a3c931863d92c4",
        "tx_ref": "MC-32444ee--4eerye4euee3rerds4423e43e" // This is a unique reference, unique to the particular transaction being carried out. It is generated when it is not provided by the merchant for every transaction.
    
    }
    try {
        const response = await flw.Charge.card(payload)
        console.log(response)
        if (response.meta.authorization.mode === 'pin') {
            let payload2 = payload
            payload2.authorization = {
                "mode": "pin",
                "fields": [
                    "pin"
                ],
                "pin": 3310
            }
            const reCallCharge = await flw.Charge.card(payload2)

            const callValidate = await flw.Charge.validate({
                "otp": "12345",
                "flw_ref": reCallCharge.data.flw_ref
            })
            console.log(callValidate)

        }
        if (response.meta.authorization.mode === 'redirect') {

            var url = response.meta.authorization.redirect
            open(url)
        }

        res.status(200).json(response)

        // console.log(response)


    } catch (error) {
        console.log(error)
    }
} 

module.exports = { mobilePayment, cardPayment }