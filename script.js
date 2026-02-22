// 🔹 script.js — czat z heartbeat i poprawną listą online
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onDisconnect,
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
  const loginDiv = document.getElementById("login");
  const chatDiv = document.getElementById("chat");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const error = document.getElementById("error");

  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send");
  const usersOnlineDiv = document.getElementById("usersOnline");

  const messagesRef = ref(db, "messages");
  const usersRef = ref(db, "users");

  let currentUserRef = null;
  let heartbeatInterval = null;

  // ---- logowanie
  loginBtn.onclick = async () => {
    const username = usernameInput.value.trim();
    error.textContent = "";

    if (!username) {
      error.textContent = "Podaj nazwę użytkownika";
      return;
    }

    const userRef = ref(db, "users/" + username);
    const userSnap = await get(userRef);

    if (userSnap.exists() && userSnap.val().online) {
      error.textContent = "Ta nazwa jest już używana przez kogoś online";
      return;
    }

    currentUserRef = userRef;
    const now = Date.now();
    await set(currentUserRef, { online: true, lastSeen: now });
    onDisconnect(currentUserRef).remove();

    // heartbeat co 5 sekund, aby status online był aktualny
    heartbeatInterval = setInterval(() => {
      set(currentUserRef, { online: true, lastSeen: Date.now() });
    }, 5000);

    window.currentUser = username;
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
  };

  // ---- wysyłanie wiadomości
  sendBtn.onclick = () => {
    if (!msgInput.value.trim()) return;

    push(messagesRef, { user: window.currentUser, text: msgInput.value, time: Date.now() });
    msgInput.value = "";
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  };

  // ---- odbieranie wiadomości i przewijanie
  onChildAdded(messagesRef, snapshot => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.text}`;
    messagesDiv.appendChild(div);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // ---- lista online (tylko aktywni w ostatnich 15 sek)
  onValue(usersRef, snapshot => {
    usersOnlineDiv.innerHTML = "";
    const users = snapshot.val();
    const now = Date.now();
    if (users) {
      Object.keys(users).forEach(u => {
        const user = users[u];
        if (user.online && (now - user.lastSeen < 15000)) {
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

  // ---- zatrzymanie heartbeat przy zamknięciu strony
  window.addEventListener("beforeunload", () => {
    if (heartbeatInterval) clearInterval(heartbeatInterval);
    if (currentUserRef) currentUserRef.remove(); // usuwa użytkownika od razu
  });
});
