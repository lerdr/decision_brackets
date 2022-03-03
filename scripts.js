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
// draw whole background from array, not just append ✔️
// shift + enter should hide the card ✔️
// shift + enter should be enabled when there are 2+ elements, not before ✔️
// shift + enter should be meaningfully styled 💬

// after the card is hidden, the software should automatically generate pairings 🔜
// new empty card should appear - call it comparison-card 🔜
// comparison-card should show two columns & two buttons 🔜
// the two columns should include title & description from selected comparison items 🔜
// buttons should tell which one to promote 🔜
// buttons should be triggered either by clicking or pressing the arrows 🔜
// software should have a mode enum that limits keyboard interactivity 🔜
// I should be able to enter extra items after the comparison has begun 🔜
// new elements should be appendended in a new list, separate from comparisons 🔜
// after all new elements are entered, software should shuffle & add them to brackets 🔜
// card should animate when appearing & disappearing 🔜
// how do we edit elements? 🔜
// how do we empty the list, if the "shift+enter" won't be reset? 🔜

// fix: empty title - tab to description - write - enter: no trigger 🐛
// fix: not responsive 🐛

const items = [];

const itemCard = document.getElementById("add-item-card");
const cardTitle = document.getElementById("card-title");
const cardDescription = document.getElementById("card-description");

const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");

const bgList = document.getElementById("bg-list");

const keys = {};
onkeydown = onkeyup = function (key) {
  keys[key.key] = key.type == "keydown";

  if (keys["Enter"] && !keys["Shift"]) appendItem();
  if (keys["Enter"] && keys["Shift"] && !btn2.disabled) compareItems();
};

function btnClick() {
  switch (this.dataset.function) {
    case "append":
      appendItem();
      break;
    case "reset":
      resetItems();
      break;
    case "compare":
      compareItems();
      break;
    default:
      alert("No function detected");
      break;
  }
}

function appendItem() {
  const titleValue = cardTitle.value.trim();
  const descriptionValue = cardDescription.value.trim();

  if (titleValue === "") return;

  items.push({ title: titleValue, description: descriptionValue });

  cardTitle.value = "";
  cardDescription.value = "";
  cardTitle.focus();

  drawList(titleValue, descriptionValue);
}

function resetItems() {
  cardTitle.value = "";
  cardDescription.value = "";
  cardTitle.focus();
  bgList.innerHTML = "";
  items.splice(0, items.length);
}

function drawList() {
  bgList.innerHTML = "";

  btn2.disabled = items.length <= 1;

  if (items.length === 0) return;

  items.forEach((item) => {
    bgList.innerHTML += `<li><strong>${item.title}</strong></li><br>${item.description}`;
  });
}

function compareItems() {
  hideCard();

  console.log("- compareItems: awaiting implementation...");
}

function hideCard() {
  itemCard.style.display = "none";
}

btn1.addEventListener("click", btnClick);
btn2.addEventListener("click", btnClick);
