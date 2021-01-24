var proiectDAO = require('../domain/proiecteDAO');


exports.selectAll = (req, res, next) => {
    
    proiectDAO.selectAll()
    .then((result) =>{
        
        // render to views/projects/index.ejs
        res.render('projects',{data:result});
    }).catch((err)=>{

        req.flash('error', err);
        // render to views/projects/index.ejs
        res.render('projects',{data:''});  
    });
}

exports.returnAddPage = (req, res, next) => {
    res.render('projects/addProj', {
        denumire: '',
        descriere: ''        
    })
}

exports.addNewProject = (req, res, next) => {
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
    }else{
        errors = true;
        var form_data = {
            denumire: denumire,
            descriere: descriere
        }
        proiectDAO.checkForTitle(denumire,form_data)
        .then(() => {
            errors = false;
    
            proiectDAO.insertProiect(form_data)
            .then(() => {
                req.flash('success', 'Project successfully added');
                res.redirect('/projects');
            })
            .catch((err) => {
                req.flash('error', err)
                     
                    // render to add.ejs
                res.render('projects/addProj', {
                    denumire: form_data.denumire,
                    descriere: form_data.descriere                    
                })
            })
        })
        .catch((err) => {
            req.flash('error', 'Title already exist')
            res.render('projects/addProj', {
                denumire: form_data.denumire,
                descriere: form_data.descriere                    
            })

        }) 
    }
}

exports.updateProject = (req, res, next) => {
    let id = req.params.id;

    proiectDAO.selectById(id)
    .then((result) => {
        // render to edit.ejs
        res.render('projects/editProj', {
            title: 'Modifica Proiect', 
            id: result.id,
            denumire: result.denumire,
            descriere: result.descriere
        })
    })
    .catch((err) => {
        console.log('eroare la select dupa id :' + err);
        req.flash('error', 'Project not found')
            res.redirect('/projects')
    })

}

exports.modifyProject = (req, res, next) => {
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
    }else{
        // errors = true;
        var form_data = {
            denumire: denumire,
            descriere: descriere
        }
            proiectDAO.updateProiect(form_data, id)
            .then(() => {
                req.flash('success', 'Project successfully updated');
                res.redirect('/projects');
            })
            .catch((err) => {
                if (err) {
                    console.log('eroare la update :'+err);
                    // set flash message
                    req.flash('error', err)
                    // render to edit.ejs
                    res.render('projects/editProj', {
                        id: req.params.id,
                        denumire: form_data.denumire,
                        descriere: form_data.descriere
                    })
                }
            })
        }
    }

exports.deleteProject = (req, res, next) => {
    let id = req.params.id;

    proiectDAO.deleteProject(id)
    .then(() => {
        req.flash('success', 'Project successfully deleted!')
        // redirect to projects page
        res.redirect('/projects')
    })
    .catch((err) => {
        // set flash message
        req.flash('error', 'Project has already been chosen, it can not be deleted')
        // redirect to projects  page
        res.redirect('/projects')
    })
}