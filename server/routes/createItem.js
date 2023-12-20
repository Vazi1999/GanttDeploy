const express = require('express');
const router = express.Router();

const DeleteOldFiles = require('../middleware/DeleteFiles');
const PagesDetail = require('../models/pages_detail');
const CalendarEventsDB = require('../models/calendar_events');

module.exports = (USERS) => {
  const upload = require('../middleware/upload')(USERS);
  
  router.post('/api/createItem', upload.array('files'), async (req, res) => {
      const loggedInUser = res.locals.username;
      const foundUser = USERS.find((obj) => obj.userId === loggedInUser);
      if(foundUser.userId != 1) return res.sendStatus(401); // No admin.
      
      const upload = req.body.time; // Time for upload
      const description = req.body.description; // description of the post
      const files = req.files.map((file) => file.filename); // Extract the files from the post.
      const option = req.body.option; // Post/Story/Reel/Hightlight
      try {
        DeleteOldFiles(files);
        const item = await PagesDetail.create({date:foundUser.currentPD ,type:option ,  description:description,upload:upload ,group:foundUser.userCAL ,files:files })
        console.log("Post saved successfully")
      } catch (error) {
        console.error(error)
        res.sendStatus(500);
      }
    
      
      eventTime = new Date(foundUser.currentPD); 
      eventTime.setHours(0,0,0);
      const events = await CalendarEventsDB.find({group:foundUser.userCAL})
      const foundEvent = events.find(event=>((+(event.start) === +eventTime) && event.title === option));
      console.log('similar event is : ' + foundEvent)
    
      if(!foundEvent) {
        try {
          const event = await CalendarEventsDB.create({title:option , start: eventTime , end:eventTime , group:foundUser.userCAL})
          console.log("Event saved successfully")
        } catch (error) {
          console.error(error)
          res.sendStatus(500);
        }
      }
      res.sendStatus(200);
    });

    return router;
};