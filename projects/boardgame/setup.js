const numberBox = document.querySelector('input[type="number"]');
const playerBoxes = document.querySelector(".players");
const colorBoxes = document.querySelectorAll(".colorPicker");
const bgColors = ["bgRed", "bgGreen", "bgBlue", "bgYellow", "bgPurple", "bgOrange"]
const pieceColors = ["--pRed", "--pGreen", "--pBlue", "--pYellow", "--pPurple", "--pOrange"]
const textColors = ["red", "green", "blue", "yellow", "purple", "orange"]
const textBoxes = document.querySelectorAll(".textBox");

const startBtn = document.querySelector(".startBtn");
startBtn.onclick = function () {startGame()}

const root = document.querySelector(":root");

const playerSelection = document.querySelector("#setup");
const game = document.querySelector("#game");

let activeColors = getActiveColors();
let playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"];
let allPlayers = 4;

for (let cb = 0; cb < colorBoxes.length; cb++) { // for each set of radio buttons
    for (let rb = 0; rb < colorBoxes[cb].children.length; rb++) { // for each radio button
        colorBoxes[cb].children[rb].children[0].onchange = function() {colorPicker(this, cb, rb);}
    }
}

for (let tb = 0; tb < textBoxes.length; tb++) {
    textBoxes[tb].children[0].children[0].onchange = function() { saveName(tb, this.value);}
    textBoxes[tb].children[0].children[0].tabIndex = (tb + 1);
}

numberBox.onchange = function () {setCols(numberBox.value);}
document.body.onload = function () {setCols(numberBox.value);}

function setCols (playerCount) {
    if (playerCount > 4) {
        numberBox.value = playerCount = 4;
    }

    if (playerCount < 2) {
        numberBox.value = playerCount = 2;
    }

    allPlayers = parseInt(playerCount);

    for (let i = 0; i < playerBoxes.children.length; i++) {
        if (i > (playerCount - 1))
            playerBoxes.children[i].classList.add("d-none");
        else {
            playerBoxes.children[i].classList.remove("d-none");
        }
    }
}

function colorPicker(picker, box, child) {
    let thisBox = picker.parentElement.parentElement.parentElement.parentElement;
    thisBox.classList.remove("bgRed", "bgGreen", "bgBlue", "bgYellow", "bgPurple", "bgOrange");
    thisBox.classList.add(bgColors[child]);
    textBoxes[box].classList.remove("red", "green", "blue", "yellow", "orange", "purple");
    textBoxes[box].classList.add(textColors[child]);

    //check if currently selected color is already in use
    //if so, swap with previous color

    for (let boxes = 0; boxes < colorBoxes.length; boxes++) {
        if (boxes === box) { continue; }
        if (picker.checked === colorBoxes[boxes].children[child].children[0].checked) {
            colorBoxes[boxes].children[child].children[0].checked = false;
            colorBoxes[boxes].children[activeColors[box]].children[0].checked = true;
            colorPicker(colorBoxes[boxes].children[activeColors[box]].children[0], boxes, activeColors[box]);
        }
    }

    activeColors = getActiveColors();
}

function getActiveColors() {
    let activeColors = []

    for (let i = 0; i < colorBoxes.length; i++) {
        for (let j = 0; j < colorBoxes[i].children.length; j++) {
            if (colorBoxes[i].children[j].children[0].checked) {
                activeColors.push(j);
            }
        }
    }

    return activeColors;
}

function saveName(playerId, name) {
    playerNames[playerId] = name;
}

function startGame() {
    playerSelection.classList.add("d-none");
    game.classList.remove("d-none");

    playerSetUp();

    updateText();
    updateButton();

    generateBoard(0);
    boardPlacements()
}

function playerSetUp() {
    maxPlayers = allPlayers;

    for (let i = 0; i < maxPlayers; i++) {
        players.push(Object.create(player));

        players[i].playerId = i;
        players[i].playerSpace = 0;
        players[i].playerName = playerNames[i];
        players[i].playerColor = activeColors[i];

        setupColors(i)
    }
}

function setupColors(currentIndex) {
    let player = "--p" + currentIndex;
    let replacement = "var(" + pieceColors[activeColors[currentIndex]] + ")";
    root.style.setProperty(player, replacement);
}