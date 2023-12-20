const multer = require('multer');
const path = require('path');

module.exports = (USERS) =>{
  // Multer setup
  const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/')); // Destination folder for uploaded files
      },
      filename: function (req, file, cb) {
        const foundUser = USERS.find((obj) => obj.userId === 1);
        cb(null, foundUser.currentPD + '-' + file.originalname);
      },
    });
    const upload = multer({ storage: storage });
    return upload;
};
