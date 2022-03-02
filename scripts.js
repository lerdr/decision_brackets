// DONE: ✔️ - WIP: 💬 - ERROR: ❌
// add listeners on buttons ✔️
// create mock list in the background ✔️
// append & reset elements via btns ✔️
// "title" is text field, preselected on refresh 💬

const cardTitle = document.getElementById("card-title");
const cardDescription = document.getElementById("card-description");

const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");

const bgList = document.getElementById("bg-list");

function btnClick() {
  switch (this.dataset.function) {
    case "append":
      const content = cardTitle.innerHTML;
      bgList.innerHTML += `<li>${content}</li>`;
      break;
    case "reset":
      bgList.innerHTML = "";
      break;
    default:
      console.log("No function detected");
      break;
  }
}

btn1.addEventListener("click", btnClick);
btn2.addEventListener("click", btnClick);
