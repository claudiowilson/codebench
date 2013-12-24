var pg = require('pg');
var settings = require('./settings');


var AddQuestion = function(row, callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = "INSERT INTO codebench.question (asked_user, problem, input, output)" +
			" VALUES ('" + row['askedUser'] + "','" + row['problem'] + "','" + row['inputs'] + "','" + row['outputs'] +"') RETURNING question_id";
			client.query(query, function(err, result) {
				client.end();
				if(err) {
					callback(new Error('Error adding questions: ' + err));
				} else {
					callback(null, result.rows[0]);
				}
			});
		}
	})
}

var AddSubmission = function(row, callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = "INSERT INTO codebench.submission (submitted_user, question, message, code)" +
			" VALUES({0}, '{1}','{2}', '{3}') RETURNING submission_id".format(row['submittedUser'], row['question'], row['message'], row['code']);
			client.query(query, function(err, result) {
				client.end();
				if(err) {
					callback(new Error('Error adding submission: ' + err));
				} else {
					callback(null, result.rows[0]);
				}
			});
		}
	});
}

var LoginUser = function(username, password, callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = "SELECT username, password = crypt('" + password + "', password)" + ', user_id, full_name FROM codebench.user WHERE username=' + "'" + username + "'";
			client.query(query, function(err, result) {
				client.end();
				if(err) {
					callback(new Error('Error logging on: ' + err));
				} else {
					if(result.rows[0] == undefined) {
						callback(new Error('No such user exists!'));
					} else {
						callback(null, result.rows[0]);
					}
				}
			});
		}
	});
}

var GetQuestion = function(id, callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
	    else {
		var query = 'SELECT * FROM codebench.question WHERE question_id =' + id;
		client.query(query, function(err, result) {
		    client.end();
		    if(err) {
			callback(new Error('Error getting question: ' + err));
		    } else {
			if(result.rows[0] == undefined) {
			    callback(new Error('Question does not exist!'));
			} else {
			    callback(null, result.rows[0]);
			}
		    }
		});
	    }
	});
}

var GetQuestions = function(callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
	else {
		var query = 'SELECT * FROM codebench.question LIMIT 50';
		client.query(query, function(err, result) {
			client.end();
			if(err) {callback(new Error('Error getting questions: '+err));} else { callback(null, result.rows);}
			});
		}
	});
}

var GetQuestionsForUser = function(userid, callback) {
	var client = GetClient();
	client.connect(function(err) {
		console.log('hashtagyoloswag');
		if(err) { console.log(err); }
		else {
		    var query = 'SELECT * FROM codebench.question WHERE asked_user='+userid;
			client.query(query, function(err, result) {
				client.end();
				if(err) {callback(new Error('Error getting questions for user: '+err));} else {callback(null, result.rows);}
				});
			}
	});
}

var SubmissionsForUser = function(userid, callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
		    var query = 'SELECT * FROM codebench.submission WHERE submitted_user='+userid;
			client.query(query, function(err, result) {
				client.end();
				if(err) {callback(new Error('Error getting questions for user: '+err));} else { callback(null, result.rows);}
			});
		}
	});
}

var SubmissionsForQuestion = function(questionid, callback) {
	var client = GetClient();
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = 'SELECT * FROM codebench.submission WHERE question='+questionid;
			client.query(query, function(err, result) {
				client.end();
				if(err) {callback(new Error('Error getting submissions for question: '+err));} else {callback(null, result.rows);}
			});
		}
	});
}

var GetQuestionAndSubmissions = function(questionid, callback) {
    var client = GetClient();
    client.connect(function(err) {
    	if(err) {console.log(err);}
    	else {
    		var query = 'SELECT * FROM codebench.submission INNER JOIN codebench.user ON codebench.submission.submitted_user = codebench.user.user_id WHERE codebench.submission.question=' + questionid;
    		client.query(query, function(err, result) {
    			client.end();
    			if(err) {
    				callback(new Error('Error getting qs and subs: ' + err));
    			} else {
    				callback(null, result.rows);
    			}
    		});
    	}
    });
}

var AddQuestion = function(askedUserId, problem, input, output, callback) {
	CallPreparedStatement( { name: 'add_question', text : "INSERT INTO codebench.question (asked_user, problem, input, output) VALUES ($1,$2,$3,$4) RETURNING question_id", values: [askedUserId, problem, input, output]}, callback);
}

var AddUserPrepared = function(name, username, password, email, callback) {
	CallPreparedStatement( {name: 'add_user', text: "INSERT INTO codebench.user (username, password, full_name, email) VALUES ($1, crypt($2, gen_salt('bf')), $3, $4) RETURNING user_id", values: [username, password, name, email] }, callback);
}

var CallPreparedStatement = function(statement, callback) {
	pg.connect(settings.connString, function(err, client, done) {
		client.query(statement, function(err, result) {
			done();
			if(err) {
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
exports.SubmissionsForUser = SubmissionsForUser;
exports.SubmissionsForQuestion = SubmissionsForQuestion;
exports.GetQuestionAndSubmissions = GetQuestionAndSubmissions;
