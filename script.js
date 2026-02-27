document.addEventListener("DOMContentLoaded", () => {
  const loginDiv = document.getElementById("login");
  const chatDiv = document.getElementById("chat");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");

  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send");

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
    e.preventDefault();
    loginBtn.click();
  }
});

  // WYSYŁANIE WIADOMOŚCI
  const sendMessage = () => {
    const text = msgInput.value.trim();
    if (!text) return;

    const div = document.createElement("div");
    div.textContent = currentUser + ": " + text;
    messagesDiv.appendChild(div);

    msgInput.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener("click", sendMessage);

  // ENTER = WYŚLIJ
  msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });
  
function updateUsersOnline() {
  const usersDiv = document.getElementById("usersOnline");
  if (!usersDiv) return; 

  usersDiv.innerHTML = "<b>Online:</b><br>";

  onlineUsers.forEach(user => {
    const div = document.createElement("div");
    div.textContent = user;
    usersDiv.appendChild(div);
  });
}






