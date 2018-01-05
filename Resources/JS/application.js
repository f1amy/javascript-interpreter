function write(text) {
    let content = $('#right-textarea').val();
    content += `${text}`;
    $('#right-textarea').val(content);
}

/*
function computeTextareaHeight() {
    let height = $(window).height();
}
*/

function writeln(text) {
    let content = $('#right-textarea').val();
    content += `${text}\n`;
    $('#right-textarea').val(content);
}

function RunJSCode() {
    try {
        ClearRightArea();
        let timeSpent = performance.now();
        let result = eval($('#left-textarea').val());
        timeSpent = performance.now() - timeSpent;
        $('#completion-time').text(timeSpent + 'ms');
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

function ClearRightArea() {
    if ($('#right-textarea').val() != '') {
        $('#right-textarea').val('');
    }
}

function ClearLeftArea() {
    let answer = confirm('Do you really want to clear the text from the left text area?\nAll your code will be lost!');
    if ($('#left-textarea').val() != '') {
        if (answer == true) {
            $('#left-textarea').val('');
            SaveJSCodeToCookie();
        }
    }
}

function DownloadJSCode() {
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

function SaveJSCodeToCookie() {
    if ($('#left-textarea').val() != getCookie('jscode')) {
        let date = new Date();
        date.setDate(date.getDate() + 365);
        let options = {
            expires: date.toUTCString()
        }
        setCookie('jscode', $('#left-textarea').val(), options);
        console.log('Code stored successfully.');
    } else {
        console.log('Code already stored.');
    }
}

function RestoreJSCodeFromCookie() {
    let data = getCookie('jscode');
    if (data != undefined) {
        $('#left-textarea').val(data);
        console.log('Code restored successfully.');
    }
}