"use strict";

document.addEventListener("DOMContentLoaded", function() {
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

        const object = this;
        const start = object.selectionStart;
        const end = object.selectionEnd;
        const before = object.value.substring(0, start);
        const after = object.value.substring(end, object.value.length);

        object.value = before + "\t" + after;
        object.setSelectionRange(start + 1, start + 1);
    };

    document.getElementById("run-code").onclick = function() {
        const leftTextArea = document.getElementById("left-textarea");
        let rightTextArea = document.getElementById("right-textarea");

        if (leftTextArea.value !== "") {
            try {
                clearRightArea();

                let timeSpent = performance.now();
                const result = eval(leftTextArea.value);

                timeSpent = performance.now() - timeSpent;

                document.getElementById("completion-time").innerHTML =
                    timeSpent.toFixed(3) + "ms";

                if (result !== undefined) {
                    rightTextArea.value += result;
                }
            } catch (Exception) {
                rightTextArea.value += `Uncaught ${Exception.name}: ${
                    Exception.message
                }.`;
            }
        }
    };

    document.getElementById("clear-left-area").onclick = function() {
        const answer = !!confirm(
            "Do you really want to clear the text from the " +
                "left text area?\nAll your code will be lost!"
        );

        if (answer === true) {
            document.getElementById("left-textarea").value = "";
        }
    };

    document.getElementById("download-code").onclick = function() {
        const leftTextArea = document.getElementById("left-textarea");

        if (leftTextArea.value !== "") {
            const fileContent = leftTextArea.value;
            const fileName = "Your JavaScript code.js";
            let fileLink = document.createElement("a");

            fileLink.href = URL.createObjectURL(
                new Blob([fileContent], {
                    type: "text/javascript"
                })
            );

            fileLink.download = fileName;
            fileLink.click();
        }
    };
});

function storeJSCode() {
    const code = document.getElementById("left-textarea").value;

    if (code !== localStorage.getItem("jscode")) {
        localStorage.setItem("jscode", code);

        console.log("Code stored successfully.");
    } else {
        console.log("Code already stored.");
    }
}

function restoreJSCode() {
    const code = localStorage.getItem("jscode");

    if (code !== undefined && code !== "") {
        document.getElementById("left-textarea").value = code;

        console.log("Code restored successfully.");
    } else {
        console.log("No code found for restore.");
    }
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
