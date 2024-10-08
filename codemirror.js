
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
    let jsonStatusPopup = document.getElementById("json-status");
    jsonStatusPopup.style.opacity = 1;
    if (cm.getValue() === "") {
        jsonStatusPopup.innerText = "Empty JSON";
    }
    else if (isJsonString(cm.getValue())) {
        jsonStatusPopup.innerText = "Valid JSON";
        jsonStatusPopup.classList.remove("invalid");
        jsonStatusPopup.classList.add("valid");
        document.getElementById("branding").remove();
        let jsonObject = JSON.parse(cm.getValue());
        let uniqueKeys = extractUniqueKeysWithIndentation(jsonObject);
        let htmlToInsert = '';
        for (let i in uniqueKeys) {
            htmlToInsert += `<li class="d-flex" id="list-item"><pre class="my-auto">${uniqueKeys[i]}</pre></li>`
        }
        const select = document.querySelector('#items-list')
        select.innerHTML = '';
        select.insertAdjacentHTML('beforeend', htmlToInsert)
    } else {
        jsonStatusPopup.innerText = "Invalid JSON";
        jsonStatusPopup.classList.remove("valid");
        jsonStatusPopup.classList.add("invalid");
    }
    setTimeout(() => {
        jsonStatusPopup.style.transition = "opacity 0.5s ease";
        jsonStatusPopup.style.opacity = 0;
    }, 1000);
});

editor.on('beforeChange', function (cm, change) {
    var jsonString = editor.getValue();
    var selection = editor.getSelection();

    // Check if the whole JSON is selected and deleted
    if (selection === jsonString && change.origin === '+delete') {
        const parent = document.getElementById("items-list")
        while (parent.firstChild) {
            parent.firstChild.remove()
        }
    }
});

function extractUniqueKeysWithIndentation(json) {
    let uniqueKeys = {};
    function traverse(obj, indent) {
        for (let key in obj) {
            if (Array.isArray(obj)) {
                // Skip the keys for array elements
                traverse(obj[key], indent);
            } else {
                let formattedKey = indent + key;
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

function isJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}