document.addEventListener('DOMContentLoaded', function () {
    RestoreJSCodeFromCookie();

    window.addEventListener("beforeunload", SaveJSCodeToCookie);

    document.getElementById('save-code').addEventListener('click', SaveJSCodeToCookie);

    document.getElementById('restore-code').addEventListener('click', RestoreJSCodeFromCookie);

    document.getElementById('clear-right-area').addEventListener('click', ClearRightArea);

    document.getElementById('left-textarea').addEventListener('keydown', function (event) {
        if (event.keyCode != 9) {
            return;
        }

        event.preventDefault();

        let obj = this;
        let start = obj.selectionStart;
        let end = obj.selectionEnd;
        let before = obj.value.substring(0, start);
        let after = obj.value.substring(end, obj.value.length);

        obj.value = before + '\t' + after;
        obj.setSelectionRange(start + 1, start + 1);
    });

    document.getElementById('run-code').addEventListener('click', function () {
        let leftTextArea = document.getElementById('left-textarea');
        let rightTextArea = document.getElementById('right-textarea');

        if (leftTextArea.value != '') {
            try {
                ClearRightArea();

                let timeSpent = performance.now();
                let result = eval(leftTextArea.value);

                timeSpent = performance.now() - timeSpent;

                document.getElementById('completion-time').innerHTML = timeSpent.toFixed(3) + 'ms';

                if (result != undefined) {
                    rightTextArea.value += result;
                }
            } catch (error) {
                rightTextArea.value += `Uncaught ${error.name}: ${error.message}.`;
            }
        }
    });

    document.getElementById('clear-left-area').addEventListener('click', function () {
        let answer = confirm('Do you really want to clear the text from the left text area?\nAll your code will be lost!');
        let leftTextArea = document.getElementById('left-textarea');

        if (leftTextArea.value != '') {
            if (answer == true) {
                leftTextArea.value = '';
            }
        }
    });

    document.getElementById('download-code').addEventListener('click', function () {
        let leftTextArea = document.getElementById('left-textarea');

        if (leftTextArea.value != '') {
            let fileContent = leftTextArea.value;
            let fileName = 'JavaScript code.js';
            let fileLink = document.createElement("a");

            fileLink.href = URL.createObjectURL(new Blob([fileContent], {
                type: 'text/javascript'
            }));

            fileLink.download = fileName;
            document.body.appendChild(fileLink);
            fileLink.click();
            document.body.removeChild(fileLink);
        }
    });
});

/**
 * Function saves JS code to cookies from the
 * left text area if it's already don't.
 */
function SaveJSCodeToCookie() {
    let code = document.getElementById('left-textarea').value;

    if (code != getCookie('jscode')) {
        let date = new Date();
        date.setDate(date.getDate() + 365);
        let options = {
            expires: date.toUTCString()
        }

        setCookie('jscode', code, options);
        console.log('Code stored successfully.');
    } else {
        console.log('Code already stored.');
    }
}

/**
 * Function restores JS code from cookies and places 
 * it into left text area if it's not undefined and empty.
 */
function RestoreJSCodeFromCookie() {
    let code = getCookie('jscode');

    if (code != undefined && code != '') {
        document.getElementById('left-textarea').value = code;
        console.log('Code restored successfully.');
    } else {
        console.log('No code found for restore.');
    }
}

/**
 * Function writes given text to the right text area.
 * 
 * @param {any} text 
 */
function write(text) {
    document.getElementById('right-textarea').value += `${text}`;
}

/**
 * Function writes given text to the right text area
 * and after that places the '\n' symbol same way.
 * @param {any} text 
 */
function writeln(text) {
    document.getElementById('right-textarea').value += `${text}\n`;
}

/**
 * Function clears all the text in the right text area if it's not empty.
 * 
 */
function ClearRightArea() {
    let rightTextArea = document.getElementById('right-textarea');

    if (rightTextArea.value != '') {
        rightTextArea.value = '';
    }
}