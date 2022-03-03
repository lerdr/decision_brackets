const items = [];
const comparisons = [];

const itemCard = document.getElementById("add-item-card");
const cardTitle = document.getElementById("card-title");
const cardDescription = document.getElementById("card-description");

const btn1 = document.getElementById("btn-1");
const btn2 = document.getElementById("btn-2");

const bgList = document.getElementById("bg-list");

const keys = {};
onkeydown = onkeyup = function (key) {
  keys[key.key] = key.type == "keydown";

  // Add Item - Create & Add Another
  if (keys["Enter"] && !keys["Shift"]) appendItem();

  // Add Card - Create & Compare
  if (keys["Enter"] && keys["Shift"] && !btn2.disabled) {
    appendItem();
    compareItems();
  }
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

  generatePairings();
}

function hideCard() {
  itemCard.style.display = "none";
}

function generatePairings() {
  comparisons.splice(0, comparisons.length);

  const shuffledItems = knuthShuffle(items);

  while (shuffledItems.length > 0) {
    let currentComparison = [];

    let currentItem = shuffledItems.pop();
    let firstItem = {
      title: currentItem.title,
      description: currentItem.description,
      winner: null,
    };

    currentComparison.push(firstItem);

    if (shuffledItems.length > 0) {
      let nextItem = shuffledItems.pop();
      let secondItem = {
        title: nextItem.title,
        description: nextItem.description,
        winner: null,
      };

      currentComparison.push(secondItem);
    }

    comparisons.push(currentComparison);
  }

  drawComparisons();
}

function knuthShuffle(array) {
  let currentIndex = array.length;
  let randomIndex;

  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

function drawComparisons() {
  bgList.innerHTML = "";

  comparisons.forEach((pair) => {
    let firstItem = pair[0];
    let currentString = `<li><strong>${firstItem.title}</strong>`;

    if (firstItem.description) currentString += ` (${firstItem.description})`;

    if (pair[1]) {
      let secondItem = pair[1];
      currentString += ` vs. <strong>${secondItem.title}</strong>`;
      if (secondItem.description)
        currentString += ` (${secondItem.description})`;
    }

    currentString += "</li>";
    bgList.innerHTML += currentString;
  });
}

btn1.addEventListener("click", btnClick);
btn2.addEventListener("click", btnClick);
