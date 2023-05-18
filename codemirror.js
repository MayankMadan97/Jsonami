
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
    viewportMargin: Infinity,
    scrollbarStyle: "overlay",
    theme: "material",
    nonEmpty: true
});
editor.setSize("100%", "85vh");
editor.on('change', function (cm, changeObj) {
    var jsonObject = JSON.parse(cm.getValue());
    var uniqueKeys = extractUniqueKeysWithIndentation(jsonObject);
    let htmlToInsert = '';
    for (let i = 0; i < uniqueKeys.length; i++) {
        htmlToInsert += `<li class="d-flex"><input type="checkbox" class="mx-2" /><pre class="my-auto">${uniqueKeys[i]}</pre></li>`
    }
    const select = document.querySelector('#items-list')
    select.insertAdjacentHTML('beforeend', htmlToInsert)
    initiateDragList();
});

function extractUniqueKeysWithIndentation(json) {
    var uniqueKeys = {};

    function traverse(obj, indent) {
        for (var key in obj) {
            if (Array.isArray(obj)) {
                // Skip the keys for array elements
                traverse(obj[key], indent);
            } else {
                var formattedKey = indent + key;

                if (!uniqueKeys.hasOwnProperty(formattedKey)) {
                    uniqueKeys[formattedKey] = true;
                }

                if (typeof obj[key] === 'object' && obj[key] !== null) {
                    traverse(obj[key], indent + '  ');
                }
            }
        }
    }

    traverse(json, '');

    return Object.keys(uniqueKeys);
}