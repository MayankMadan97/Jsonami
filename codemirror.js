let editor = CodeMirror.fromTextArea(document.getElementById("editor"), {
    name: "javascript",
    json: true,
    lineNumbers: true,
    smartIndent: false,
    tabSize: 2,
    indentUnit: 4,
    lineWrapping: true,
    readOnly: false,
    matchBrackets: true,
    autoCloseBrackets: true,
    styleActiveLine: true,
    extraKeys: { "Ctrl-Space": "autocomplete" },
    viewportMargin: Infinity,
    scrollbarStyle: "overlay",
    theme: "material",
    nonEmpty: true,
});
editor.setSize("100%", "85vh");
