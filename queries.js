var AddUser = function(username, password, client, callback) {
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = 'INSERT INTO codebench.user (username, password) VALUES (' + "'" + username + "'" +", '" + password + "')";
            client.query(query, function(err, result) {
                if(err) {
                	callback(new Error('Error adding user: ' + err));
                } else {
                	client.end();
                	callback(null, result);
                }
            });
		}
	})
}

var AddQuestion = function(row, client, callback) {
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = 'INSERT INTO codebench.question (asked_user, problem, input, output, upvotes, downvotes)' +
			' VALUES (' + row['askedUser'] +',' + row['problem'] + ',' + row['input'] + ',' + row['output'] + ',' +
			row['upvotes'] + ',' + row['downvotes'] +')';
			client.query(query, function(err, result) {
				if(err) {
					callback(new Error('Error adding questions: ' + err));
				} else {
					client.end();
					callback(null, result);
				}
			});
		}
	})
}

var AddSubmission = function(row, client, callback) {
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = 'INSERT INTO codebench.submission (submitted_user, question, code, result)' +
			' VALUES({0},{1},{2},{3})'.format(row['submittedUser'], row['question'], row['code'], row['result']);
			client.query(query, function(err, result) {
				if(err) {
					callback(new Error('Error adding submission: ' + err));
				} else {
					client.end();
					callback(null, result);
				}
			});
		}
	});
}

var LoginUser = function(username, password, client, callback) {
	client.connect(function(err) {
		if(err) { console.log(err); }
		else {
			var query = 'SELECT username, password FROM codebench.user WHERE username=' + "'" + username + "'";
			client.query(query, function(err, result) {
				if(err) {
					callback(new Error('Error logging on: ' + err));
				} else {
					if(result.rows[0].password != password) {
						callback(new Error('Invalid Password!'));
					} else {
						callback(null, result.rows[0]);
					}
				}
			});
		}
	});
}

exports.AddUser = AddUser;
exports.AddQuestion = AddQuestion;
exports.AddSubmission = AddSubmission;
exports.LoginUser = LoginUser;