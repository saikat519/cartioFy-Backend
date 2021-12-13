const express = require('express');
const router = express.Router();
const User = require('../models/User')
const session = require("express-session")
const cookieParser = require("cookie-parser")
require('dotenv').config();
const { uuid } = require('uuidv4');


router.use(cookieParser());

router.post('/register', async (req, res) => {
    let username = req.body.name;
    let email = req.body.email;
    if (!username || !email) {
        res.status(400).send('username or email not provided.')
        throw new Error('username or email not provided.');
        
    }
    const existingUser = await User.findOne({where: { email: email } });
    if (existingUser) {
            res.status(400).send('user already exists')
            throw new Error('User exists already.');
        }

  const user = new User({
        user_id: uuid(),
        email:email,
        user_name: username,
    });

  
    user.save()
      .then((result) => {
        return res.status(201).send("user data saved")
      })
      .catch(err => {
            console.log("the error>>>>",err)
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
    const email = req.body.email;
    const password = req.body.password;
     try{
         const user = await User.findOne({ where: { email: email } })
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