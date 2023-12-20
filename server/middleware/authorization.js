const jwt = require('jsonwebtoken');
require('dotenv').config(); // .env configuration
const User = require('../models/users');
// fix from here 
const jwtMiddleware = async (req , res , next) =>{
    const currentUrl = req.url;
    if (currentUrl === '/api/login') {
        return next();
    }
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if(token == null){
        return res.status(401).send('No token available');
    } 
    jwt.verify(token,process.env.ACCESS_TOKEN , async (err,user)=>{
        if(err){
        return res.sendStatus(403).send('Expired Token , Please Sign in again!');
        }
        if((user.username != 'Shaked') && 
        (currentUrl === '/api/register' || currentUrl ==='/api/getUsers' || currentUrl === '/api/createItem')){
            return res.status(401).send('Not authorized!');
        }
        const userId = await User.findOne({username : user.username})
        res.locals.username = userId.id;
        next()
    })
}

module.exports = jwtMiddleware;