const express = require('express')
const app = express()
const bodyParser = require('body-parser')
require('dotenv').config()
const cookieParser = require("cookie-parser")
const session = require("express-session")

const PORT = process.env.PORT || 5000
var cors = require('cors')
const db= require('./config/database')
 
//middlewares
app.use(bodyParser.urlencoded({extended:false})) 
app.use(bodyParser.json()) 
app.use(cors({ origin: true }));
app.use(express.json());
app.use(cookieParser());

app.use(
  session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
      expires: 60 * 60 * 24,
    },
  })
);


//database
try {
    db.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
}
  

//routes

app.get('/', function (req, res) {
    res.send('Hello Worldd')
});

const login = require('./routes/LoginRoute');
const createProduct = require('./routes/CreateProduct');
app.use('/api',login);
app.use('/api/product',createProduct);
 
app.listen(PORT, () => {
    console.log(`server running at ${PORT}`)
})