let socket;

// DOM Elements
const loginDiv = document.getElementById("login");
const dashboardDiv = document.getElementById("dashboard");
const ipInput = document.getElementById("ip");
const keyInput = document.getElementById("key");
const loginBtn = document.getElementById("login-btn");
const logoutBtn = document.getElementById("logout-btn");
const statusIndicator = document.getElementById("status-indicator");
const consoleOutput = document.getElementById("console-output");
const commandInput = document.getElementById("command-input");
const sendCommandBtn = document.getElementById("send-command-btn");

// Event Listeners
loginBtn.addEventListener("click", authenticate);
logoutBtn.addEventListener("click", logout);
sendCommandBtn.addEventListener("click", sendCommand);

function authenticate() {
  const ip = ipInput.value.trim();
  const key = keyInput.value.trim();

  if (!ip || !key) {
    alert("Please enter both the server IP and access key.");
    return;
  }

  if (key === "TestVamZaIceMC4") { // Replace with your actual key
    localStorage.setItem("key", key);
    localStorage.setItem("ip", ip);
    connectWebSocket(ip);
    showDashboard();
  } else {
    alert("Invalid Access Key!");
  }
}

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
  showLogin();
}

function showDashboard() {
  loginDiv.classList.add("hidden");
  dashboardDiv.classList.remove("hidden");
}

function showLogin() {
  dashboardDiv.classList.add("hidden");
  loginDiv.classList.remove("hidden");
}

// Auto-login if key and IP are stored
window.onload = () => {
  const savedKey = localStorage.getItem("key");
  const savedIP = localStorage.getItem("ip");
  if (savedKey === "TestVamZaIceMC4" && savedIP) {
    connectWebSocket(savedIP);
    showDashboard();
  }
};
