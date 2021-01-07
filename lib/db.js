var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	port: '3307',
	user:'root',
	password:'',
	database:'evidenta'
});
connection.connect(function(error){
	if(!!error) {
		console.log(error);
	} else {
		console.log('Connected..!');
	}
});

module.exports = connection;