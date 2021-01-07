var express = require('express');
var router = express.Router();
var dbConn  = require('../lib/db');
 
// display projects page
router.get('/', function(req, res, next) {
      
    dbConn.query('SELECT * FROM proiect',function(err,rows)     {
 
        if(err) {
            req.flash('error', err);
            // render to views/projects/index.ejs
            res.render('projects',{data:''});   
        } else {
            // render to views/projects/index.ejs
            res.render('projects',{data:rows});
        }
    });
});

// display add project page
router.get('/addProj', function(req, res, next) {    
    // render to add.ejs
    res.render('projects/addProj', {
        denumire: '',
        descriere: ''        
    })
})

// add a new project
router.post('/addProj', function(req, res, next) {    

    let denumire = req.body.denumire;
    let descriere = req.body.descriere;
    let errors = false;

    if(denumire.length === 0 || descriere.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter title and description");
        // render to add.ejs with flash message
        res.render('projects/addProj', {
            denumire: denumire,
            descriere: descriere
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            denumire: denumire,
            descriere: descriere
        }
        
        // insert query
        dbConn.query('INSERT INTO proiect SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash('error', err)
                 
                // render to add.ejs
                res.render('projects/addProj', {
                    denumire: form_data.denumire,
                    descriere: form_data.descriere                    
                })
            } else {                
                req.flash('success', 'Project successfully added');
                res.redirect('/projects');
            }
        })
    }
})

// display edit project page
router.get('/editProj/(:id)', function(req, res, next) {

    let id = req.params.id;
   
    dbConn.query('SELECT * FROM proiect WHERE id = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if project not found
        if (rows.length <= 0) {
            req.flash('error', 'Project not found with id = ' + id)
            res.redirect('/projects')
        }
        // if project found
        else {
            // render to edit.ejs
            res.render('projects/editProj', {
                title: 'Modifica Proiect', 
                id: rows[0].id,
                denumire: rows[0].denumire,
                descriere: rows[0].descriere
            })
        }
    })
})

// update project data
router.post('/updateProj/:id', function(req, res, next) {

    let id = req.params.id;
    let denumire = req.body.denumire;
    let descriere = req.body.descriere;
    let errors = false;

    if(denumire.length === 0 || descriere.length === 0) {
        errors = true;
        
        // set flash message
        req.flash('error', "Please enter title and description");
        // render to add.ejs with flash message
        res.render('projects/editProj', {
            id: req.params.id,
            denumire: denumire,
            descriere: descriere
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            denumire: denumire,
            descriere: descriere
        }
        // update query
        dbConn.query('UPDATE proiect SET ? WHERE id = ' + id, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                req.flash('error', err)
                // render to edit.ejs
                res.render('projects/editProj', {
                    id: req.params.id,
                    denumire: form_data.denumire,
                    descriere: form_data.descriere
                })
            } else {
                req.flash('success', 'Project successfully updated');
                res.redirect('/projects');
            }
        })
    }
})
   
// delete project
router.get('/deleteProj/(:id)', function(req, res, next) {

    let id = req.params.id;
     
    dbConn.query('DELETE FROM proiect WHERE id = ' + id, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to projects  page
            res.redirect('/projects')
        } else {
            // set flash message
            req.flash('success', 'Project successfully deleted! ID = ' + id)
            // redirect to projects page
            res.redirect('/projects')
        }
    })
})

module.exports = router;