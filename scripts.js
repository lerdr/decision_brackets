let mode = "";

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

const markdownConverter = new showdown.Converter();

// Shortcuts by mode
const keys = {};
onkeydown = onkeyup = function (key) {
  keys[key.key] = key.type == "keydown";

  switch (mode) {
    case "add":
      // Create & Add Another
      if (keys["Enter"] && !keys["Shift"]) appendItem();

      // Create & Compare
      if (keys["Enter"] && keys["Shift"] && !btnCreateCompare.disabled) {
        appendItem();
        compareItems();
      }
      break;
    case "comparison":
      // Promote Left
      if (keys["ArrowLeft"]) promoteItem(btnPromoteLeft.dataset.itemCode);

      // Promote Right
      if (keys["ArrowRight"]) promoteItem(btnPromoteRight.dataset.itemCode);
      break;
    case "winner":
      break;
    default:
      this.alert("Error: no mode detected");
      break;
  }
};

function init() {
  btnCreateAnother.addEventListener("click", btnClick);
  btnCreateCompare.addEventListener("click", btnClick);
  btnPromoteLeft.addEventListener("click", btnClick);
  btnPromoteRight.addEventListener("click", btnClick);
  mode = "add";
}

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

export function appendItem() {
  const titleValue = sanitize(addCardTitle.value.trim());
  const descriptionValue = markdown(sanitize(addCardDescription.value.trim()));

  if (titleValue === "") return;

  items.push({ title: titleValue, description: descriptionValue });

  addCardTitle.value = "";
  addCardDescription.value = "";
  addCardTitle.focus();

  drawList(titleValue, descriptionValue);
}

function drawList() {
  bgList.innerHTML = "";

  btnCreateCompare.disabled = items.length <= 1;

  if (items.length === 0) return;

  items.forEach((item) => {
    bgList.innerHTML += `<li><strong>${item.title}</strong></li><br>${item.description}`;
  });
}

function resetItems() {
  addCardTitle.value = "";
  addCardDescription.value = "";
  addCardTitle.focus();
  bgList.innerHTML = "";
  items.splice(0, items.length);
}

function compareItems() {
  mode = "comparison";
  hideCard();
  generatePairings(items);
  drawComparisonCard();
}

function hideCard() {
  itemCard.style.display = "none";
}

function generatePairings(items) {
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
  for (let index = array.length - 1; index >= 0; index--) {
    let randomIndex = Math.floor(Math.random() * index);

    // destructuring assignment
    [array[index], array[randomIndex]] = [array[randomIndex], array[index]];
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
    nextTier();
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

function nextTier() {
  const nextTierItems = comparisons.map((pair) =>
    pair[0].winner
      ? { title: pair[0].title, description: pair[0].description }
      : { title: pair[1].title, description: pair[1].description }
  );

  if (nextTierItems.length > 1) {
    generatePairings(nextTierItems);
    drawComparisonCard();
  } else {
    comparisonCard.style.display = "none";
    mode = "winner";
    bgList.innerHTML = `<li><strong>${nextTierItems[0].title}</strong><br />${nextTierItems[0].description}</li>`;
  }
}

function sanitize(string) {
  return sanitizeHtml(string, {
    allowedTags: [],
    allowedAttributes: {},
    disallowedTagsMode: "escape",
  });
}

function markdown(string) {
  return markdownConverter.makeHtml(string);
}

init();
