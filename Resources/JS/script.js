function write(text) {
    document.getElementById("right-textarea").value += `${text}`;
}

function writeln(text) {
    document.getElementById("right-textarea").value += `${text}\n`;
}

function RunJSCode() {
    try {
        ClearRightArea();
        let timeSpent = performance.now();
        let result = eval(document.getElementById("left-textarea").value);
        timeSpent = performance.now() - timeSpent;
        document.getElementById("completion-time").innerHTML = timeSpent + 'ms';
        if (result != undefined) {
            document.getElementById("right-textarea").value += result;
        }
    } catch (error) {
        document.getElementById("right-textarea").value += `Uncaught ${error.name}: ${error.message}.`;
    }
}

function ClearRightArea() {
    document.getElementById("right-textarea").value = '';
}

function ClearLeftArea() {
    let answer = confirm('Do you really want to clear the text from the left text area?\nAll your code will be lost!');
    if (answer == true) {
        document.getElementById("left-textarea").value = '';
        SaveJSCodeToCookie();
    }
}

function DownloadJSCode() {
    let fileContent = document.getElementById("left-textarea").value;
    let fileName = 'script.js';

    var fileLink = window.document.createElement("a");
    fileLink.href = window.URL.createObjectURL(new Blob([fileContent], {type: 'text/plain'}));
    fileLink.download = fileName;
    document.body.appendChild(fileLink);
    fileLink.click();
    document.body.removeChild(fileLink);
}

function SaveJSCodeToCookie() {
    let date = new Date();
    date.setDate(date.getDate() + 365);
    let options = {
        expires : date.toUTCString()
    }
    setCookie('jscode', document.getElementById("left-textarea").value, options);
}

function RestoreJSCodeFromCookie() {
    let data = getCookie('jscode');
	if (data != undefined) {
		document.getElementById("left-textarea").value = data;
	}
}