document.getElementById("startButton").addEventListener("click", function () {
    chrome.runtime.sendMessage({
        type: "start"
    });
});

document.getElementById("stopButton").addEventListener("click", function () {
    chrome.runtime.sendMessage({
        type: "stop"
    });
});