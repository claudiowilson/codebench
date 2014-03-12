$(".nav.nav-tabs").on("click", "a", function(e) {
    e.preventDefault();
    $(this).tab('show');
});

$("a[href='#1']").on('show.bs.tab', function(e) {
    $('#top').html('');
    $.get('/questionlist', {sort: 'top'}, function(data) {
        $('#top').html(data);
    });
});

$("a[href='#2']").on('show.bs.tab', function(e) {
    $('#date').html('');
    $.get('/questionlist', {sort: 'newest'}, function(data) {
        $('#date').html(data);
    });
});

$.get('/questionlist',function(data) {
    $('#top').html(data);
});
