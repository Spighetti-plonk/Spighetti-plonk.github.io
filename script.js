document.addEventListener("DOMContentLoaded", () => {

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
  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();
    if (!username) {
      alert("Podaj nazwę");
      return;
    }

    currentUser = username;

    if (!onlineUsers.includes(username)) {
      onlineUsers.push(username);
    }

    loginDiv.style.display = "none";
    chatDiv.style.display = "flex";

    updateUsersOnline();
  });

  usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      loginBtn.click();
    }
  });

  // WYSYŁANIE WIADOMOŚCI
  function sendMessage() {
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

