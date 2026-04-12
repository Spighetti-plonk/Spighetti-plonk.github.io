document.addEventListener("DOMContentLoaded", () => {

  const shadow = document.getElementById("shadow");
  
  const btnChat = document.getElementById("btnChat");
  const btnLinks = document.getElementById("btnLinks");
  const btnUpdates = document.getElementById("btnUpdates");

  const mainWindow = document.getElementById("mainWindow");
  const infoWindow = document.getElementById("infoWindow");
  const onlineWindow = document.getElementById("onlineWindow");
  
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
  // TEMPORARY END
  
  // LOGOWANIE
    mainWindow.style.display = "none";
    shadow.style.display ="none";
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
    mainWindow.style.display = "flex";
    setTimeout(() => {
      mainWindow.classList.add("active");
    }, 10);
    shadow.style.display = "block";
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
    mainWindow.style.minHeight = "1400px";
    mainWindow.style.backgroundImage = 'url("images/plink.gif")';
  }
  
  function showUpdates() {
    chatDiv.style.display = "none";
    infoWindow.style.display = "none";
    onlineWindow.style.display = "none";

    mainWindow.classList.add("scrollMode");
    mainWindow.style.minHeight = "1600px";
    mainWindow.style.backgroundImage = 'url("images/plink.gif")';
  }

  function setImageWithFallback(imgElement, src, fallback) {
    imgElement.src = src;

    imgElement.onerror = () => {
      imgElement.src = fallback;
    };
  }

  document.querySelectorAll("img").forEach(img => {
  img.onerror = () => {
    img.src = "images/streachy-bg.png";
  };
  });
  

});
