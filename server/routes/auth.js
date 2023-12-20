const express = require('express');
const router = express.Router();
require('dotenv').config(); // .env configuration
const Users = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = (USERS) => {

  router.post('/api/login', async (req, res) => {
      const {username , password} = req.body;
      const DBuser = await Users.findOne({username:username})
      if(DBuser == null) res.status(404).json({ message: "User not found" });
      else
      {
        try {
          if(await bcrypt.compare(password , DBuser.password))
          {
            // creating jwt token.
            const accessToken = jwt.sign({username:username}, process.env.ACCESS_TOKEN , {expiresIn:'24h'}) // seralize the username.
            const foundUser = USERS.find((obj) => obj.userId === username);
            if(foundUser)
            {
              foundUser.currentPD = '';
              foundUser.userCAL = DBuser.id;
            }
            else{
              let user = {userId:DBuser.id , userCAL: DBuser.id , currentPD : null};
              console.log(user);
              console.log(USERS);
              USERS.push(user);
            }
            res.status(200).json({accessToken :accessToken }); // returns the token
          }
          else{
            res.status(404).json({ message: "Wrong username or password" })
          }
        } catch (err) {
          console.log(err)
        }
      }
    });
  
  
  
    router.post('/api/register' , async (req, res) => {
      const {username, password} = req.body;
      try {
        const hashedPassword = await bcrypt.hash(password,10);
        const highestIdUser = await Users.findOne().sort('-id');
        const newId = highestIdUser ? highestIdUser.id + 1 : 1;
        const user = await Users.create({id:newId , username:username , password:hashedPassword});
        console.log("User created");
        res.status(200).json();
      } catch (error) {
        console.log(error)
        res.status(500).json({message:"Somthing went wrong.."});
      }
    });
  
  
    router.get('/api/Authorize' , async (req, res) => {
      const loggedInUser = res.locals.username;
      const foundUser = USERS.find((obj) => obj.userId === loggedInUser);
      if (foundUser)
      {
        const admin = foundUser.userId === 1? true : false;
        const userCalendar = await Users.findOne({id:foundUser.userCAL});
        res.status(200).json({admin:admin , user:userCalendar.username});
      }
      else{
        res.sendStatus(401);
      }
    });
    return router;
};
