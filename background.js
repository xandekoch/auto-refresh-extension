let countdownIntervalId;
let countdownNumber;
let intervalId;
let refreshInterval = 6000;
let isAutomationRunning = false;

// Função para iniciar a automação
function startAutomation() {
    if (!isAutomationRunning) {
        isAutomationRunning = true;
        // Inicia o intervalo para atualizar a página periodicamente
        intervalId = setInterval(refreshPage, refreshInterval); // Atualiza a página a cada refreshInterval milissegundos
        startCountdown(); // Reinicia o temporizador até o próximo refresh
    }
}

// Função para parar a automação
function stopAutomation() {
    clearInterval(countdownIntervalId);
    clearInterval(intervalId);
    isAutomationRunning = false;
}

// Função para iniciar o temporizador até o próximo refresh
function startCountdown() {
    if (countdownIntervalId) {
        clearInterval(countdownIntervalId);
    }
    countdownNumber = refreshInterval / 1000;
    countdownIntervalId = setInterval(() => {
        countdownNumber--;
        if (countdownNumber <= 0) {
            clearInterval(countdownIntervalId);
        }
        updateBadge(); // Atualiza o distintivo do ícone da extensão com a contagem regressiva
    }, 1000); // Atualiza a contagem a cada segundo
}

// Função para atualizar o distintivo do ícone da extensão com a contagem regressiva
function updateBadge() {
    chrome.action.setBadgeText({ text: countdownNumber.toString() }); // Define o texto do distintivo do ícone da extensão
}

// Função para atualizar a página
function refreshPage() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs.length > 0) {
            console.log('BGrefresh')
            chrome.tabs.reload(tabs[0].id);
            searchTask();
        }
    });
    startCountdown(); // Reinicia o temporizador até o próximo refresh
}

// Função para iniciar ou parar a busca de tarefas
function searchTask() {
    console.log('BGsearchTask');
    setTimeout(function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            console.log('BGsendMessage');
            chrome.tabs.sendMessage(tabs[0].id, { type: "searchTask" });
        });
    }, 1500);
}

async function playSound(source, volume = 1) {
    await createOffscreen();
    await chrome.runtime.sendMessage({ play: { source, volume } });
}

// Create the offscreen document if it doesn't already exist
async function createOffscreen() {
    if (await chrome.offscreen.hasDocument()) return;
    await chrome.offscreen.createDocument({
        url: 'offscreen.html',
        reasons: ['AUDIO_PLAYBACK'],
        justification: 'testing'
    });
}

// Listener para as mensagens enviadas pelo content.js
chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === 'startAudioGet') {
        playSound('notification.mp3');
    } else if (request.type === 'startAudioSend') {
        playSound('notificationSend.mp3');
    }
});

// Listener para as Hotkeys
chrome.commands.onCommand.addListener(function (command) {
    if (command === 'toggle-automation') {
        if (isAutomationRunning) {
            stopAutomation();
        } else {
            startAutomation();
        }
    }
});

// Listener para as mensagens enviadas pelo popup.js
chrome.runtime.onMessage.addListener(function (request) {
    if (request.type === "start") {
        startAutomation();
    } else if (request.type === "stop") {
        stopAutomation();
    }
});