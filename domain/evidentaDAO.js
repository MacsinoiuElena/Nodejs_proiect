const { response } = require('express');
var dbCon = require('../lib/db');
var sqlResult = require('./sqlFunctions');

exports.insertStudent = (data) => sqlResult.insertInto('proiect_student', data);

exports.updateEvidenta = (data, id) => sqlResult.updateTarget('proiect_student', id, data, '_student');

exports.deleteRegisters = (id) => sqlResult.deleteTarget('proiect_student', id, '_student');

exports.updateNota = (nota, ids) => {
    return new Promise((resolve, reject) => {
        let sql = "UPDATE proiect_student SET nota = "+ nota +" WHERE id_student = " +ids.idStud+ " AND id_proiect = "+ ids.idProiect;

        dbCon.query(sql, (err) => {
            if(err)
            reject(err)
            resolve('OK')
        })
    })
}

exports.selectJoin = () => {
    
    return new Promise((resolve, reject) => {
        
        let sql = "SELECT student.id, nume, prenume, email, grupa, GROUP_CONCAT(denumire SEPARATOR '/') AS denumire, GROUP_CONCAT(proiect.id SEPARATOR '/') AS idProiect, GROUP_CONCAT(nota SEPARATOR '/') AS nota FROM student LEFT JOIN proiect_student ON student.id = proiect_student.id_student JOIN proiect WHERE proiect_student.id_proiect = proiect.id GROUP BY student.id";
        dbCon.query(sql, (err,rows) => {
            // console.log(rows + 'asdasd');
            if (err) {
                console.log(err);
                reject(err)
                
            } else {
                
                resolve(rows)
                
            }
        });
    })
}

exports.returnProjectsForStudent = (id) =>{
    return new Promise((resolve, reject) => {
        dbCon.query('SELECT * FROM proiect LEFT JOIN proiect_student ON proiect.id = proiect_student.id_proiect WHERE proiect_student.id_student IS NULL OR proiect_student.id_student != '+id, (err, rows) => {
            if(err) 
            reject(err)
            if(rows.length == 0) {
                reject(rows);
            }else {
                resolve(rows);
            }
        })
        
    })
}

exports.returnProjectsOfStudents = (id) => {
    return new Promise((resolve, reject) => {
        dbCon.query('SELECT * FROM proiect LEFT JOIN proiect_student ON proiect.id = proiect_student.id_proiect WHERE proiect_student.id_student =' +id, (err, rows) => {
            if(err) 
            reject(err)
            if(rows.length == 0) {
                reject(rows);
            }else {
                resolve(rows);
            }
        })
    })
}

exports.addNewEvidenta = (data) => sqlResult.insertInto('proiect_student', data);

exports.deleteEvidenta = (idS, idP) => {
    return new Promise((resolve, reject) => {
        dbCon.query('DELETE FROM proiect_student WHERE id_student = '+idS+' AND id_proiect = '+idP, (err) => {
            if(err)
                reject(err)
            resolve('OK');
        })
    })
}