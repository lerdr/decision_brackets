// DONE: ✔️ - WIP: 💬 - ERROR: ❌
// add listeners on buttons ✔️
// create mock list in the background ✔️
// append & reset elements via btns ✔️
// "title" is text field, preselected on refresh ✔️
// pressing "enter" auto-clicks btn1 & clears title + autofocus ✔️
// pressing "shift + enter" logs "Extended functionalities to come" ✔️

const cardTitle = document.getElementById("card-title");
const cardDescription = document.getElementById("card-description");

const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");

const bgList = document.getElementById("bg-list");

const keys = {};
onkeydown = onkeyup = function (key) {
  keys[key.key] = key.type == "keydown";

  if (keys["Enter"] && !keys["Shift"]) appendTitle();
  if (keys["Enter"] && keys["Shift"])
    console.log("Extended functionalities to come");
};

function btnClick() {
  switch (this.dataset.function) {
    case "append":
      appendTitle();
      break;
    case "reset":
      bgList.innerHTML = "";
      break;
    default:
      console.log("No function detected");
      break;
  }
}

function appendTitle() {
  const content = cardTitle.value.trim();
  if (content === "") return;
  bgList.innerHTML += `<li>${content}</li>`;
  cardTitle.value = "";
  cardTitle.focus();
}

btn1.addEventListener("click", btnClick);
btn2.addEventListener("click", btnClick);
