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
    CallPreparedStatement( {name: 'get_user', text: "SELECT * FROM codebench.question INNER JOIN codebench.user ON codebench.question.asked_user = codebench.user.user_id WHERE question_id=$1", values : [id] }, function(err, result) {
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

var GetCodeForSubmission = function(submissionId, callback) {
    CallPreparedStatement( { name: 'get_code_for_submission', text: "SELECT * FROM codebench.code WHERE codebench.code.submission_id=$1", values : [submissionId]}, callback);
}

var GetQuestionAndSubmissions = function(questionId, callback) {
    CallPreparedStatement( { name: 'get_questions_and_submissions', text: "SELECT * FROM codebench.submission INNER JOIN codebench.user ON codebench.submission.submitted_user = codebench.user.user_id WHERE codebench.submission.question=$1 AND codebench.submission.time_taken IS NOT NULL", values : [questionId]}, callback);
}

//var GetQuestions = function(callback) {
//    CallPreparedStatement("SELECT * FROM codebench.question INNER JOIN codebench.user ON codebench.question.asked_user = codebench.user.user_id LIMIT 50", callback);
//}

var GetQuestions = function(callback) {
    CallPreparedStatement("SELECT codebench.question.question_id, codebench.question.asked_user, codebench.question.title, codebench.question.upvotes, codebench.question.downvotes, codebench.user.username, codebench.qvote.vote FROM ((codebench.question INNER JOIN codebench.user ON codebench.question.asked_user = codebench.user.user_id) LEFT JOIN codebench.qvote ON codebench.question.asked_user = codebench.qvote.user_id) LIMIT 50", callback);
}

var GetQuestionVote = function(userId, questionId, callback) {
    CallPreparedState({ name: 'get_question_vote', text:"SELECT 1 FROM codebench.qvote WHERE codebench.qvote.user_id=$1 AND codebench.qvote.question_id=$2", values: [userId, questionId]}, callback);
}

var GetSubmissionVote = function(userId, submissionId, callback) {
    CallPreparedState({ name: 'get_submission_vote', text:"SELECT 1 FROM codebench.svote WHERE codebench.svote.user_id=$1 AND codebench.svote.submission_id=$2", values: [userId, submmissionId]}, callback);
}

var LoginUser = function(username, password, callback) {
    CallPreparedStatement( {name: 'login_user', text: "SELECT username, password = crypt($1, password), user_id, full_name FROM codebench.user WHERE username=$2", values : [password, username] }, function(err, result) {
        if(err) {
            callback(err);
        } else {
            if(result.rows.length == 0 || result.rows[0] == 'undefined') {
                callback(new Error('No such user exists!'));
            } else {
                callback(null, result);
            }
        }
    })
}

var AddSubmission = function(submittedUserId, question, message, language,  callback) {
    CallPreparedStatement( { name: 'add_sumission', text : "INSERT INTO codebench.submission (submitted_user, question, message, language) VALUES($1, $2, $3, $4) RETURNING submission_id", values: [submittedUserId, question, message, language] }, callback);
}

var AddCodeForSubmission = function(submissionId, code, className, callback) {
    CallPreparedStatement( { name: 'add_code_for_submission', text : "INSERT INTO codebench.code (submission_id, code, class_name) VALUES($1, $2, $3) RETURNING code_id", values: [submissionId, code, className] }, callback);
}

var AddQuestion = function(askedUserId, title, problem, input, output, callback) {
    CallPreparedStatement( { name: 'add_question', text : "INSERT INTO codebench.question (asked_user, title, problem, input, output) VALUES ($1, $2, $3, $4, $5) RETURNING question_id", values: [askedUserId, title, problem, input, output] }, callback);
}

var AddUserPrepared = function(name, username, password, email, callback) {
    CallPreparedStatement( { name: 'add_user', text: "INSERT INTO codebench.user (username, password, full_name, email) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4) RETURNING user_id", values: [username, password, name, email] }, callback);
}

var SetQuestionVote = function(userId, questionId, vote, callback) {
    CallPreparedStatement( { name: 'set_qvote', text: "UPDATE codebench.qvote SET codebench.qvote.vote=$3 WHERE codebench.qvote.user_id=$1 AND codebench.qvote.question_id=$2; INSERT INTO codebench.qvote (user_id, question_id, vote) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM codebench.qvote WHERE codebench.qvote.user_id=$1 AND codebench.qvote.question_id=$2)", values: [userId, questionId, vote] }, callback);
}
/*
var SetQuestionVote = function(userId, questionId, vote, callback) {
    CallPreparedStatement( { name: 'set_qvote', text: "INSERT INTO codebench.qvote (user_id, question_id, vote) VALUES ($1, $2, $3) ON DUPLICATE KEY UPDATE vote = VALUES(vote) RETURNING vote", values: [userId, questionId, vote] }, callback);
}
*/
var SetSubmissionVote = function(userId, submissionId, vote, callback) {
    CallPreparedStatement( { name: 'set_svote', text: "INSERT INTO codebench.svote (user_id, submission_id, vote) VALUES ($1, $2, $3) ON DUPLICATE KEY UPDATE vote = VALUES(vote) RETURNING vote", values: [userId, submissionId, vote] }, callback);
}

var CallPreparedStatement = function(statement, callback) {
    pg.connect(settings.PgConnString, function(err, client, done) {
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
exports.AddCodeForSubmission = AddCodeForSubmission;
exports.GetCodeForSubmission = GetCodeForSubmission;
exports.SetQuestionVote = SetQuestionVote;
