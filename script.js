document.addEventListener("DOMContentLoaded", () => {

  const btnChat = document.getElementById("btnChat");
  const btnLinks = document.getElementById("btnLinks");
  const btnUpdates = document.getElementById("btnUpdates");

  const mainWindow = document.getElementById("mainWindow");
  const infoWindow = document.getElementById("infoWindow");
  const onlineWindow = document.getElementById("onlineWindow");

  const placeholder = document.getElementById("placeholder");
  
  const loginDiv = document.getElementById("login");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  
  const chatDiv = document.getElementById("chat");
  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send");
  const usersDiv = document.getElementById("usersOnline");

  let currentUser = "";
  const onlineUsers = [];

  // LOGOWANIE
    chatDiv.style.display = "flex";
    msgInput.disabled = true;
    sendBtn.disabled = true;
  
  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (!username) {
      alert("Input username");
      return;
    }

    currentUser = username;

    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }

    loginDiv.style.display = "none";
    chatDiv.style.display = "flex";
    msgInput.disabled = false;
    sendBtn.disabled = false;
    msgInput.focus();
    

    updateUsersOnline();
  });

  usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loginBtn.click();
    }
  });

  // WYSYŁANIE WIADOMOŚCI
 function sendMessage() {
  if (!currentUser) {
    alert("Log in first");
    return;
  }

  const text = msgInput.value.trim();
  if (!text) return;

  const div = document.createElement("div");
  div.textContent = `${currentUser}: ${text}`;
  messagesDiv.appendChild(div);

  msgInput.value = "";
  messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  sendBtn.addEventListener("click", sendMessage);

  msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function updateUsersOnline() {
    usersDiv.innerHTML = "";

    onlineUsers.forEach(user => {
      const div = document.createElement("div");
      div.textContent = user;
      usersDiv.appendChild(div);
    });
  }

});

