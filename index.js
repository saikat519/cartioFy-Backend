const express = require('express')
const app = express()
require('dotenv').config()

const PORT = process.env.PORT || 8000

var cors = require('cors')
 
app.use(cors());

app.get('/', function (req, res) {
  res.send('Hello World')
})
 
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})