var express = require('express');
var router = express.Router();
var dbConn = require('../lib/db');

// display students page
router.get('/', function (req, res, next) {

    dbConn.query('SELECT * FROM student', function (err, rows) {

        if (err) {
            req.flash('error', err);
            // render to views/students/index.ejs
            res.render('students', { data: '' });
        } else {
            // render to views/students/index.ejs
            res.render('students', { data: rows });
        }
    });
});

// display add students page
router.get('/addStud', function (req, res, next) {

    let v;

    dbConn.query('SELECT * FROM proiect', function (err, rows) {

        if (err) {
            req.flash('error', err);
            // render to views/students/index.ejs
            res.render('students', { data: '' });
        } else {
            // render to add.ejs
            res.render('students/addStud', {
                nume: '',
                prenume: '',
                email: '',
                grupa: '',
                proiecte: rows,
                denumire: ''
            });
        }
    });

})

// add a new student
router.post('/addStud', function (req, res, next) {

    let nume = req.body.nume;
    let prenume = req.body.prenume;
    let email = req.body.email;
    let grupa = req.body.grupa;
    let denumire = req.body.denumire;
    let proiecte = req.body.proiecte;
    let errors = false;

    if (nume.length === 0 || prenume.length === 0 || email.length === 0 || grupa.length === 0 || denumire.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all informations");

        // dbConn.query('SELECT * FROM student WHERE email =?', email, function (err, row) {
        //     if (!err) {
        //         req.flash('error', err);
        //     }
        // })

        // if (grupa.length != 4) {
        //     req.flash('error', "Please enter a valid group");
        // } else {
        //     if (grupa[0] != '4' || (grupa[1] > '4' || grupa[1] < '1') || (grupa[2] > '4' || grupa[2] < '1')
        //         || (grupa[3] < 'A' || grupa[3] > 'G')) {
        //         req.flash('error', "Please enter a valid group");
        //     }
        // }

        dbConn.query('SELECT * FROM proiect', function (err, rows) {

            if (err) {
                req.flash('error', err);
                // render to views/students/index.ejs
                res.render('students', { data: '' });
            } else {
                // render to add.ejs
                res.render('students/addStud', {
                    nume: nume,
                    prenume: prenume,
                    email: email,
                    grupa: grupa,
                    denumire: denumire,
                    proiecte: rows
                });
            }
        });
        // render to addStud.ejs with flash message

    }

    // if no error
    if (!errors) {

        var form_data = {
            nume: nume,
            prenume: prenume,
            email: email,
            grupa: grupa
        }

        // insert query
        dbConn.query('INSERT INTO student SET ?', form_data, function (err, result) {
            //if(err) throw err
            let id_stud;
            let id_proj;
            if (err) {
                req.flash('error', err)

                // render to addStud.ejs
                res.render('students/addStud', {
                    nume: form_data.nume,
                    prenume: form_data.prenume,
                    email: form_data.email,
                    grupa: form_data.grupa
                })
            } else {
                console.log(email);
                dbConn.query('SELECT * FROM student WHERE email = ?', email, function (err, row) {
                    if (err) throw err;
                    // console.log(row);
                    if (row.length === 0) {
                        req.flash('error', err);

                        res.render('students/addStud', {
                            nume: form_data.nume,
                            prenume: form_data.prenume,
                            email: form_data.email,
                            grupa: form_data.grupa
                        })
                    } else {
                        id_stud = row[0].id;
                    }
                })
                console.log(denumire);
                dbConn.query('SELECT id FROM proiect WHERE denumire = ?', denumire, function (err, row) {
                    // if(err) throw err;

                    if (row.length === 0) {
                        req.flash('error', err);

                        res.render('students/addStud', {
                            nume: form_data.nume,
                            prenume: form_data.prenume,
                            email: form_data.email,
                            grupa: form_data.grupa
                        })
                    } else {
                        id_proj = row[0].id;
                    }


                    console.log(id_proj);
                    console.log(id_stud);
                    var data_r = {
                        id_proiect: id_proj,
                        id_student: id_stud
                    }

                    // insert query

                    dbConn.query('INSERT INTO proiect_student SET ?', data_r, function (err, result) {
                        // if(err) throw err;
                        if (err) {
                            req.flash('error', err)

                            res.redirect('/students/addStud');


                        } else {
                            console.log(typeof denumire);
                            req.flash('success', 'Student successfully added');
                            data = [{
                                nume: form_data.nume,
                                prenume: form_data.prenume,
                                email: form_data.email,
                                grupa: form_data.grupa,
                                denumire: denumire
                            }]
                            console.log(data.denumire);
                            // render to evidenta.ejs
                            console.log(data);
                            res.render('students/evidenta', {
                                data: data
                            })
                        }
                    })
                })
            }
        })
    }
})

