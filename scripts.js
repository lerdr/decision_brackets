// DONE: ✔️ - WIP: 💬 - ERROR: ❌ - ON HOLD: 🔜 - BUG: 🐛
// add listeners on buttons ✔️
// create mock list in the background ✔️
// append & reset elements via btns ✔️
// "title" is text field, preselected on refresh ✔️
// pressing "enter" auto-clicks btn1 & clears title + autofocus ✔️
// pressing "shift + enter" logs "Extended functionalities to come" ✔️
// title -> description -> enter; tabindex & custom content ✔️
// create to array instead of list, just log ✔️
// draw background from array, not list ✔️
// draw whole background from array, not just append 💬

// how do we edit elements? 🔜
// how do we empty the list, if the "shift+enter" won't be reset? 🔜

// fix: empty title - tab to description - write - enter: no trigger 🐛

const items = [];

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
      cardTitle.value = "";
      cardDescription.value = "";
      cardTitle.focus();
      bgList.innerHTML = "";
      items.splice(0, items.length);
      console.log(items);
      break;
    default:
      console.log("No function detected");
      break;
  }
}

function appendTitle() {
  const titleValue = cardTitle.value.trim();
  const descriptionValue = cardDescription.value.trim();
  if (titleValue === "") return;
  items.push({ title: titleValue, description: descriptionValue });

  cardTitle.value = "";
  cardDescription.value = "";
  cardTitle.focus();

  drawList(titleValue, descriptionValue);
}

function drawList(title, description) {
  bgList.innerHTML += `<li><strong>${title}</strong></li><br>${description}`;
}

btn1.addEventListener("click", btnClick);
btn2.addEventListener("click", btnClick);
