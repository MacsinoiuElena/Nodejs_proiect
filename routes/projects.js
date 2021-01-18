var express = require('express');
var router = express.Router();
var proiectController = require('../controllers/proiectController');


// display projects page
router.get('/', proiectController.selectAll);

// display add project page
router.get('/addProj', proiectController.returnAddPage);

// add a new project
router.post('/addProj', proiectController.addNewProject);

// display edit project page
router.get('/editProj/(:id)', proiectController.updateProject);


// update project data
router.post('/updateProj/:id', proiectController.modifyProject);

   
// delete project
router.get('/deleteProj/(:id)', proiectController.deleteProject);


module.exports = router;