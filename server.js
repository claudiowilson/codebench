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

app.get('/', function(request, response) {
	response.redirect('/index');
});

app.get('/question/:id', function(request, response) {
	queries.GetQuestion(request.params.id, function(err, result) {
		if(err) {console.log(err);}
		else {
			console.log(result);
		}
	});
});

app.post('/logon', function(request, response) {
	var username = request.body.username;
	var password = request.body.password;
	queries.LoginUser(username, password, function(err, user) {
		if(err) {
			console.log(err);
			response.render('layout.jade', {message: err.message});
		}
		else {
			expiry = new Date();
			expiry.setMonth(expiry.getMonth() + 1);
			response.cookie('user', {'userId' : user.user_id, 'username': user.username},{expires: expiry, httpOnly:true});
			response.redirect('/index');
		}
	});
});

app.post('/register', function(request, response) {
    var username = request.body.username;
    var password = request.body.password;
    queries.AddUser(username, password, function(err, result) {
	if(err) {
	    console.log(err);
	} else {
	    response.redirect('/index');
	}
    });
});

app.get('/problem/:id', function(request, response) {
    var id = request.params.id;
    queries.GetQuestionAndSubmissions(id, function(err, submissions) {
    	if(err) {
    		console.log(err);
    	} else {
	    console.log(submissions);
    	    for(var i = 0; i < submissions.length; i++) {
	 	submissions[i].result = submissions[i].result && JSON.parse(submissions[i].result);
	    }
	    submissions = submissions.filter(function(entry) {
		if(entry.result) {
		    if(entry.result.time) {
			return true;
		    }
		}
		return false;
	    });
	    submissions.sort(function(a, b) {
		if (a.result.time < b.result.time) return -1;
		if (a.result.time > b.result.time) return 1;
		return 0;
	    });
	    
	    queries.GetQuestion(id, function(err, question) {
		if(err) {
		    console.log(err);
		} else {
		    response.render('post.jade', {user: request.cookies.user, question: question, submissions: submissions});
		}
	    });
	}
    });
});

app.get('/logoff', function(request, response) {
    response.clearCookie('user');
    response.render('index.jade', {user: request.cookies.user});
});

app.get('/addproblem', function(request, response) {
	response.render('addQuestion.jade', {user: request.cookies.user});
});

app.post('/submitQuestion', function(request, response) {
    queries.AddQuestion({askedUser: request.cookies.user.userId, problem: request.body.problem, inputs: request.body.input, outputs: request.body.output}, function(err, result) {
    	if(err) {
    	    console.log(err);
    	    response.render('layout.jade', {message: 'Something went wrong', user: request.cookies.user});
    	} else {
    	    response.redirect('/problem/'+ result.question_id);
	}
    });
});

app.post('/submitSolution', function(request, response) {
    queries.AddSubmission({submittedUser: request.cookies.user.userId, question : request.body.problemId, message: request.body.message, code: request.body.solution }, function(err, result) {
		if(err) {
			console.log(err);
    		response.render('layout.jade', {message: 'Something went wrong'});
		} else {
    		response.redirect(/submit/ + result.submission_id);
		}
	})
});

app.get('/submit/:submission_id', function(request, response) {
	var exec = require('child_process').exec, child;
	child = exec('/usr/bin/java -jar CodeBench.jar ' + request.params.submission_id, function(error, stdout, stderr) {
		console.log(stdout);
		console.log(stderr);
		if(error) { console.log(error);}
	});
	response.render('layout.jade', {message: 'Code submitted! It will be benchmarked soon', user: request.cookies.user});
});

app.get('/index', function(request, response) {
    queries.GetQuestions( function (err, results) {
	response.render('index.jade', {user: request.cookies.user, questions: results});
    });
});

app.listen(3000);
console.log('listening on port 3000!');
