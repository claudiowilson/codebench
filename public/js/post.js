var numClasses = 1;
var editors = [];
var JavaMode = require("ace/mode/java").Mode;
var PythonMode = require("ace/mode/python").Mode;
var CCPPMode = require("ace/mode/c_cpp").Mode;

function addEditor(){
    current_i = editors.length;
    editors[current_i] = ace.edit("editor" + current_i);
    editors[current_i].getSession().setMode(new JavaMode());
    editors[current_i].setTheme("ace/theme/eclipse");
    editors[current_i].on("input", function() {
        $("#submit").hide();
    });
}

var addClassFunc = function() {
    $(this).attr('id', numClasses);
    $('#' + numClasses)[0].onclick = null;
    $(this).removeAttr('id');
    $(this).attr('data-toggle', 'tab');
    $(this).attr('href', '#' + numClasses);
    $(this)[0].innerHTML = '<input class="form-control" name="file-' + numClasses + '"></input>';
    $('#response_tabs').append('<li><a id="addClass" href="#' + numClasses + '", data-toggle="tab">+</a></li>');
    $('#content.tab-content').append('<div id="' + numClasses + '" class="tab-pane"><textarea id="sol-' + numClasses + '" name="' + numClasses + '"class="form-control solution"></textarea><div class="editor form-control" id="editor' + numClasses + '"></div></div>');
    addEditor();
    $('#addClass')[0].onclick = addClassFunc;
    $('#classes').val(numClasses + 1);
    numClasses++;
}

$('#solution').tabby();
$('#addClass')[0].onclick = addClassFunc;

$("#cSelector")[0].onclick = function() {
    for(var i = 0; i < editors.length; i++){
        editors[i].getSession().setMode(new CCPPMode());
        editors[i].getSession().setValue("");
        $("#language").val("c");
        $("#submit").hide();
    }
};

$("#javaSelector")[0].onclick = function() {
    for(var i = 0; i < editors.length; i++){
        editors[i].getSession().setMode(new JavaMode());
        editors[i].getSession().setValue("import java.util.*;\n\npublic class Main {\n\tpublic static void main(String[] args){\n\t\t// code away!\n\t}\n}");
        $("#language").val("java");
        $("#submit").hide();
    }
};

$("#pythonSelector")[0].onclick = function() {
    for(var i = 0; i < editors.length; i++){
        editors[i].getSession().setMode(new PythonMode());
        editors[i].getSession().setValue("");
        $("#language").val("python");
        $("#submit").hide();
    }
};

$("#submissionForm").submit(function(e) {
    $.ajax({
        type: "POST",
        url: "/submitSolution",
        data: $("#submissionForm").serialize(),
        success: function(data)
        {
            if (data.result) {
                $("#preview").html("<p>"+data.result+"<\p>");                
                $("#submit").show();
            } else {
                window.location = data;
            }
        },
        failure: function()
        {
        },
        complete: function()
        {
        }
    });

    e.preventDefault();
});

$("#compile")[0].onclick = function() {
    $("#submitVal").val("compile");
    for(var i = 0; i < editors.length; i++) {
        document.getElementById("sol-" + i).value = editors[i].getValue();
    }
};

$("#submit")[0].onclick = function() {
    $("#submitVal").val("submit");
    for(var i = 0; i < editors.length; i++) {
        document.getElementById("sol-" + i).value = editors[i].getValue();
    }
};

$(".nav.nav-tabs").on("click", "a", function(e){
    e.preventDefault();
    $(this).tab('show');
});

addEditor();
$("#submit").hide();
