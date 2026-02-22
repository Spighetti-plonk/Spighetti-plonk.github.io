// 🔹 Poprawiony script.js — czat z listą online i przewijaniem
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

    // blokada tylko dla aktualnie zalogowanych
    if (userSnap.exists() && userSnap.val().online) {
      error.textContent = "Ta nazwa jest już używana przez kogoś online";
      return;
    }

    // zapis użytkownika jako online
    await set(userRef, { online: true, joinedAt: Date.now() });
    onDisconnect(userRef).remove(); // automatyczne usunięcie po wyjściu
    currentUserRef = userRef;

    window.currentUser = username;
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
  };

  // ---- wysyłanie wiadomości
  sendBtn.onclick = () => {
    if (!msgInput.value.trim()) return;

    push(messagesRef, { user: window.currentUser, text: msgInput.value, time: Date.now() });
    msgInput.value = "";
  };

  // ---- odbieranie wiadomości i automatyczny scroll
  onChildAdded(messagesRef, snapshot => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.text}`;
    messagesDiv.appendChild(div);

    // automatyczny scroll do najnowszej wiadomości
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  });

  // ---- lista online z zieloną kropką
  onValue(usersRef, snapshot => {
    usersOnlineDiv.innerHTML = "";
    const users = snapshot.val();
    if (users) {
      Object.keys(users).forEach(u => {
        // pokazujemy tylko tych, którzy są online
        if (users[u].online) {
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
});

