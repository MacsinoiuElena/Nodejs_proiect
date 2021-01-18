var dbCon = require('../lib/db');
var sqlResult = require('./sqlFunctions');

exports.selectAll = () => sqlResult.returnAllFromdb('student');

exports.insertStudent = (data) => sqlResult.insertInto('student', data);

exports.selectByEmail = (email) => {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM student WHERE email = '"+ email+"'", function (err, rows) {
            if (err)
            reject(err, rows)

            console.log('select by email row.length + ' + rows.length);
            if (rows.length === 0) {
                
                reject(err, rows)
            } else {
                console.log('select bt email worked ' + rows[0].id);
                resolve(rows[0].id)
            }
        })
})
}

exports.selectById = (id) => {
    return new Promise((resolve, reject) => {
        dbCon.query("SELECT * FROM student WHERE id = '"+ id+"'", function (err, rows) {
            if (err)
            reject(err, rows)

            console.log('select by id row.length + ' + rows.length);
            if (rows.length === 0) {
                
                reject(err, rows)
            } else {
                console.log('select bt email worked ' + rows[0].id);
                resolve(rows[0])
            }
        })
})
}

exports.checkForEmail = (email) => {
    return new Promise((resolve, reject) => {
        dbCon.query('SELECT * FROM student WHERE email = ?', email, function (err, row) {
            if (err)
            reject(err, row)
            
            console.log('select by email row.length + ' + row.length);
            if (row.length === 0) {
                
                resolve(true)
            } else {
                console.log('select bt email worked ' + row[0].id);
                reject(err, row)
            }
        })
})
}

exports.checkGroup = (group) => {
    if (group.length != 4){
        return false;
    }else{
        if (group[0] == '4' && (group[1] <= '4' && group[1] >= '1') && (group[2] <= '9' && group[2] >= '1') 
    && (group[3] >= 'A' && group[3] <= 'G')){
        return true;
    }else{
        return false;
    }
    }
}

exports.selectJoin = (id) => {

    return new Promise((resolve, reject) => {
        dbCon.query('SELECT student.id, nume, prenume, grupa, email, denumire FROM student JOIN proiect_student ON student.id = ' + id + ' JOIN proiect WHERE proiect_student.id_proiect = proiect.id', (err, rows) => {
            if(err) throw err

            if(rows.length == 0) {
                reject(err);
            }else {
                resolve(rows);
            }
        })
        
    })
}

exports.upadteStudent = (data, id) => sqlResult.updateTarget('student', id, data, '');

exports.deleteStudent = (id) => sqlResult.deleteTarget('student', id, '');