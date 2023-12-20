const express = require('express');
const router = express.Router();
const PagesDetail = require('../models/pages_detail');
const CalendarEventsDB = require('../models/calendar_events');

module.exports = (USERS) => {

  router.put('/api/updateWhichUser' , (req, res) => {
    const loggedInUser = res.locals.username;
    const foundUser = USERS.find((obj) => obj.userId === loggedInUser);
    if(foundUser)
    {
      foundUser.userCAL = req.body.userId;
      console.log(req.body.userId);
      console.log(foundUser);
      res.sendStatus(200);
    }
    else{
      res.sendStatus(401);
    }
  });

  router.put('/api/updateDate' ,  async (req, res) => {
    const loggedInUser = res.locals.username;
    const foundUser = USERS.find((obj) => obj.userId === loggedInUser);
    if(foundUser)
    {
      foundUser.currentPD = req.body.date;
      res.status(200).json({ message: foundUser.currentPD });
    }
    else{
      res.sendStatus(401);
    }
  });
  

  router.delete('/api/deleteItem' , async (req,res) => {
    const item = req.body.item;
    console.log(item)
    await PagesDetail.findOneAndDelete({date:item.date , type:item.type , group:item.group , description:item.description});
    const similarItem = await PagesDetail.findOne({date:item.date , type:item.type , group:item.group})
    console.log(similarItem)
    if(similarItem == null)
    {
      const eventTime = new Date(item.date)
      eventTime.setHours(0,0,0)
      await CalendarEventsDB.findOneAndDelete({title:item.type , start:eventTime , group:item.group})
    }
    res.sendStatus(200);
  });

  return router;
};