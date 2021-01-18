var express = require('express');
var router = express.Router();
var studentController = require('../controllers/studentController');

// display students page
router.get('/', studentController.selectAll);

// display add students page
router.get('/addStud', studentController.requestAdd);
 

// add a new student
router.post('/addStud', studentController.addStudent)


// display edit student page
router.get('/editStud/(:id)', studentController.returnEditPage);

// update project data
router.post('/updateStud/(:id)', studentController.postUpdate);
//  function (req, res, next) {


// delete student
router.get('/deleteStud/(:id)', studentController.deleteStudent);


module.exports = router;