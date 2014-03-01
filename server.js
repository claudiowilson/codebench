var express = require('express'),
stylus = require('stylus'),
async = require('async'),
settings = require('./settings'),
queries = require('./queries'),
pg = require('pg');
//sender = require('./messageSender');
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
app.get('/text', function(request, response) {
    sender.SendMessage(0, "java", function(error, msg) {
        console.log(msg);
    });
});

app.get('/', function(request, response) {
    console.log(request.cookies.user);
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
            response.cookie('user', {'userId' : result.user_id, 'username': username, 'fullName' : name},{expires: expiry, httpOnly:true});
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
            queries.GetQuestion(id, function(err, question) {
                if(err) {
                    console.log(err);
                } else {
                    response.render('post.jade', {user: request.cookies.user, question: question.rows[0], submissions: submissions.rows});
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
    queries.AddSubmission(request.cookies.user.userId, request.body.problemId, request.body.message, function(err, result) {
        if(err) {
            response.render('layout.jade', {message: 'Something went wrong'});
        } else {
            submissionId = result.rows[0].submission_id;
            // for(int i = 1; i <= request.body.numClasses; i++) {
            //      queries.AddCodeForSubmission(submissionId, request.body[i], )
            // }
            response.redirect(/submit/ + result.rows[0].submission_id);
        }
    })
});

app.post('/setQVote', function(request, response) {
    queries.SetQuestionVote(request.cookies.user.userId, request.body.problemId, request.body.vote, function(err, result) {

    });
});

app.get('/submit/:submission_id', function(request, response) {
    response.render('layout.jade', {message: 'Code submitted! It will be benchmarked soon', user: request.cookies.user});
});

app.get('/index', function(request, response) {
    queries.GetQuestions( function (err, results) {
        response.render('index.jade', {user: request.cookies.user, questions: results.rows});
    });
});

app.listen(3000);
console.log('listening on port 80!');
