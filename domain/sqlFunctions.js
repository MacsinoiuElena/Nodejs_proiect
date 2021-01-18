var dbCon = require('../lib/db');

exports.returnAllFromdb = function(table) {
    return new Promise((resolve, reject)=>{
        let sql = 'SELECT * FROM ' + table;
        dbCon.query(sql, (err,result)=>{
        if(err){
            console.log(err)
            
            return reject(err)
        }else{
            

            return resolve(result);

        }
    })
});
}

exports.insertInto = function(table, data) {
    return new Promise((resolve, reject)=>{
        let sql = 'INSERT INTO ' + table + ' SET ?';
        dbCon.query(sql, data,  (err,result)=>{
        if(err){
            console.log(err)
            
            return reject(err, data)
        }else{
            

            return resolve(result);

        }
    })
});
}


exports.updateTarget = function(table, id, data, extension) {
    return new Promise((resolve, reject) => {
        let sql = 'UPDATE ' + table + ' SET ? WHERE id' + extension +' = ' + id;
        dbCon.query(sql,data, (err, result) => {
            if(err) 
            reject(err)

            resolve(result)
        })
    })    
}

exports.deleteTarget = function(table, id, extension) {
    return new Promise((resolve, reject) => {
        let sql = 'DELETE FROM ' + table + ' WHERE id'+ extension +' = ' + id;
        dbCon.query(sql, (err, result) => {
            if(err)
                reject(err)
            resolve(result)
        })
    })
}