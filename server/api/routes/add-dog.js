const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const db = require('./../../db_connection');

router.use(express.json());

router.post('/', function (req, res) {
  const { body } = req;
  console.log('Add dog req body:', body);
  if (!body.breedIDInput) {
    db.query('INSERT INTO `breeds` (`name`) VALUES (?)', [body.breedInput.toUpperCase()], (err, data) => {
      if (err) {
        res.status(500).json({ success: false, data: err });
      } else {
        const breedID = data.insertId;
        addImageAndDog(req, res, body, breedID);
      }
    });
  } else {
    addImageAndDog(req, res, body, parseInt(body.breedIDInput));
  }
});

function addImageAndDog(req, res, body, breedID) {
  let output = {};
  const insertDogQuery = 'INSERT INTO `dogs` (`name`, `weight`, `bio`, `user_id`, `ig_url`, `birth`, `sex`, `fixed`, `breed`, `energy_lvl`) ' +
    'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
  const insertValues = [
    body.nameInput,
    parseInt(body.weightInput),
    body.descriptionInput,
    parseInt(body.userID),
    body.igInput,
    body.dobInput.toString(),
    body.genderInput,
    parseInt(body.fixedInput),
    parseInt(breedID),
    parseInt(body.energyLevelInput)
  ];

  db.query(insertDogQuery, insertValues, (err, insertDogResult) => {
    if (err) {
      output = {
        success: false,
        data: err
      };
      res.status(500).json(output);
    } else {
      let insertImagesQuery = 'INSERT INTO `dog_images` (`dog_id`, `url`, `sort_ord`) VALUES ';
      body.imageURLs.forEach((url, index, arr) => {
        insertImagesQuery += `(${insertDogResult.insertId}, '${url}', ${index})` + ((index === arr.length - 1) ? ';' : ',');
      });
      db.query(insertImagesQuery, (error, insertImagesResult) => {
        if (error) {
          output = {
            success: false,
            data: error
          };
          res.status(500).json(output);
        } else {
          output = {
            success: true,
            insertDogData: insertDogResult,
            insertImagesData: insertImagesResult
          };
          res.status(200).json(output);
        }
      });
    }
  });
}

module.exports = router;

/*
Add dog request body dummy data
{
  breedInput: "42",
  descriptionInput: "Test test test",
  dobInput: 1571526293,
  energyLevelInput: "0",
  fixedInput: 1,
  genderInput: "M",
  igInput: "https://dog.cog/",
  imageURLs: [
    "https://final-project-dog-images.s3.us-east-2.amazonaws.com/7ee751890f3478500f0753cc954752b8-d7uom2k.jpg",
    "https://final-project-dog-images.s3.us-east-2.amazonaws.com/2048%20%281%29.jpg",
    "https://final-project-dog-images.s3.us-east-2.amazonaws.com/2048%20%282%29.jpg",
    "https://final-project-dog-images.s3.us-east-2.amazonaws.com/2048%20%283%29.jpg"
  ],
  nameInput: "Steve",
  userID: "1",
  weightInput: "55"
}
*/
