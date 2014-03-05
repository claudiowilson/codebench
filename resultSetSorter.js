//GetSubmissionsAndCodeForQuestion sorter
var SortCodeAndSubmissionsBySubmissions = function(queryResultRows) {
	var result = [];
	var prevSubIdResult = -1;
	var resultIdx = 0;
	for(var i = 0; i < queryResultRows.length; i++) {
		var res = queryResultRows[i];
		if(res.submission_id != prevSubIdResult) {
			result[resultIdx] = { username: res.username,
								errors : res.errors,
								language : res.language,
								code : [ {class : res.class_name, code: res.code}],
								submission_id : res.submission_id};
			prevSubIdResult = res.submission_id;
			resultIdx++;
		} else {
			result[resultIdx - 1].code.push({class : res.class_name, code: res.code});
		}
	}
	return result;
}

exports.SortCodeResults = SortCodeAndSubmissionsBySubmissions;