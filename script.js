const loginDiv = document.getElementById("login");
const chatDiv = document.getElementById("chat");
const loginBtn = document.getElementById("loginBtn");
const usernameInput = document.getElementById("username");
const errorDiv = document.getElementById("error");

loginBtn.addEventListiner("click", () => {
  const username = usernameInput.value;

  if (usrename === "") {
    errorDiv.textContext = "Input username";
    return;
  }


loginDiv.style.display = "none";

chatDiv.style.display = "block";

});
