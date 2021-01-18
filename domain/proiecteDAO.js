var dbCon = require('../lib/db');
var sqlResult = require('./sqlFunctions');

exports.selectAll = () => sqlResult.returnAllFromdb('proiect');

exports.selectByDenumire = (denumire, data) => {
    return new Promise((resolve, reject) =>{

        dbCon.query('SELECT id FROM proiect WHERE denumire = ?', denumire, function (err, row) {
            if(err) throw err;

            if (row.length === 0) {
                reject(data)
            } else {
                resolve(row[0].id)
            }
        })
    })
}


exports.checkForTitle = (titlu,data) =>{
    return new Promise((resolve, reject) => {
        dbCon.query('SELECT * FROM proiect WHERE denumire = ?', titlu, function(err, row){
            if(err) throw err;

            if (row.length === 0){
                resolve(true)
            }else{
                reject(err, data)
            }
        })
    })
}
exports.insertProiect = (data) => sqlResult.insertInto('proiect', data);

exports.selectById = (id) => {
    return new Promise((resolve, reject) => {
        dbCon.query('SELECT * FROM proiect WHERE id = ' + id, function(err, rows) {
            if(err || rows.length ==0)
            reject(err)
            // if project found
            resolve(rows[0])
        })
    })
}


exports.updateProiect = (data, id) => sqlResult.updateTarget('proiect', id, data, '');

exports.deleteProject = (id) => sqlResult.deleteTarget('proiect', id, '');