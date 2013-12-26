var pg = require('pg');
var settings = require('./settings');


var GetSubmissionsForQuestion = function(questionId, callback) {
	CallPreparedStatement({name: 'get_submissions_for_question', text: "SELECT * FROM codebench.submission WHERE question=$1", values: [questionId]}, callback);
}

var GetSubmissionsForUser = function(userId, callback) {
	CallPreparedStatement({name: 'get_submissions_for_user', text: "SELECT * FROM codebench.submission WHERE submitted_user=$1", values: [userId]}, callback);
}

var GetQuestionsForUser = function(userId, callback) {
	CallPreparedStatement({name: 'get_questions_for_user', text: "SELECT * FROM codebench.question WHERE asked_user=$1", values: [userId]}, callback);
}

var GetQuestion = function(id, callback) {
	CallPreparedStatement( {name: 'get_user', text: "SELECT * FROM codebench.question WHERE question_id=$1", values : [id] }, function(err, result) {
		if(err) {
			callback(err);
		} else {
			if(result.rows[0] == 'undefined') {
				callback(new Error('No such question exists!'));
			} else {
				callback(null, result);
			}
		}
	})
}

var GetQuestionAndSubmissions = function(questionId, callback) {
	CallPreparedStatement( { name: 'get_questions_and_submissions', text: "SELECT * FROM codebench.submission INNER JOIN codebench.user ON codebench.submission.submitted_user = codebench.user.user_id WHERE codebench.submission.question=$1", values : [questionId]}, callback);
}

var GetQuestions = function(callback) {
	CallPreparedStatement("SELECT * FROM codebench.question LIMIT 50", callback);
}

var LoginUser = function(username, password, callback) {
	CallPreparedStatement( {name: 'login_user', text: "SELECT username, password = crypt($1, password), user_id, full_name FROM codebench.user WHERE username=$2", values : [password, username] }, function(err, result) {
		if(err) {
			callback(err);
		} else {
			if(result.rows[0] == 'undefined') {
				callback(new Error('No such user exists!'));
			} else {
				callback(null, result);
			}
		}
	})
}

var AddSubmission = function(submittedUserId, question, message, code, callback) {
	CallPreparedStatement( { name: 'add_sumission', text : "INSERT INTO codebench.submission (submitted_user, question, message, code) VALUES($1, $2, $3, $4) RETURNING submission_id", values: [submittedUserId, question, message, code] }, callback);
}

var AddQuestion = function(askedUserId, problem, input, output, callback) {
	CallPreparedStatement( { name: 'add_question', text : "INSERT INTO codebench.question (asked_user, problem, input, output) VALUES ($1,$2,$3,$4) RETURNING question_id", values: [askedUserId, problem, input, output] }, callback);
}

var AddUserPrepared = function(name, username, password, email, callback) {
	CallPreparedStatement( { name: 'add_user', text: "INSERT INTO codebench.user (username, password, full_name, email) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4) RETURNING user_id", values: [username, password, name, email] }, callback);
}

var CallPreparedStatement = function(statement, callback) {
	pg.connect(settings.connString, function(err, client, done) {
		client.query(statement, function(err, result) {
			done();
			if(err) {
				console.log(err);
				callback(new Error(err));
			} else {
				callback(null, result);
			}
		});
	});
}




exports.AddUser = AddUserPrepared;
exports.AddQuestion = AddQuestion;
exports.AddSubmission = AddSubmission;
exports.LoginUser = LoginUser;
exports.AddQuestion = AddQuestion;
exports.GetQuestion = GetQuestion;
exports.GetQuestions = GetQuestions;
exports.GetQuestionsForUser = GetQuestionsForUser;
exports.GetSubmissionsForUser = GetSubmissionsForUser;
exports.GetSubmissionsForQuestion = GetSubmissionsForQuestion;
exports.GetQuestionAndSubmissions = GetQuestionAndSubmissions;