// display evidenta  page
router.get('/evidenta/', function (req, res, next) {

    dbConn.query('SELECT nume, prenume, grupa, email, denumire FROM student JOIN proiect_student ON student.id = proiect_student.id_student JOIN proiect WHERE proiect_student.id_proiect = proiect.id', function (err, fields) {
        console.log(fields);
        if (err) {
            req.flash('error', err);
            // render to views/students/index.ejs
            res.render('students/evidenta', { data: '' });
        } else {
            // render to views/students/index.ejs
            res.render('students/evidenta', { data: fields });
        }
    });
});

// display edit student page
router.get('/editStud/(:id)', function (req, res, next) {

    let id = req.params.id;

    dbConn.query('SELECT student.id, nume, prenume, grupa, email, denumire FROM student JOIN proiect_student ON student.id = ' + id + ' JOIN proiect WHERE proiect_student.id_proiect = proiect.id', function (err, rows) {
        if (err) throw err

        // if student not found
        if (rows.length <= 0) {
            req.flash('error', 'Student not found with id = ' + id)
            res.redirect('/students')
        }
        // if student found
        else {
            dbConn.query('SELECT * FROM proiect', function (err, fields) {
                if (err) throw err
                console.log(rows[0].id);
                // render to editStud.ejs
                res.render('students/editStud', {
                    title: 'Modifica Student',
                    id: rows[0].id,
                    nume: rows[0].nume,
                    prenume: rows[0].prenume,
                    email: rows[0].email,
                    grupa: rows[0].grupa,
                    denumire: rows[0].denumire,
                    proiecte: fields
                })
            })
        }
    })
})

// update project data
router.post('/updateStud/(:id)', function (req, res, next) {

    let id = req.params.id;
    let nume = req.body.nume;
    let prenume = req.body.prenume;
    let email = req.body.email;
    let grupa = req.body.grupa;
    let denumire = req.body.denumire;
    let proiecte = req.body.proiecte;
    let errors = false;

    if (nume.length === 0 || prenume.length === 0 || email.length === 0 || grupa.length === 0 || denumire.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all informations");
        // render to addStud.ejs with flash message
        res.render('students/editStud', {
            id: req.params.id,
            nume: nume,
            prenume: prenume,
            email: email,
            grupa: grupa,
            denumire: denumire,
            proiecte: fields
        })
    }

    // if no error
    if (!errors) {

        var form_data = {
            nume: nume,
            prenume: prenume,
            email: email,
            grupa: grupa
        }
        // update query
        dbConn.query('SELECT * FROM proiect', function (err, fields) {

            var data_r = {
                denumire: denumire,
                proiecte: fields
            }
            
            dbConn.query('UPDATE student SET ? WHERE id = ' + id, form_data, function (err, result) {
                dbConn.query('UPDATE proiect_Student SET ? WHERE id_student = ' + id, data_r, function (err, rows) {


                    //if(err) throw err
                    if (err) {
                        // set flash message
                        req.flash('error', err)
                        // render to edit.ejs
                        res.render('students/editStud', {
                            id: req.params.id,
                            nume: form_data.nume,
                            prenume: form_data.prenume,
                            email: form_data.email,
                            grupa: form_data.grupa,
                            denumire: form_data.denumire,
                            proiecte: fields
                        })
                        console.log(proiecte);
                    } else {
                        req.flash('success', "Student's informations successfully updated");
                        res.redirect('/students');
                    }
                })
            })

        })
    }
})

// delete student
router.get('/deleteStud/(:id)', function (req, res, next) {

    let id = req.params.id;
    console.log(id);
    dbConn.query('DELETE FROM student WHERE id = ' + id, function (err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            req.flash('error', err)
            // redirect to students page
            res.redirect('/students')
        } else {
            // set flash message
            req.flash('success', 'Student successfully deleted! ID = ' + id)
            // redirect to students page
            res.redirect('/students')
        }
    })
})

module.exports = router;