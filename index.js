/* **** Utils **** */
// Mock JSON data if this is running on a local file system
const colorJSON = `[
  {"name": "red", "hue": 0},
  {"name": "blue", "hue": 240},
  {"name": "purple", "hue": 270}
]`;

// Helper functions
const consonants = [
  "b",
  "c",
  "d",
  "f",
  "g",
  "h",
  "j",
  "k",
  "l",
  "m",
  "n",
  "p",
  "r",
  "s",
  "t",
  "v",
  "w",
  "x",
  "y",
  "z"
];
const vowels = ["a", "e", "i", "o", "u"];

const getRandomNumber = cap => Math.floor(Math.random() * cap);
const getRandomItem = arr => arr[getRandomNumber(arr.length)];
const getRandomConsonant = () => getRandomItem(consonants);
const getRandomVowel = () => getRandomItem(vowels);
const getRandomBool = () => Math.random() >= 0.5;
const getRandomPair = () => getRandomVowel() + getRandomConsonant();

function generateRandomName() {
  let name = Math.random() >= 0.3 ? getRandomConsonant() : getRandomPair();
  name += getRandomPair();
  if (getRandomBool()) {
    name += getRandomPair();
  }
  if (getRandomBool()) {
    name += getRandomPair();
  }
  return name;
}

/* **** App **** */
function handleColorClick({ target }) {
  const hue = target.getAttribute("data-hue");
  const randomSaturation = Math.floor(Math.random() * 75 + 25);
  target.style.color = `hsl(${hue}, ${randomSaturation}%, 50%)`;
}

// Add new color to the list
const colorsOutput = document.getElementById("colors");
function addColor(name, hue) {
  const li = document.createElement("li");
  li.className = "color";
  li.style.color = `hsl(${hue}, 100%, 50%)`;
  li.innerText = name;
  li.setAttribute("data-hue", hue);
  li.onclick = handleColorClick;
  colorsOutput.appendChild(li);
}

// Fetch the initial colors
if (window.location.protocol === "file:") {
  const colorData = JSON.parse(colorJSON);
  colorData.forEach(({ name, hue }) => {
    addColor(name, hue);
  });
} else {
  const loader = document.getElementById("loader");
  const colorListDiv = document.getElementById("color-list");
  loader.style.display = "block";
  colorListDiv.style.display = "none";
  fetch("./colors.json")
    .then(response => response.json())
    .then(({ colors }) => {
      colors.forEach(({ name, hue }) => {
        addColor(name, hue);
      });
      loader.style.display = "none";
      colorListDiv.style.display = "block";
    })
    .catch(console.warn);
}

// Color Creator
const nameInput = document.getElementById("name");
const hueInput = document.getElementById("hue");
function createNewColor() {
  const name = nameInput.value;
  let hue = hueInput.valueAsNumber;
  // Validation
  if (name.length < 1) return;
  if (hue < 0) {
    hue = 0;
  } else if (hue > 359) {
    hue = 359;
  }
  // Add
  addColor(name, hue);
  // Reset
  nameInput.value = "";
  hueInput.value = 0;
}
document.getElementById("create").onclick = createNewColor;

// Color Generator
function generateNewColor() {
  addColor(generateRandomName(), getRandomNumber(359));
}
document.getElementById("generate").onclick = generateNewColor;
