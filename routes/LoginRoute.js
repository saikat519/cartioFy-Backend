const express = require('express');
const router = express.Router();
const User = require('../models/User')
const session = require("express-session")
const cookieParser = require("cookie-parser")
const jwt=require('jsonwebtoken')
require('dotenv').config();
const { uuid } = require('uuidv4');
const bcrypt = require("bcrypt");
const saltRounds = 10;

router.use(cookieParser());

router.post('/register', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    console.log("username",username)
    console.log("password",password)
    if (!username || !password) {
        res.status(400).send('username or password not provided.')
        throw new Error('username or password not provided.');
        
    }
    const existingUser = await User.findOne({where: { user_name: username } });
    if (existingUser) {
            res.status(400).send('user already exists')
            throw new Error('User exists already.');
        }
 
        // generate salt to hash password
    const salt = await bcrypt.genSalt(10);
    // now we set user password to hashed password
    let hashedPassword = await bcrypt.hash(password, salt);
  const user = new User({
        user_id:uuid(),
        user_name: username,
        password: hashedPassword
    });
    const token = jwt.sign(
        { user_id: user.user_id },
        process.env.TOKEN_KEY || 'somesupersecretkey',
        {
          expiresIn: "5h",
        }
      );
      // save user token
  user.token = token;
  
    user.save()
      .then((result) => {
        return res.status(201).send({ token: token, tokenExpiration: 5 })
      })
      .catch(err => {
            return res.status(400).send("Error occured during saving user data")
        })
 
    
});


router.get("/login", (req, res) => {
    const token = req.body.token || req.params.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  try {
    const decoded = jwt.verify(token, process.env.TOKEN_KEY || "somesupersecretkey");
      req.user = decoded;
      return res.status(200).send(decoded);
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
});
  
router.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;
     try{
         const user = await User.findOne({ where: { user_name: username } })
         if (user && (await bcrypt.compare(password, user.password))) {
             const token = jwt.sign(
                 { user_id: user.user_id },
                 process.env.TOKEN_KEY || 'somesupersecretkey',
                 {
                     expiresIn: "5h",
                 }
             );
             // save user token
           user.token = token;
           User.update({ token: token }, { where: { user_id: user.user_id } })
             .then(re => {
               console.log('token updated', re)
               return res.status(200).send({ token: token, tokenExpiration: 5 });
             }).catch(err => {
               console.log(err);
               return res.status(400).send("token not updated in db")
             })
          //console.log('>token>>',token)
          
          
         }
         
     } catch (err) {
          console.log(err);
          return res.status(400).send("Invalid Credentials");
        }
        
     
  });


module.exports = router;