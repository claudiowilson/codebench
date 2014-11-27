$(function() {
    $('.date').html(function() {
        var user = $(this).attr('user');
        var iso = $(this).attr('datetime');
        var date = moment(iso);
        if (moment().diff(date, 'days') >= 7) {
            var rel = 'on ' + date.format('MMMM D');
        } else {
            var rel = date.fromNow();
        }
        return "Submitted " + rel + " by <a class='userlink'>" + user + "</a>";
    });
});
