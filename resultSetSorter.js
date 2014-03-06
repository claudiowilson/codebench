//GetSubmissionsAndCodeForQuestion sorter
var SortCodeAndSubmissionsBySubmissions = function(queryResultRows) {
	var result = [];
	var prevSubIdResult = -1;
	var resultIdx = -1;
		
	for(var i = 0; i < queryResultRows.length; i++) {
		var res = queryResultRows[i];
		if(res.submission_id != prevSubIdResult) {
			resultIdx++;
			result[resultIdx] = { username: res.username,
								errors : res.errors,
								language : res.language,
								classes : [ {name : res.class_name, code: res.code}],
								submission_id : res.submission_id,
								time_taken : res.time_taken};
			prevSubIdResult = res.submission_id;
		} else {
			result[resultIdx].classes.push({name : res.class_name, code: res.code});
		}
	}
	return result;
}

exports.SortCodeResults = SortCodeAndSubmissionsBySubmissions;
