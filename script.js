// 🔹 script.js — czat z heartbeat, Enter, lista online i dynamiczne tło czatu
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  onChildAdded,
  onValue
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Konfiguracja Firebase — wstaw swoje dane
const firebaseConfig = {
  apiKey: "AIzaSyCnVI_9ZNNcvShNvgYHYierdePN_p5r3kw",
  authDomain: "test-strona-2a2f2.firebaseapp.com",
  databaseURL: "https://test-strona-2a2f2-default-rtdb.firebaseio.com",
  projectId: "test-strona-2a2f2"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", () => {
  // ---- elementy DOM
  const loginDiv = document.getElementById("login");
  const chatDiv = document.getElementById("chat");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const error = document.getElementById("error");

  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send");
  const usersOnlineDiv = document.getElementById("usersOnline");

  // ---- pole PNG dla tła czatu
  const styleInput = document.getElementById("styleInput");

  const messagesRef = ref(db, "messages");
  const usersRef = ref(db, "users");

  let currentUserRef = null;
  let heartbeatInterval = null;

  // ---- logowanie
  const login = async () => {
    const username = usernameInput.value.trim();
    error.textContent = "";

    if (!username) {
      error.textContent = "Podaj nazwę użytkownika";
      return;
    }

    currentUserRef = ref(db, "users/" + username);
    const userSnap = await get(currentUserRef);

    // blokada nazw tylko dla osób aktywnych w ostatnich 5 sekund
    if (userSnap.exists() && userSnap.val().lastSeen && (Date.now() - userSnap.val().lastSeen < 5000)) {
      error.textContent = "Ta nazwa jest już używana przez kogoś online";
      return;
    }

    // ustaw status online i lastSeen
    await set(currentUserRef, { online: true, lastSeen: Date.now() });

    // heartbeat co 5 sekund
    heartbeatInterval = setInterval(() => {
      set(currentUserRef, { online: true, lastSeen: Date.now() });
    }, 5000);

    window.currentUser = username;
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
    msgInput.focus(); // od razu fokus na pole wiadomości
  };

  loginBtn.addEventListener("click", login);

  // ---- logowanie przez Enter
  usernameInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      login();
    }
  });

  // ---- wysyłanie wiadomości
  const sendMessage = () => {
    if (!msgInput.value.trim()) return;

    push(messagesRef, { user: window.currentUser, text: msgInput.value, time: Date.now() });
    msgInput.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  sendBtn.addEventListener("click", sendMessage);

  // ---- wysyłanie wiadomości przez Enter
  msgInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  });

  // ---- odbieranie wiadomości i przewijanie
  onChildAdded(messagesRef, snapshot => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // ---- lista online (aktywni w ostatnich 5 sekund)
  onValue(usersRef, snapshot => {
    usersOnlineDiv.innerHTML = "";
    const users = snapshot.val();
    const now = Date.now();

    if (users) {
      Object.keys(users).forEach(u => {
        const user = users[u];
        if (user.lastSeen && now - user.lastSeen < 5000) {
          const div = document.createElement("div");
          const dot = document.createElement("div");
          dot.classList.add("online-dot");
          div.appendChild(dot);
          div.appendChild(document.createTextNode(u));
          usersOnlineDiv.appendChild(div);
        }
      });
    }
  });

  // ---- zmiana tła czatu przez PNG
  styleInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imgData = event.target.result; // PNG w formacie base64
      chatDiv.style.backgroundImage = `url(${imgData})`;
      chatDiv.style.backgroundSize = "cover";
      chatDiv.style.backgroundRepeat = "no-repeat";
      chatDiv.style.backgroundPosition = "center";
    };
    reader.readAsDataURL(file);
  });

  // ---- zatrzymanie heartbeat przy zamknięciu strony
  window.addEventListener("beforeunload", () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (currentUserRef) {
      set(currentUserRef, { online: false, lastSeen: Date.now() });
    }
  });
});
