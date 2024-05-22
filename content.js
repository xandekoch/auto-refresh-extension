function checkForTask() {
    console.log("checkForTask")
    runningTime = document.getElementsByClassName('ewok-rater-progress-bar-timer-digital-display')[0];

    return Boolean(runningTime);
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.type === "searchTask") {
        console.log('searchTask');
        var button = document.evaluate('//*[@id="task-index"]/div[2]/ul/li/a', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) {
            console.log("Button found.");
            button.click();
        } else {
            console.error("Button not found.");
        }

        setTimeout(function () {
            const task = checkForTask();
            if (task) {
                console.log('Task Encontrada');
                chrome.runtime.sendMessage({ type: "stop" });
                console.log('stopRefresh');

                var runningTime = document.getElementsByClassName('ewok-rater-progress-bar-timer-digital-display')[0].innerText;
                var runningTimeInSeconds = parseInt(runningTime.split(':')[0]) * 60 + parseInt(runningTime.split(':')[1]);

                var estimatedTimeText = document.getElementsByClassName('ewok-estimated-task-weight')[0].innerText;
                var estimatedTimeInSeconds = parseInt(estimatedTimeText.match(/\d+/)[0]) * 60;


                var remainingTimeInSeconds = estimatedTimeInSeconds - runningTimeInSeconds;

                console.log("Estimated time: " + estimatedTimeInSeconds + " seconds.");
                console.log("Timer time: " + runningTimeInSeconds + " seconds.");
                console.log("Remaining time: " + remainingTimeInSeconds + " seconds.");
                chrome.runtime.sendMessage({ type: "startAudioGet" });

                setTimeout(function () {
                    console.log('esperando pela task');
                    document.getElementById('ewok-task-submit-button').click();
                    chrome.runtime.sendMessage({ type: "startAudioSend" });
                    chrome.runtime.sendMessage({ type: "start" });
                }, remainingTimeInSeconds * 1000);
            } else {
                console.log('Task não Encontrada');
            }
        }, 2000);
    }
});