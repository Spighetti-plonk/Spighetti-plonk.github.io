document.addEventListener("DOMContentLoaded", () => {

  const btnChat = document.getElementById("btnChat");
  const btnLinks = document.getElementById("btnLinks");
  const btnUpdates = document.getElementById("btnUpdates");

  const mainWindow = document.getElementById("mainWindow");
  const infoWindow = document.getElementById("infoWindow");
  const onlineWindow = document.getElementById("onlineWindow");

  const placeHolder = document.getElementById("placeHolder");
  
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

  // TEMPORARY
  btnChat.addEventListener("click", showChat);
  btnLinks.addEventListener("click", showLinks);
  btnUpdates.addEventListener("click", showUpdates);

  btnLinks.addEventListener("click", () => {
  console.log("LINKS CLICK");
  showLinks();
});

btnUpdates.addEventListener("click", () => {
  console.log("UPDATES CLICK");
  showUpdates();
});
  // TEMPORARY END
  

  // PLACEHOLDER-UKRYWANIE
    placeHolder.style.display = "none";
  
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

  function showChat() {
    chatDiv.style.display = "flex";
    infoWindow.style.display = "flex";
    onlineWindow.style.display = "flex";

    mainWindow.classList.remove("scrollMode");
    mainWindow.style.height = "835px";
    mainWindow.style.backgroundImage = 'url("images/main-window.png")';
  }

  function showLinks() {
    chatDiv.style.display = "none";
    infoWindow.style.display = "none";
    onlineWindow.style.display = "none";

    mainWindow.classList.add("scrollMode");
    mainWindow.style.height = "1400px";
    mainWindow.style.backgroundImage = 'url("images/streachy-bg.png")';
  }
  
  function showUpdates() {
    chatDiv.style.display = "none";
    infoWindow.style.display = "none";
    onlineWindow.syle.display = "none";

    mainWindow.classList.add("scrollMode");
    mainWindow.style.height = "1600px";
    mainWindow.style.backgroundImage = 'url("images/streachy-bg.png")';
  }

  function setImageWithFallback(imgElement, src, fallback) {
    imgElement.src = src;

    imgElement.onerror = () => {
      imgElement.src = fallback;
    };
  }

  document.querySelectorAll("img").forEach(img => {
  img.onerror = () => {
    img.src = "images/placeholder.gif";
  };

});

