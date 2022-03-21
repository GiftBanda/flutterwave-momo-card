const express = require('express')
const route = express.Router()
const { mobilePayment, cardPayment } = require('../controllers/payController')

//mobile money pay route ZM
route.post('/momo', mobilePayment)
route.post('/card', cardPayment)

module.exports = route