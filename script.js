document.addEventListener("DOMContentLoaded", () => {
  const loginDiv = document.getElementById("login");
  const chatDiv = document.getElementById("chat");
  const loginBtn = document.getElementById("loginBtn");
  const usernameInput = document.getElementById("username");

  loginBtn.addEventListener("click", () => {
    const username = usernameInput.value.trim();

    if (username === "") {
      alert("Podaj nazwę użytkownika");
      return;
    }

    loginDiv.style.display = "none";
    chatDiv.style.display = "block";
    chatDiv.innerHTML = `Witaj <b>${username}</b> 👋`;
  });
});
