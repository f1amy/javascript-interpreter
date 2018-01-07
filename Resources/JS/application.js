$(document).ready(function () {
    RestoreJSCodeFromCookie();

    $(window).on('unload', function () {
        SaveJSCodeToCookie();
    });

    $('#save-code').on('click', function () {
        SaveJSCodeToCookie();
    });

    $('#restore-code').on('click', function () {
        RestoreJSCodeFromCookie();
    });

    $('#clear-right-area').on('click', function () {
        ClearRightArea();
    });

    $('#left-textarea').keydown(function (event) {
        if (event.keyCode != 9) {
            return;
        }

        event.preventDefault();

        let obj = $(this)[0];
        let start = obj.selectionStart;
        let end = obj.selectionEnd;
        let before = obj.value.substring(0, start);
        let after = obj.value.substring(end, obj.value.length);

        obj.value = before + '\t' + after;
        obj.setSelectionRange(start + 1, start + 1);
    });

    $('#run-code').on('click', function () {
        if ($('#left-textarea').val() != '') {
            try {
                ClearRightArea();

                let timeSpent = performance.now();
                let result = eval($('#left-textarea').val());

                timeSpent = performance.now() - timeSpent;

                $('#completion-time').text(timeSpent.toFixed(3) + 'ms');

                if (result != undefined) {
                    let rightAreaContent = $('#right-textarea').val();
                    rightAreaContent += result;
                    $('#right-textarea').val(rightAreaContent);
                }
            } catch (error) {
                let rightAreaContent = $('#right-textarea').val();

                rightAreaContent += `Uncaught ${error.name}: ${error.message}.`;
                $('#right-textarea').val(rightAreaContent);
            }
        }
    });

    $('#clear-left-area').on('click', function () {
        let answer = confirm('Do you really want to clear the text from the left text area?\nAll your code will be lost!');

        if ($('#left-textarea').val() != '') {
            if (answer == true) {
                $('#left-textarea').val('');
                SaveJSCodeToCookie();
            }
        }
    });

    $('#download-code').on('click', function () {
        if ($('#left-textarea').val() != '') {
            let fileContent = $('#left-textarea').val();
            let fileName = 'Your JavaScript code.js';
            let fileLink = window.document.createElement("a");

            fileLink.href = window.URL.createObjectURL(new Blob([fileContent], {
                type: 'text/javascript'
            }));

            fileLink.download = fileName;
            document.body.appendChild(fileLink);
            fileLink.click();
            document.body.removeChild(fileLink);
        }
    });
});

function SaveJSCodeToCookie() {
    let code = $('#left-textarea').val();

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

function RestoreJSCodeFromCookie() {
    let code = getCookie('jscode');

    if (code != undefined && code != '') {
        $('#left-textarea').val(code);
        console.log('Code restored successfully.');
    } else {
        console.log('No code found for restore.');
    }
}

function write(text) {
    let code = $('#right-textarea').val();

    code += `${text}`;
    $('#right-textarea').val(code);
}

function writeln(text) {
    let code = $('#right-textarea').val();

    code += `${text}\n`;
    $('#right-textarea').val(code);
}

function ClearRightArea() {
    if ($('#right-textarea').val() != '') {
        $('#right-textarea').val('');
    }
}