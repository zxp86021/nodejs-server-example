var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var DBClient = require('mariasql');
var app = express();
import { SQLLogin } from './env.js';

var c = new DBClient({
    host: SQLLogin.host,
    user: SQLLogin.user,
    password: SQLLogin.password,
    db: SQLLogin.db
});

var urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(express.static('public'));

app.route('/')
    .get(function (req, res) {
		res.sendFile( __dirname + "/" + "index.html" );
	})
	.post(urlencodedParser, function(req, res) {
    	var prep = c.prepare('SELECT * FROM users WHERE username = :username');
    	c.query(prep({ username: req.body.username/*, password: req.body.password */ }), function(err, row) {
            if (err)
                throw err;
            if (row.length < 1)
                res.send('No DATA');
            else
                res.send(row[0]);
        });
	});

c.end();

var server = app.listen(3000, '127.0.0.1', function () {
    var host = server.address().address
    var port = server.address().port
                 
    console.log("app listening at http://%s:%s", host, port)
})
