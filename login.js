document.getElementById("login-btn").addEventListener("click", () => {
  const ip = document.getElementById("ip").value.trim();
  const key = document.getElementById("key").value.trim();

  if (!ip || !key) {
    alert("Please enter both the server IP and access key.");
    return;
  }

  if (key === "TestVamZaIceMC4") { // Replace with your actual key
    localStorage.setItem("key", key);
    localStorage.setItem("ip", ip);
    window.location.href = "dashboard.html"; // Redirect to dashboard
  } else {
    alert("Invalid Access Key!");
  }
});
