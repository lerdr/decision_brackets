const items = [];
const comparisons = [];

const itemCard = document.getElementById("add-item-card");
const addCardTitle = document.getElementById("add-card-title");
const addCardDescription = document.getElementById("add-card-description");

const btnCreateAnother = document.getElementById("btn-create-another");
const btnCreateCompare = document.getElementById("btn-create-compare");

const comparisonCard = document.getElementById("comparison-card");
const comparisonLeftTitle = document.getElementById("comparison-left-title");
const comparisonLeftDescription = document.getElementById(
  "comparison-left-description"
);
const comparisonRightTitle = document.getElementById("comparison-right-title");
const comparisonRightDescription = document.getElementById(
  "comparison-right-description"
);

const btnPromoteLeft = document.getElementById("btn-left");
const btnPromoteRight = document.getElementById("btn-right");

const bgList = document.getElementById("bg-list");

const keys = {};
onkeydown = onkeyup = function (key) {
  keys[key.key] = key.type == "keydown";

  // IF MODE: CREATION

  // Create & Add Another
  if (keys["Enter"] && !keys["Shift"]) appendItem();

  // Create & Compare
  if (keys["Enter"] && keys["Shift"] && !btnCreateCompare.disabled) {
    appendItem();
    compareItems();
  }

  // IF MODE: COMPARISON

  // Promote Left

  // Promote Right
};

function btnClick() {
  switch (this.dataset.function) {
    case "append":
      appendItem();
      break;
    case "reset":
      resetItems();
      break;
    case "promote":
      promoteItem(this.dataset.itemCode);
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
  const titleValue = addCardTitle.value.trim();
  const descriptionValue = addCardDescription.value.trim();

  if (titleValue === "") return;

  items.push({ title: titleValue, description: descriptionValue });

  addCardTitle.value = "";
  addCardDescription.value = "";
  addCardTitle.focus();

  drawList(titleValue, descriptionValue);
}

function resetItems() {
  addCardTitle.value = "";
  addCardDescription.value = "";
  addCardTitle.focus();
  bgList.innerHTML = "";
  items.splice(0, items.length);
}

function drawList() {
  bgList.innerHTML = "";

  btnCreateCompare.disabled = items.length <= 1;

  if (items.length === 0) return;

  items.forEach((item) => {
    bgList.innerHTML += `<li><strong>${item.title}</strong></li><br>${item.description}`;
  });
}

function compareItems() {
  hideCard();
  generatePairings();
  drawComparisonCard();
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

    if (shuffledItems.length > 0) {
      currentComparison.push(firstItem);

      let nextItem = shuffledItems.pop();
      let secondItem = {
        title: nextItem.title,
        description: nextItem.description,
        winner: null,
      };

      currentComparison.push(secondItem);
    } else {
      firstItem.winner = true;
      currentComparison.push(firstItem);
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
    let currentString = "<li>";

    if (firstItem.winner === false) currentString += "<s>";
    currentString += `<strong>${firstItem.title}</strong>`;
    if (firstItem.winner === false) currentString += "</s>";

    if (pair[1]) {
      currentString += " vs. ";

      let secondItem = pair[1];
      if (secondItem.winner === false) currentString += "<s>";
      currentString += `<strong>${secondItem.title}</strong>`;
      if (secondItem.winner === false) currentString += "</s>";
    }

    currentString += "</li>";
    bgList.innerHTML += currentString;
  });
}

function drawComparisonCard() {
  comparisonCard.style.display = "block";

  let index = 0;

  // search for earliest winner == null with rival
  while (index < comparisons.length && comparisons[index][0].winner !== null)
    index++;

  // if none found, we reached the end
  if (index >= comparisons.length) {
    comparisonCard.style.display = "none";
    return;
  }

  // if found, draw
  comparisonLeftTitle.innerHTML = comparisons[index][0].title;
  comparisonLeftDescription.innerHTML =
    comparisons[index][0].description.length > 0
      ? comparisons[index][0].description
      : "No description";

  btnPromoteLeft.dataset.itemCode = index + "-0";

  comparisonRightTitle.innerHTML = comparisons[index][1].title;
  comparisonRightDescription.innerHTML =
    comparisons[index][1].description.length > 0
      ? comparisons[index][1].description
      : "No description";

  btnPromoteRight.dataset.itemCode = index + "-1";
}

function promoteItem(itemCode) {
  const address = itemCode.split("-");
  const rivalIndex = address[1] == 0 ? 1 : 0;

  comparisons[address[0]][address[1]].winner = true;
  comparisons[address[0]][rivalIndex].winner = false;

  drawComparisons();
  drawComparisonCard();
}

btnCreateAnother.addEventListener("click", btnClick);
btnCreateCompare.addEventListener("click", btnClick);
btnPromoteLeft.addEventListener("click", btnClick);
btnPromoteRight.addEventListener("click", btnClick);
