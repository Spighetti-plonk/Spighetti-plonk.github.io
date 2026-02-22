import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "TWOJ_API_KEY",
  authDomain: "TWOJ_PROJEKT.firebaseapp.com",
  databaseURL: "https://TWOJ_PROJEKT.firebaseio.com",
  projectId: "TWOJ_PROJEKT",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const auth = getAuth(app);

signInAnonymously(auth);

const messagesRef = ref(db, "messages");

const messagesDiv = document.getElementById("messages");
const input = document.getElementById("msg");
const button = document.getElementById("send");

button.onclick = () => {
  if (input.value.trim()) {
    push(messagesRef, {
      text: input.value,
      time: Date.now()
    });
    input.value = "";
  }
};

onChildAdded(messagesRef, snapshot => {
  const msg = document.createElement("div");
  msg.textContent = snapshot.val().text;
  messagesDiv.appendChild(msg);
});