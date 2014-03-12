var img_up = '/img/thumbs-up.png';
var img_down = '/img/thumbs-down.png';
var img_up_active = '/img/thumbs-up-good.png';
var img_down_active = '/img/thumbs-down-bad.png';

function toggleUpGeneral(container, id, route) {
    upThumb = $(container).find('.thumbsup');
    downThumb = $(container).find('.thumbsdown');
    votes = $(container).find('.votes');
    upvotes = $(container).find('.upvotes');
    downvotes = $(container).find('.downvotes');
    imagepath = $(upThumb).attr('src');

    if (imagepath == img_up) {
        if ($(downThumb).attr('src') == img_down_active) {
            $(downThumb).attr('src', img_down);
            $(votes).text(parseInt($(votes).text()) + 1);
            $(downvotes).text(parseInt($(downvotes).text()) - 1);
        }
        $(upThumb).attr('src', img_up_active);
        $(votes).text(parseInt($(votes).text()) + 1);
        $(upvotes).text(parseInt($(upvotes).text()) + 1);
        $.post(route + id + "/1");
    } else {
        $(upThumb).attr('src', img_up);
        $(votes).text(parseInt($(votes).text()) - 1);
        $(upvotes).text(parseInt($(upvotes).text()) - 1);
        $.post(route + id + "/0");
    }
}

function toggleDownGeneral(container, id, route) {
    upThumb = $(container).find('.thumbsup');
    downThumb = $(container).find('.thumbsdown');
    votes = $(container).find('.votes');
    upvotes = $(container).find('.upvotes');
    downvotes = $(container).find('.downvotes');
    imagepath = $(downThumb).attr('src');

    if (imagepath == img_down) {
        if ($(upThumb).attr('src') == img_up_active) {
            $(upThumb).attr('src', img_up);
            $(votes).text(parseInt($(votes).text()) - 1);
            $(upvotes).text(parseInt($(upvotes).text()) - 1);
        }
        $(downThumb).attr('src', img_down_active);
        $(votes).text(parseInt($(votes).text()) - 1);
        $(downvotes).text(parseInt($(downvotes).text()) + 1);
        $.post("" + route + id + "/-1");
    } else {
        $(downThumb).attr('src', img_down);
        $(votes).text(parseInt($(votes).text()) + 1);
        $(downvotes).text(parseInt($(downvotes).text()) - 1);
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
