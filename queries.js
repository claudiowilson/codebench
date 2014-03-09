var pg = require('pg');
var settings = require('./settings');

var GetSubmissionsForQuestion = function(questionId, callback) {
    CallPreparedStatement({name: 'get_submissions_for_question', text: "SELECT * FROM codebench.submission WHERE question=$1", values: [questionId]}, callback);
}

var GetSubmissionsAndCodeForQuestion = function(userId, questionId, callback) {
    CallPreparedStatement({name : 'get_submissions_and_code', text: "SELECT u.username, s.errors, s.submission_id, s.message, extract(milliseconds from s.time_taken) as time_taken, s.language, s.upvotes, s.downvotes, c.code, c.class_name, svote.vote FROM ((codebench.submission AS s JOIN codebench.user AS u ON s.submitted_user = u.user_id JOIN codebench.code AS c ON s.submission_id=c.submission_id) LEFT JOIN codebench.svote AS svote ON svote.user_id=$1 AND s.submission_id = svote.submission_id) WHERE s.question=$2 AND s.time_taken IS NOT NULL ORDER BY (s.upvotes - s.downvotes) DESC, s.date_created DESC", values : [userId, questionId] }, callback);
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

var GetQuestions = function(id, sortBy, callback) {
    if (sortBy == 'top') {
        var orderBy = '(q.upvotes - q.downvotes)';
    } else if (sortBy == 'newest') {
        var orderBy = 'q.date_created';
    }
    CallPreparedStatement( {name: 'get_questions', text: "SELECT q.question_id, q.asked_user, q.title, q.upvotes, q.downvotes, u.username, qvote.vote FROM ((codebench.question AS q INNER JOIN codebench.user AS u ON q.asked_user = u.user_id) LEFT JOIN codebench.qvote AS qvote ON qvote.user_id=$1 AND q.question_id = qvote.question_id) ORDER BY " + orderBy + " DESC, q.date_created DESC LIMIT 50", values: [id]} , callback);
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

var FinalizeSubmission = function(submissionId, callback) {
    CallPreparedStatement( { name: 'finalize_submission', text: "UPDATE codebench.submission SET submitted = TRUE WHERE codebench.submission.submission_id = $1 RETURNING submission_id", values: [submissionId] }, callback);
}

var AddCodeForSubmission = function(submissionId, code, className, callback) {
    CallPreparedStatement( { name: 'add_code_for_submission', text : "INSERT INTO codebench.code (submission_id, code, class_name) VALUES($1, $2, $3) RETURNING code_id", values: [submissionId, code, className] }, callback);
}

var AddQuestion = function(askedUserId, title, problem, input, output, callback) {
    CallPreparedStatement( { name: 'add_question', text : "INSERT INTO codebench.question (asked_user, title, problem, input, output) VALUES ($1, $2, $3, $4, $5) RETURNING question_id", values: [askedUserId, title, problem, input, output] }, callback);
}

var AddUser = function(name, username, password, email, callback) {
    CallPreparedStatement( { name: 'add_user', text: "INSERT INTO codebench.user (username, password, full_name, email) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4) RETURNING user_id", values: [username, password, name, email] }, callback);
}

var SetQuestionVote = function(userId, questionId, vote, callback) {
    // Update qvote if exists
    CallPreparedStatement( { name: 'set_qvote', text: "UPDATE codebench.qvote qv SET vote = $3 FROM (SELECT vote FROM codebench.qvote WHERE user_id = $1 AND question_id = $2 FOR UPDATE) dup WHERE user_id = $1 AND question_id = $2 AND qv.vote = dup.vote RETURNING dup.vote AS old_vote, dup", values: [userId, questionId, vote] }, function(err, result) {

        prevVote = (result.rows[0] ? result.rows[0].old_vote || 0 : 0);

        var updateQuestion = function() {
            up = (prevVote == 1 ? -1 : 0);
            down = (prevVote == -1 ? -1 : 0);
            if (vote == 1) up = up + 1;
            if (vote == -1) down = down + 1;
            
            CallPreparedStatement( { name: 'update_question', text: "UPDATE codebench.question SET downvotes=downvotes+$1, upvotes=upvotes+$2 WHERE codebench.question.question_id = $3", values: [down, up, questionId] }, callback);
        }

        // Insert qvote if failed to update
        CallPreparedStatement( { name: 'add_qvote', text: "INSERT INTO codebench.qvote (user_id, question_id, vote) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM codebench.qvote WHERE codebench.qvote.user_id=$1 AND codebench.qvote.question_id=$2)", values: [userId, questionId, vote]}, function(err, result) {
                updateQuestion();
            } );
    });
}

var SetSubmissionVote = function(userId, submissionId, vote, callback) {
    // Update qvote if exists
    CallPreparedStatement( { name: 'set_svote', text: "UPDATE codebench.svote sv SET vote = $3 FROM (SELECT vote FROM codebench.svote WHERE user_id = $1 AND submission_id = $2 FOR UPDATE) dup WHERE user_id = $1 AND submission_id = $2 AND sv.vote = dup.vote RETURNING dup.vote AS old_vote, dup", values: [userId, submissionId, vote] }, function(err, result) {
                
        prevVote = (result.rows[0] ? result.rows[0].old_vote || 0 : 0);

        var updateSubmission = function() {
            up = (prevVote == 1 ? -1 : 0);
            down = (prevVote == -1 ? -1 : 0);
            if (vote == 1) up = up + 1;
            if (vote == -1) down = down + 1;
            
            CallPreparedStatement( { name: 'update_submission', text: "UPDATE codebench.submission SET downvotes=downvotes+$1, upvotes=upvotes+$2 WHERE codebench.submission.submission_id = $3", values: [down, up, submissionId] }, callback);
        }

        // Insert qvote if failed to update
        CallPreparedStatement( { name: 'add_svote', text: "INSERT INTO codebench.svote (user_id, submission_id, vote) SELECT $1, $2, $3 WHERE NOT EXISTS (SELECT 1 FROM codebench.svote WHERE codebench.svote.user_id=$1 AND codebench.svote.submission_id=$2)", values: [userId, submissionId, vote]}, function(err, result) {
            updateSubmission();
        } );
    });
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



module.exports = {
    AddUser : AddUser,
    AddQuestion : AddQuestion,
    AddSubmission : AddSubmission,
    FinalizeSubmission : FinalizeSubmission,
    LoginUser : LoginUser,
    AddQuestion : AddQuestion,
    GetQuestion : GetQuestion,
    GetQuestions : GetQuestions,
    GetQuestionsForUser : GetQuestionsForUser,
    GetSubmissionsForUser : GetSubmissionsForUser,
    GetSubmissionsForQuestion : GetSubmissionsForQuestion,
    AddCodeForSubmission : AddCodeForSubmission,
    GetCodeForSubmission : GetCodeForSubmission,
    SetQuestionVote : SetQuestionVote,
    SetSubmissionVote : SetSubmissionVote,
    GetSubmissionsAndCodeForQuestion : GetSubmissionsAndCodeForQuestion
};
