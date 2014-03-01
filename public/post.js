var editor = ace.edit("editor");
var JavaMode = require("ace/mode/java").Mode;
var PythonMode = require("ace/mode/python").Mode;
editor.getSession().setMode(new JavaMode());
editor.setTheme("ace/theme/eclipse");
var codeInput = $(".ace_text-input")[0];
document.getElementById("solution").value = editor.getValue();

$("#javaSelector")[0].onclick = function() {
  editor.getSession().setMode(new JavaMode());
  editor.getSession().setValue("public static void main(String[] args){\n  // code away!\n}");
  document.getElementById("solution").value = editor.getValue();
};

$("#pythonSelector")[0].onclick = function() {
  editor.getSession().setMode(new PythonMode());
  editor.getSession().setValue("");
  document.getElementById("solution").value = editor.getValue();
};

$("#submit")[0].onclick = function() {
  document.getElementById("solution").value = editor.getValue();
};
