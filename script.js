// 🔹 script.js — wersja z tylko nazwą użytkownika
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  onDisconnect,
  push,
  onChildAdded
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// 🔹 Konfiguracja Firebase (wstaw swoje dane z Firebase)
const firebaseConfig = {
  apiKey: "AIzaSyCnVI_9ZNNcvShNvgYHYierdePN_p5r3kw",
  authDomain: "test-strona-2a2f2.firebaseapp.com",
  databaseURL: "https://test-strona-2a2f2-default-rtdb.firebaseio.com",
  projectId: "test-strona-2a2f2"
};

// 🔹 Inicjalizacja Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// 🔹 Poczekaj, aż cały HTML się wczyta
document.addEventListener("DOMContentLoaded", () => {
  // ---- elementy HTML
  const loginDiv = document.getElementById("login");
  const chatDiv = document.getElementById("chat");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");
  const error = document.getElementById("error");

  const messagesDiv = document.getElementById("messages");
  const msgInput = document.getElementById("msg");
  const sendBtn = document.getElementById("send");

  // ---- kliknięcie „Wejdź”
  loginBtn.onclick = async () => {
    const username = usernameInput.value.trim();

    error.textContent = "";

    if (!username) {
      error.textContent = "Podaj nazwę użytkownika";
      return;
    }

    // ---- sprawdzenie unikalności nazwy w Firebase
    const userRef = ref(db, "users/" + username);
    const userSnap = await get(userRef);

    if (userSnap.exists()) {
      error.textContent = "Ta nazwa jest już zajęta";
      return;
    }

    // ---- zapis użytkownika w Firebase
    await set(userRef, { online: true, joinedAt: Date.now() });
    onDisconnect(userRef).remove();

    // ---- przejście do czatu
    window.currentUser = username;
    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
  };

  // ---- wysyłanie wiadomości
  const messagesRef = ref(db, "messages");
  sendBtn.onclick = () => {
    if (!msgInput.value.trim()) return;

    push(messagesRef, { user: window.currentUser, text: msgInput.value, time: Date.now() });
    msgInput.value = "";
  };

  // ---- odbieranie wiadomości na żywo
  onChildAdded(messagesRef, snapshot => {
    const data = snapshot.val();
    const div = document.createElement("div");
    div.textContent = `${data.user}: ${data.text}`;
    messagesDiv.appendChild(div);
  });
};

