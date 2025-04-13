let socket;

function connectWebSocket() {
    const urlParams = new URLSearchParams(window.location.search);
    const websocketURL = urlParams.get("websocket-url");

    if (!websocketURL) {
        alert("WebSocket URL is missing!");
        return;
    }

    console.log("Connecting to WebSocket: " + websocketURL);

    socket = new WebSocket(websocketURL);

    socket.onopen = () => {
        console.log("WebSocket connection established.");
        updateStatus("online");
        logConsole("Connected to the server.");
    };

    socket.onmessage = (event) => {
        console.log("Message from server: " + event.data);

        if (event.data.startsWith("status:")) {
            const status = event.data.split(":")[1].trim();
            updateStatus(status);
        } else {
            logConsole(event.data);
        }
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed.");
        updateStatus("offline");
        logConsole("Disconnected from the server.");
    };

    socket.onerror = (error) => {
        console.error("WebSocket error:", error);
        updateStatus("error");
        logConsole("Error: Unable to connect to WebSocket.");
    };
}

function updateStatus(status) {
    const statusElement = document.getElementById("status");
    if (status === "online") {
        statusElement.textContent = "Server Status: Online";
        statusElement.style.color = "green";
    } else if (status === "offline") {
        statusElement.textContent = "Server Status: Offline";
        statusElement.style.color = "red";
    } else if (status === "error") {
        statusElement.textContent = "Server Status: Error";
        statusElement.style.color = "orange";
    }
}

function logConsole(message) {
    const logElement = document.getElementById("log");
    const logMessage = document.createElement("div");
    logMessage.textContent = message;
    logElement.appendChild(logMessage);
    logElement.scrollTop = logElement.scrollHeight; // Auto-scroll to the bottom
}

window.onload = connectWebSocket;
