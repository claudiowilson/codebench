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

app.post('/logon', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	queries.LoginUser(username, password, client, function(err, user) {
		if(err) {
			console.log(err);
			response.render('layout.jade', {message: 'Invalid password'});
		}
		else {
			expiry = new Date();
			expiry.setMonth(expiry.getMonth() + 1);
			response.cookie('user', {'userId' : user.user_id, 'username': user.username},{expires: expiry, httpOnly:true});
			response.redirect('index');
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
	    response.render('index.jade');
	}
    });
});

app.get('/problems', function(request, response) {
    var id = request.body.id;
    queries.GetQuestion(id, client, function(err, question) {
	queries.SubmissionsForQuestion(id, client, function(err, submissions) {
	    response.render('post.jade', question, submissions);
	});
    });
});

app.get('/logoff', function(request, response) {
	response.clearCookie('user');
	response.render('index.jade');
});

app.get('/submitQuestion', function(request, response) {
    //    queries.AddQuestion({askedUser: 1, problem: 'yolo', input:'yolo', output:'yolo', upvotes : 5, downvotes : 5}, client);
    response.render('addQuestion.jade');
});

app.post('/submitQuestion', function(request, response) {    
    var question = request.body.question;
    var input = request.body.input;
    var output = request.body.output;
    queries.AddQuestion({askedUser: 1, problem: question, input: input, output: output, upvotes : 0, downvotes : 5}, client, function(err, result) {
	response.redirect('/problems', {question: result});
    });
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
    queries.GetQuestions(client, function (err, query) {
	response.render('index.jade', {user: request.cookies.user}, {questions: query});
    });
});

app.listen(3000);
console.log('listening on port 3000!');
