// 🔹 Firebase – konfiguracja (WSTAW SWOJE DANE)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getDatabase,
  ref,
  get,
  set,
  push,
  onChildAdded,
  onDisconnect
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import {
  getAuth,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCnVI_9ZNNcvShNvgYHYierdePN_p5r3kw",
  authDomain: "test-strona-2a2f2.firebaseapp.com",
  databaseURL: "https://test-strona-2a2f2-default-rtdb.firebaseio.com",
  projectId: "test-strona-2a2f2",
  storageBucket: "test-strona-2a2f2.firebasestorage.app",
  messagingSenderId: "434186354741",
  appId: "1:434186354741:web:a722732e0178a30c73f17c"
};
// 🔹 Połączenie z Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);
signInAnonymously(auth);

// 🔹 Elementy HTML
const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const loginBtn = document.getElementById("loginBtn");
const error = document.getElementById("error");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const messagesDiv = document.getElementById("messages");
const msgInput = document.getElementById("msg");
const sendBtn = document.getElementById("send");

// 🔹 Kliknięcie „Wejdź”
loginBtn.onclick = async () => {
  console.log("Kliknięto przycisk Wejdź");
  const username = document.getElementById("username").value.trim();
  console.log("Wpisana nazwa:", username);
loginBtn.onclick = async () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value;

  error.textContent = "";

  if (!username) {
    error.textContent = "Podaj nazwę użytkownika";
    return;
  }

  // 2️⃣ Sprawdź czy nazwa wolna
  const userRef = ref(db, "users/" + username);
  const userSnap = await get(userRef);

  if (userSnap.exists()) {
    error.textContent = "Ta nazwa jest już zajęta";
    return;
  }

  // 3️⃣ Zapisz użytkownika
  await set(userRef, {
    online: true,
    joinedAt: Date.now()
  });

  // 4️⃣ Usuń po wyjściu
  onDisconnect(userRef).remove();

  // 5️⃣ Wejście do czatu
  window.currentUser = username;
  loginDiv.style.display = "none";
  chatDiv.style.display = "block";
};

// 🔹 Wysyłanie wiadomości
const messagesRef = ref(db, "messages");

sendBtn.onclick = () => {
  if (!msgInput.value.trim()) return;

  push(messagesRef, {
    user: window.currentUser,
    text: msgInput.value,
    time: Date.now()
  });

  msgInput.value = "";
};

// 🔹 Odbieranie wiadomości
onChildAdded(messagesRef, snapshot => {
  const data = snapshot.val();
  const div = document.createElement("div");
  div.textContent = `${data.user}: ${data.text}`;
  messagesDiv.appendChild(div);
});

  
});




