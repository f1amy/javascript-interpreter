"use strict";

function storeJSCode() {
    localStorage.setItem(
        "jsCode",
        encodeURIComponent(document.getElementById("left-textarea").value)
    );
}

function restoreJSCode() {
    document.getElementById("left-textarea").value = decodeURIComponent(
        localStorage.getItem("jsCode") || ""
    );
}

function write(text) {
    document.getElementById("right-textarea").value += text;
}

function writeln(text) {
    document.getElementById("right-textarea").value += `${text}\n`;
}

function clearRightArea() {
    document.getElementById("right-textarea").value = "";
}

restoreJSCode();
window.onbeforeunload = storeJSCode;
document.getElementById("save-code").onclick = storeJSCode;
document.getElementById("restore-code").onclick = restoreJSCode;
document.getElementById("clear-right-area").onclick = clearRightArea;

document.getElementById("left-textarea").onkeydown = function(event) {
    if (event.keyCode !== 9) {
        return;
    }

    event.preventDefault();

    const start = this.selectionStart;

    this.value =
        this.value.substring(0, start) +
        "\t" +
        this.value.substring(this.selectionEnd, this.value.length);
    this.setSelectionRange(start + 1, start + 1);
};

document.getElementById("run-code").onclick = function() {
    clearRightArea();

    let returnedValue;
    let timeSpent = performance.now();

    try {
        returnedValue = eval(document.getElementById("left-textarea").value);
    } catch (exception) {
        returnedValue = `Uncaught ${exception.name}: ${exception.message}.`;
    }

    timeSpent = performance.now() - timeSpent;
    document.getElementById("completion-time").innerHTML =
        timeSpent.toFixed(3) + "ms";
    document.getElementById("right-textarea").value += returnedValue;
};

document.getElementById("clear-left-area").onclick = function() {
    const answer = !!confirm(
        "Do you really want to clear the text from the " +
            "left text area?\nAll your code will be lost!"
    );

    if (answer) {
        document.getElementById("left-textarea").value = "";
    }
};

document.getElementById("download-code").onclick = function() {
    let fileLink = window.document.createElement("a");

    fileLink.href = window.URL.createObjectURL(
        new Blob([document.getElementById("left-textarea").value], {
            type: "text/javascript"
        })
    );

    fileLink.download = "JavaScript code.js";
    document.body.appendChild(fileLink);
    fileLink.click();
    document.body.removeChild(fileLink);
};
