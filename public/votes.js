function toggleUpGeneral(container, id, curr_vote, route) {
    upThumb = $(container).children('.thumbsup');
    downThumb = $(container).children('.thumbsdown');
    votes = $(container).children('.votes');
    imagepath = $(upThumb).attr('src');

    if (imagepath == '/thumbs-up.png') {
        if ($(downThumb).attr('src') == '/thumbs-down-bad.png') {
            $(downThumb).attr('src', '/thumbs-down.png');
            $(votes).text(parseInt($(votes).text()) + 1);
        }
        $(upThumb).attr('src', '/thumbs-up-good.png');
        $(votes).text(parseInt($(votes).text()) + 1);
        $.post(route + id + "/" + (curr_vote ? curr_vote : 0) + "/1");
    } else {
        $(upThumb).attr('src', '/thumbs-up.png');
        $(votes).text(parseInt($(votes).text()) - 1);
        $.post(route + id + "/" + (curr_vote ? curr_vote : 0) + "/0");
    }
}

function toggleDownGeneral(container, id, curr_vote, route) {
    upThumb = $(container).children('.thumbsup');
    downThumb = $(container).children('.thumbsdown');
    votes = $(container).children('.votes');
    imagepath = $(downThumb).attr('src');

    if (imagepath == '/thumbs-down.png') {
        if ($(upThumb).attr('src') == '/thumbs-up-good.png') {
            $(upThumb).attr('src', '/thumbs-up.png');
            $(votes).text(parseInt($(votes).text()) - 1);
        }
        $(downThumb).attr('src', '/thumbs-down-bad.png');
        $(votes).text(parseInt($(votes).text()) - 1);
        $.post("" + route + id + "/" + (curr_vote ? curr_vote : 0) + "/-1");
    } else {
        $(downThumb).attr('src', '/thumbs-down.png');
        $(votes).text(parseInt($(votes).text()) + 1);
        $.post("" + route + id + "/" + (curr_vote ? curr_vote : 0) + "/0");
    }
}

function toggleQuestionUp(container, qid, curr_vote) {
    toggleUpGeneral(container, qid, curr_vote, "/SetQVote/");
}
function toggleQuestionDown(container, qid, curr_vote) {
    toggleDownGeneral(container, qid, curr_vote, "/SetQVote/");
}

function toggleSubmissionUp(container, sid, curr_vote) {
    toggleUpGeneral(container, sid, curr_vote, "/SetSVote/");
}
function toggleSubmissionDown(container, sid, curr_vote) {
    toggleDownGeneral(container, sid, curr_vote, "/SetSVote/");
}
