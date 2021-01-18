var studentDAO = require('../domain/studentiDAO');
var proiectDAO = require('../domain/proiecteDAO');
var evidentaDAO = require('../domain/evidentaDAO');


exports.selectAll = (req, res, next) => {
    
    studentDAO.selectAll()
    .then((result) =>{
        
        res.render('students', { data: result });
    }).catch((err)=>{

        req.flash('error', err);
            // render to views/students/index.ejs
            res.render('students', { data: '' });
    });
    
};

exports.requestAdd = (req, res, next) => {

    proiectDAO.selectAll()
    .then((result) =>{
        
        // render to add.ejs
        res.render('students/addStud', {
            nume: '',
            prenume: '',
            email: '',
            grupa: '',
            proiecte: result,
            denumire: 'Alege proiectul'
        });
    }).catch((err)=>{

        req.flash('error', err);
        // render to views/students/index.ejs
        res.render('students', { data: '' });
    });
}

exports.addStudent = (req, res, next) => {

    let nume = req.body.nume;
    let prenume = req.body.prenume;
    let email = req.body.email;
    let grupa = req.body.grupa;
    let denumire = req.body.denumire;
    let errors = false;

    if (nume.length === 0 || prenume.length === 0 || email.length === 0 || grupa.length === 0 || denumire.length === 0) {
        errors = true;
        // set flash message
        req.flash('error', "Please enter all informations");
        console.log('if eroare');        
        proiectDAO.selectAll()
        .then((result) => {
            // render to add.ejs
            res.render('students/addStud', {
                nume: nume,
                prenume: prenume,
                email: email,
                grupa: grupa,
                denumire: denumire,
                proiecte: result
            });
        }).catch((err) => {
            req.flash('error', err);
            // render to views/students/index.ejs
            res.render('students', { data: '' });
        })
    }else{
        errors = true;
        studentDAO.checkForEmail(email)
        .then(() => {
            
            let check = studentDAO.checkGroup(grupa)
            if (!check){
                
                req.flash('error', 'Enter a valid group');
                proiectDAO.selectAll()
                .then((result) => {
                    res.render('students/addStud', {
                    nume: nume,
                    prenume: prenume,
                    email: email,
                    grupa: grupa,
                    denumire: denumire,
                    proiecte: result
                    });
                }).catch((err) => {
                    req.flash('error', err);
                    res.render('students', { data: '' });
                    })
            }else{
                errors = false;
            }

            if (!errors) {
                console.log("nu mai vreauuuuuuuu" + errors);
                var form_data = {
                    nume: nume,
                    prenume: prenume,
                    email: email,
                    grupa: grupa
                }
                
                var idStudent = 0;
                var idProiect = 0;
        
                studentDAO.insertStudent(form_data)
                .then(() => {
                    studentDAO.selectByEmail(email)
                    .then((result) => {
                        idStudent =  result;
                        
                    })
                    .catch((err) => {
                        req.flash('error', err);
                        console.log('eroare search' + err);
                        res.render('students/addStud', {
                            nume: form_data.nume,
                            prenume: form_data.prenume,
                            email: form_data.email,
                            grupa: form_data.grupa
                        })    
                    }).then(() => {
                        proiectDAO.selectByDenumire(denumire)
                        .then((result) => {
                            idProiect = result;
                        }).catch((err) => {
                            req.flash('error', err);
                            console.log('select proiect id err:' + err);
                            res.render('students/addStud', {
                                nume: form_data.nume,
                                prenume: form_data.prenume,
                                email: form_data.email,
                                grupa: form_data.grupa
                            })
                        }).then(() => {
                            console.log(idProiect, idStudent);
                            let data_r = {
                                id_proiect: idProiect,
                                id_student: idStudent
                            }
                            evidentaDAO.insertStudent(data_r)
                            .then(() => {
                                req.flash('success', 'Student successfully added');
                                evidentaDAO.selectJoin()
                                .then((data) => {
                                    // render to evidenta.ejs
                                    res.redirect('/evidenta');
                                }).catch((err) => {
                                    req.flash('error', err)
                                    res.redirect('/students/addStud');
                                })
                            })
                            .catch((err) => {
                                req.flash('error', err)
                                console.log('insert middle err:' + err);
                                res.redirect('/students/addStud');
                            })
                        }).catch((err) => {
                            req.flash('error', err)
                            console.log('insert middle err:' + err);
                            res.redirect('/students/addStud');
                        })
                    })
                    .catch((err) => {
                        req.flash('error', err)
                        console.log('insert middle err:' + err);
                        res.redirect('/students/addStud');
                    })
                }).catch((err) => {
                    req.flash('error', err)
                    console.log('insert stud err:' + err.stack);
                    res.render('students/addStud', {
                        nume: form_data.nume,
                        prenume: form_data.prenume,
                        email: form_data.email,
                        grupa: form_data.grupa
                    })
                    
                })
            }
        })
        .catch(() => {
            req.flash('error', 'Email already exist');
            proiectDAO.selectAll()
                .then((result) => {
                    res.render('students/addStud', {
                    nume: nume,
                    prenume: prenume,
                    email: email,
                    grupa: grupa,
                    denumire: denumire,
                    proiecte: result
                    });
                }).catch((err) => {
                    req.flash('error', err);
                    res.render('students', { data: '' });
                    })
        })

        
    }

}

