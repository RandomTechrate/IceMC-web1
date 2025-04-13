let socket;

// DOM Elements
const statusIndicator = document.getElementById("status-indicator");
const consoleOutput = document.getElementById("console-output");
const commandInput = document.getElementById("command-input");
const sendCommandBtn = document.getElementById("send-command-btn");
const logoutBtn = document.getElementById("logout-btn");

// Event Listeners
sendCommandBtn.addEventListener("click", sendCommand);
logoutBtn.addEventListener("click", logout);

window.onload = () => {
  const savedKey = localStorage.getItem("key");
  const savedIP = localStorage.getItem("ip");

  if (!savedKey || !savedIP) {
    alert("You are not logged in. Redirecting to login page.");
    window.location.href = "index.html";
    return;
  }

  if (savedKey === "TestVamZaIceMC4") { // Replace with your actual key
    connectWebSocket(savedIP);
  } else {
    alert("Invalid credentials. Redirecting to login page.");
    window.location.href = "index.html";
  }
};

function connectWebSocket(serverIP) {
  console.log("Connecting to WebSocket:", serverIP); // Debugging
  socket = new WebSocket(serverIP);

  socket.onopen = () => {
    console.log("WebSocket connection opened."); // Debugging
    updateStatus("online");
    logConsole("Connected to the server.");
  };

  socket.onmessage = (event) => {
    console.log("Message from server:", event.data); // Debugging
    logConsole(event.data);
  };

  socket.onclose = () => {
    console.log("WebSocket connection closed."); // Debugging
    updateStatus("offline");
    logConsole("Disconnected from the server.");
  };

  socket.onerror = (error) => {
    console.error("WebSocket error:", error); // Debugging
    updateStatus("offline");
    logConsole("Error: " + error.message);
  };
}

function sendCommand() {
  const command = commandInput.value.trim();
  if (command && socket && socket.readyState === WebSocket.OPEN) {
    socket.send(`command:${command}`);
    logConsole(`You: ${command}`);
    commandInput.value = "";
  } else {
    logConsole("Unable to send command. Check connection.");
  }
}

function logConsole(message) {
  const timestamp = new Date().toLocaleTimeString();
  consoleOutput.value += `[${timestamp}] ${message}\n`;
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function updateStatus(status) {
  if (status === "online") {
    statusIndicator.className = "status-circle online";
  } else {
    statusIndicator.className = "status-circle offline";
  }
}

function logout() {
  localStorage.removeItem("key");
  localStorage.removeItem("ip");
  socket && socket.close();
  window.location.href = "index.html";
}
