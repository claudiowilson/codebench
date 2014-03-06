var express = require('express'),
stylus = require('stylus'),
async = require('async'),
settings = require('./settings'),
queries = require('./queries'),
pg = require('pg'),
sender = require('./messageSender'),
sorter = require('./resultSetSorter');
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
            response.cookie('user', {'userId' : user.rows[0].user_id, 'username': user.rows[0].username, 'fullName' : user.rows[0].full_name},{expires: expiry, httpOnly:true});
            response.redirect('/index');
        }
    });
});

app.post('/register', function(request, response) {
    var name     = request.body.full_name;
    var username = request.body.username;
    var password = request.body.password;
    var email    = request.body.email;

    queries.AddUser(name, username, password, email, function(err, result) {
        if(err) {
            console.log(err);
            response.render('layout.jade', {message: err.message});
        } else {
            expiry = new Date();
            expiry.setMonth(expiry.getMonth() + 1);
            response.cookie('user', {'userId' : result.rows[0].user_id, 'username': username, 'fullName' : name},{expires: expiry, httpOnly:true});
            response.redirect('/index');
        }
    });
});

app.get('/problem/:id', function(request, response) {
    var id = request.params.id;

    queries.GetQuestion(id, function(err, question) {
      if(err) {
        console.log(err);
      } else {
        var ques = question.rows[0];
        queries.GetSubmissionsAndCodeForQuestion(ques.question_id, function(err, result) {
          if(err) {
            console.log(err);
          } else {
            var submissions = sorter.SortCodeResults(result.rows);
            response.render('post.jade', {user: request.cookies.user, question: ques, submissions: submissions});
          }
        });
      }
    });
});

app.get('/logoff', function(request, response) {
    response.clearCookie('user');
    response.redirect('/index');
});

app.get('/addproblem', function(request, response) {
    response.render('addQuestion.jade', {user: request.cookies.user});
});

app.post('/submitQuestion', function(request, response) {
    queries.AddQuestion(request.cookies.user.userId, request.body.title, request.body.problem, request.body.input, request.body.output, function(err, result) {
        if(err) {
            response.render('layout.jade', {message: 'Something went wrong', user: request.cookies.user});
        } else {
            response.redirect('/problem/'+ result.rows[0].question_id);
        }
    });
});

app.post('/submitSolution', function(request, response) {
    var submissionId = 0;
    queries.AddSubmission(request.cookies.user.userId, request.body.problemId, request.body.message, request.body.language, function(err, result) {
        if(err) {
            response.render('layout.jade', {message: 'Something went wrong'});
        } else {
            submissionId = result.rows[0].submission_id;
            numClasses = request.body.numClasses;
            for(var i = 0; i < numClasses; i++) {
                console.log(request.body[i] + ' ' + request.body['file-' + i] + ' ' + numClasses)
                if(i == numClasses - 1) {
                    queries.AddCodeForSubmission(submissionId,request.body[i], request.body['file-' + i], function(err, result) {
                        sender.SendMessage(submissionId, "java", function(err, result) {
                            console.log(result);
                        });
                    });
                } else {
                    queries.AddCodeForSubmission(submissionId, request.body[i], request.body['file-' + i], function(err, result) {
                        console.log('Sent to postgres' + result);
                    });
                }
            }
            response.redirect(/submit/ + result.rows[0].submission_id);
        }
    })
});

app.post('/setQVote/:problemId/:prevVote/:vote', function(request, response) {
		if(!request.cookies.user) {
			return;
		}
    queries.SetQuestionVote(request.cookies.user.userId, request.params.problemId, request.params.prevVote, request.params.vote, function(err, result) {
        
    });
});

app.get('/submit/:submission_id', function(request, response) {
    response.render('layout.jade', {message: 'Code submitted! It will be benchmarked soon', user: request.cookies.user});
});

app.get('/index', function(request, response) {
    id = (request.cookies.user ? request.cookies.user.userId : null);
    queries.GetQuestions(id, function (err, results) {
        response.render('index.jade', {user: request.cookies.user, questions: results.rows});
    });
});

var port = process.env.PORT || 80;
app.listen(port);
console.log('listening on port ', port);
