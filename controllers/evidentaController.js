var evidentaDAO = require('../domain/evidentaDAO');
var proiecteDAO = require('../domain/proiecteDAO');

exports.returnJoinSelect = (req, res, next) => {

    data = []
    evidentaDAO.selectJoin()
    .then((result) => {
        // render to views/students/index.ejs
        // console.log(result + '   asdas');
        result.forEach(e => {
            data.push(elem  = {

                denumire : e.denumire.split('/'),
                email: e.email,
                grupa: e.grupa,
                id: e.id,
                idProiecte: e.idProiect.split('/'),
                nota: e.nota.split('/'),
                nume : e.nume,
                prenume: e.prenume
            })
        })
        console.log(data);
        res.render('students/evidenta', { data: data });
    })
    .catch((err) => {
        req.flash('error', err);
        // render to views/students/index.ejs
        res.render('students/evidenta', { data: '' });
    })
}

exports.addProj = (req, res, next) =>{
    let id = req.params.id;

    evidentaDAO.returnProjectsForStudent(id) 
    .then((result) => {
        res.render('students/addProj', {data:result, id:id})
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/students');
    })

}

exports.delProj = (req, res, next) =>{
    let id = req.params.id;

    evidentaDAO.returnProjectsOfStudents(id) 
    .then((result) => {
        res.render('students/delProj', {data:result, id:id})
    })
    .catch((err) => {
        console.log(err);
        res.redirect('/students');
    })

}


exports.saveEvidenta = (req, res, next) => {
    let id = req.params.id;
    let denumire = req.body.denumire;


    proiecteDAO.selectByDenumire(denumire) 
    .then((result) => {
            evidentaDAO.insertStudent({id_student:id, id_proiect:result})
        .then(() => {
            res.redirect('/students');
        })
        .catch((err, data) => {
            console.log(err);
            req.flash('error', 'The operation has failed')
            res.redirect('/evidenta/addProj/'+data.id_student);
        })  
    }).catch((err) => {
        console.log(err);
        req.flash('error', 'The operation has failed')
        res.redirect('/evidenta/addProj/'+id);
    })
    
}

exports.deleteEvidenta = (req, res, next) => {
    let id = req.params.id;
    let DATA = req.body.checkboxvar
    console.log(typeof(DATA) != undefined);
    if(typeof(DATA) != 'object' && DATA != undefined)
        DATA = [DATA]
    if(DATA != undefined) {
        for(data of DATA) {
            console.log(DATA + data);
            proiecteDAO.selectByDenumire(data) 
            .then((result) => {
                evidentaDAO.deleteEvidenta(id, result)
                .then(() => {
                    res.redirect('/students');
                })
                .catch((err) => {
                    console.log(err);
                    req.flash('error', 'The operation has failed')
                    res.redirect('/evidenta/delProj/'+id);
            })  
        }).catch((err) => {
            console.log(err);
            req.flash('error', 'The operation has failed')
            res.redirect('/evidenta/delProj/'+id);
        })  
    }
}
    res.redirect('/evidenta/delProj/'+id);
    
}

exports.modifica = (req, res, next) => {

    let idStud = req.params.id;
    let idProj = req.params.idProiect;

    res.render('students/modif', {idProiect:idProj, idStud:idStud, nota:''});
}

exports.modificaNota = (req, res, next) => {
        
    let idStud = req.params.id;
    let idProj = req.params.idProiect;
    let nota = req.body.nota;

    evidentaDAO.updateNota(nota, {idStud:idStud, idProiect:idProj})
    .then(() => {
        res.redirect('/evidenta');
    })
    .catch((err) => {
        console.log(err);
        req.flash('err', 'ontroduceti date valide');
        res.render('students/modif', {idProiect:idProj, idStud:idStud, nota:nota})
    })

}