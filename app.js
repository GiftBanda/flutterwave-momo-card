
const express = require('express');
require('dotenv').config()


const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({extended: true}))
app.use(express.json())

app.use('/api/v1', require('./routes/payRoute'))

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
