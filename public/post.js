var editors = [];
var JavaMode = require("ace/mode/java").Mode;
var PythonMode = require("ace/mode/python").Mode;
addEditor();

function addEditor(){
  current_i = editors.length;
  editors[current_i] = ace.edit("editor" + current_i);
  editors[current_i].getSession().setMode(new JavaMode());
  editors[current_i].setTheme("ace/theme/eclipse");
}

$("#javaSelector")[0].onclick = function() {
  for(var i = 0; i < editors.length; i++){
    editors[i].getSession().setMode(new JavaMode());
    editors[i].getSession().setValue("import java.util.*;\n\npublic class Main {\n\tpublic static void main(String[] args){\n\t\t// code away!\n\t}\n}");
  }
};

$("#pythonSelector")[0].onclick = function() {
  for(var i = 0; i < editors.length; i++){
    editors[i].getSession().setMode(new PythonMode());
    editors[i].getSession().setValue("");
  }
};

$("#submit")[0].onclick = function() {
  document.getElementById("sol-0").value = editors[0].getValue();
};
