var express = require('express');
var router = express.Router();
var evidentaController = require('../controllers/evidentaController')

// display evidenta  page
router.get('/', evidentaController.returnJoinSelect); 

router.get('/addProj/(:id)', evidentaController.addProj);

router.get('/delProj/(:id)', evidentaController.delProj);

router.post('/addProj/(:id)', evidentaController.saveEvidenta);

router.post('/delProj/(:id)', evidentaController.deleteEvidenta);

router.get('/note/(:id)/(:idProiect)', evidentaController.modifica);

router.post('/note/(:id)/(:idProiect)', evidentaController.modificaNota);

module.exports = router;