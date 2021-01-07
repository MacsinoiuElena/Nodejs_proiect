var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Proiecte Electronica', descriere1: 'Fiecare student isi va alege un singur proiect', descriere2: 'Termenul limita pentru predare va fi peste 2 saptamani'});
});

module.exports = router;
