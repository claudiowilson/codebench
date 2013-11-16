var express = require('express'),
	stylus = require('stylus'),
	async = require('async'),
	settings = require('./settings'),
	queries = require('./queries'),
	pg = require('pg'),
	amqp = require('amqp');
var app = express();

app.configure(function() {
	app.use(express.logger('dev'));
	app.use(express.bodyParser());
	app.use(express.cookieParser('codebenchyolo'));
	app.use(express.session('codebenchswag'));
	app.use(stylus.middleware({
		src: __dirname + '/views',
		dest: __dirname + '/public'
	}));
	app.set('views', __dirname + '/views');
	app.use(express.static(__dirname + '/public'));
});

var client = new pg.Client(settings.connString);
// First, checks if it isn't implemented yet.
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

app.get('/question/:id', function(request, response) {
	queries.GetQuestion(request.params.id, client, function(err, result) {
		if(err) {console.log(err);}
		else {
			console.log(result);
		}
	});
});

app.get('/logon', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	queries.LoginUser('test', 'test2', client, function(err, user) {
		if(err) {console.log(err);}
		else {
			console.log(user);
		}
	});
});

app.post('/register', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	queries.AddUser(username, password, client, function(err, result) {
		if(err) {
			console.log(err);
		} else {
			console.log(result);
			response.redirect('/index');
		}
	});
});

app.get('/submitQuestion', function(request, response) {
//    queries.AddQuestion({askedUser: 1, problem: 'yolo', input:'yolo', output:'yolo', upvotes : 5, downvotes : 5}, client);
    response.render('post.jade');
});

app.get('/submitSubmission', function(request, response) {
	//queries.AddSubmission({submittedUser: 1, question: 1, code: 'yolo', result:'yolo'}, client);
	var exec = require('child_process').exec, child;
	child = exec('/usr/bin/java -jar CodeBench.jar 3', function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		if(error) { console.log(error);}
	});
	console.log('yolo');
});

app.get('/index', function(request, response) {
	response.render('index.jade');
});

app.listen(3000, function() {
	console.log('Listening on port 3000')
	var connection = amqp.createConnection({host:'54.201.74.218', port:5672});
	connection.on('ready', function() {
		connection.queue('completion', function(q) {
			q.bind('#');
			q.subscribeRaw(function(message) {
				console.log(message);
			});
		});
	});
});