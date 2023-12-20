const express = require('express');
const router = express.Router();
const PagesDetail = require('../models/pages_detail');
const CalendarEventsDB = require('../models/calendar_events');
const Users = require('../models/users');



module.exports = (USERS) => {

  router.get('/api/getPosts' , async (req, res) => {
    const loggedInUser = res.locals.username;
    const foundUser = USERS.find((obj) => obj.userId === loggedInUser);
    if(foundUser)
    {
      try {
        const PageDetails = await PagesDetail.find({date: foundUser.currentPD , group:foundUser.userCAL});
        res.json(PageDetails || []);
      } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ message: 'Error retrieving posts' });
      }
    }
    else{
      res.sendStatus(401);
    }
    
  });
  
  router.get('/api/getEvents' ,  async (req, res) => {
    const loggedInUser = res.locals.username;
    const foundUser = USERS.find((obj) => obj.userId === loggedInUser);
    if(foundUser)
    {
      try {
        const events = await CalendarEventsDB.find({group:foundUser.userCAL});
        const appEvents = events.map(({ title, start, end }) => ({ title, start, end })); 
        res.json(appEvents || []);
      } catch (error) {
        res.status(500).json({ message: 'Error retrieving posts' });
      }
    }
    else{
      res.sendStatus(401);
    }
  
  });
  
  router.get('/api/getUsers' , async (req, res) => {
    const users = await Users.find({});
    res.status(200).json({users : users});
  });

  return router;
};
