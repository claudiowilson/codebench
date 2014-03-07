function toggleUpGeneral(container, id, route) {
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
        $.post(route + id + "/1");
    } else {
        $(upThumb).attr('src', '/thumbs-up.png');
        $(votes).text(parseInt($(votes).text()) - 1);
        $.post(route + id + "/0");
    }
}

function toggleDownGeneral(container, id, route) {
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
        $.post("" + route + id + "/-1");
    } else {
        $(downThumb).attr('src', '/thumbs-down.png');
        $(votes).text(parseInt($(votes).text()) + 1);
        $.post("" + route + id + "/0");
    }
}

function toggleQuestionUp(container, qid) {
    toggleUpGeneral(container, qid, "/SetQVote/");
}
function toggleQuestionDown(container, qid) {
    toggleDownGeneral(container, qid, "/SetQVote/");
}

function toggleSubmissionUp(container, sid) {
    toggleUpGeneral(container, sid, "/SetSVote/");
}
function toggleSubmissionDown(container, sid) {
    toggleDownGeneral(container, sid, "/SetSVote/");
}