exports.returnEditPage = (req, res, next) => {
    let id = req.params.id;
        studentDAO.selectById(id)
        .then((result) => {
            console.log(result);
            res.render('students/editStud', {
                title: 'Modifica Student',
                id: result.id,
                nume: result.nume,
                prenume: result.prenume,
                email: result.email,
                grupa: result.grupa
            })
        })
        .catch((err) => {
            req.flash('error', 'Student not found')
            res.redirect('/students')
        })
}

exports.postUpdate = (req, res, next) => {

    let id = req.params.id;
    let nume = req.body.nume;
    let prenume = req.body.prenume;
    let email = req.body.email;
    let grupa = req.body.grupa;
    // let denumire = req.body.denumire;
    let errors = false;


    if (nume.length === 0 || prenume.length === 0 || email.length === 0 || grupa.length === 0) {
        errors = true;

        // set flash message
        req.flash('error', "Please enter all informations");
        // render to addStud.ejs with flash message
        res.render('students/editStud', {
            id: req.params.id,
            nume: nume,
            prenume: prenume,
            email: email,
            grupa: grupa
            // denumire: denumire,
            // proiecte: fields
        })
    }

    if (!errors) {

        var form_data = {
            nume: nume,
            prenume: prenume,
            email: email,
            grupa: grupa
        }
        // var data_r;
        // var proiectId = 0;

        // proiectDAO.selectAll()
        // .then((result) => {
        //     data_r = {
        //         denumire: denumire,
        //         proiecte: result
        //     }
            
        // })
        // .then(() => {
            studentDAO.upadteStudent(form_data, id)
            .then(() => {
                

                // for(proeict of data_r.proiecte) {
                //     if(proeict.denumire == data_r.denumire){
                //         proiectId = proeict.id;
                //         break;
                //     }
                // }
                console.log(id);
                evidentaDAO.updateEvidenta({id_student : id}, id)
                .then(() => {
                    req.flash('success', "Student's informations successfully updated");
                        res.redirect('/students');
                })
                .catch((err) => {
                     // set flash message
                     console.log('eroare update evidenta :' +err);
                     req.flash('error', err)
                     // render to edit.ejs
                     res.render('students/editStud', {
                         id: req.params.id,
                         nume: form_data.nume,
                         prenume: form_data.prenume,
                         email: form_data.email,
                         grupa: form_data.grupa
                     })
                })
            // })
            // .catch((err) => {

            //     console.log('eroare update student :' + err);
            // })
        })
        .catch((err) => {
            console.log('eroare update student :' + err);
        }) 
    }
}

exports.deleteStudent = (req, res, next) => {

    let id = req.params.id;

    evidentaDAO.deleteRegisters(id)
    .then(() => {
            studentDAO.deleteStudent(id)
        .then(() => {
            // set flash message
            let message = 'Student successfully deleted!';
            console.log(message);
            req.flash('success', message)
            // redirect to students page
            res.redirect('/students')
        })
        .catch((err) => {
            console.log('eroare la stergere :' +err);
            // set flash message
            req.flash('error', err)
            // redirect to students page
            res.redirect('/students')
        })
        })
    .catch((err) => {
        console.log('error when trying to delete from evidenta :' +err);

        // set flash message
        req.flash('error', err)
        // redirect to students page
        res.redirect('/students')
    })
    
}

