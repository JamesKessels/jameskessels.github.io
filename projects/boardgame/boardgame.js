// queryselectors
const spaces = document.querySelectorAll(".space");
const rollText = document.querySelector(".rollContainer");
const statusText = document.querySelector(".statusContainer");
const rollBtn = document.querySelector("#roll");
rollBtn.addEventListener("click", function() {roll()});

// players, colors and spaces
const player = {
    playerId: 0,
    playerSpace: 0,

    jailed: false,
    jailTime: 0,
}
const players = [];
const colors = ["red", "green", "blue", "yellow"];
const extraSpaces = [
    ["jail", 0, 2],
    ["leap", 0, 5],
    ["back", 0, 5],
    ["firstBack", 0, 2],
    ["death", 0, 1]
];

for (let i = 0; i < 4; i++) {
    players.push(Object.create(player));
    players[i].playerId = i+1;
    players[i].playerSpace = 0;
}

// extra general variables
let currPlayer = 0;
let maxSpaces = spaces.length;
let win = false;
spaces[maxSpaces - 1].className += " win";
decideSpaces();

// functions
function roll(debug = false, number = 1) {
    statusText.innerHTML = "";
    let progress = true;
    let dice;

    if (!debug)
    {
        dice = Math.floor(Math.random() * 6) + 1;
    }
    else {
        dice = number;
    }

    if (!(players[currPlayer].playerSpace + dice < maxSpaces)) {
        progress = false;
    }

    if (players[currPlayer].playerSpace + dice === (maxSpaces - 1)) {
        win = true;
    }

    if (progress) {
        updateRoll(dice, progress);
        setPlayer(dice);
    }

    else {
        updateRoll(dice, progress);
        nextTurn();
    }
}
function setPlayer(diceRoll) {
    rollBtn.disabled = true;

    setLimitedInterval(movePiece, 200, diceRoll, checkSpace);
}

function checkSpace(fixedId = -1) {
    let movingPlayer = currPlayer;

    if (fixedId > -1) {
        movingPlayer = fixedId;
    }
    if (fixedId > 3) {
        movingPlayer = fixedId - 4;
    }

    let currentSpace = spaces[players[movingPlayer].playerSpace].classList;

    if (currentSpace.contains("death")) {
        setLimitedInterval(function() {
            players[movingPlayer].playerSpace = 0;
            movePiece(true, 0);
        }, 200, 1, function() {nextTurn(movingPlayer)});

        statusText.innerHTML = "Player " + (currPlayer + 1) + " has perished.";
    }
    else if (currentSpace.contains("jail")) {
        setLimitedInterval(function() {
            players[movingPlayer].jailed = true;
        }, 200, 1, function() {nextTurn(movingPlayer)});

        statusText.innerHTML = "Player " + (currPlayer + 1) + " is in jail. They will skip the next turn.";
    }
    else if (currentSpace.contains("leap")) {
        setLimitedInterval(movePiece, 200, 3, function() {checkSpace(movingPlayer)});
        statusText.innerHTML = "Player " + (currPlayer + 1) + " leaps forward another 3 spaces!";
    }
    else if (currentSpace.contains("back")) {
        setLimitedInterval(function() {movePiece(false, -1)}, 200, 3, function() {checkSpace(movingPlayer)});
        statusText.innerHTML = "Player " + (currPlayer + 1) + " falls back 3 spaces.";
    }
    else if (currentSpace.contains("firstBack")) {
        let playerPositions = [];
        let currentPlacement = 0;
        let currPlayerFirst = false;

        for (let i = 0; i < maxSpaces; i++) {
            let thisSpace = spaces[i].children;
            if (thisSpace.length > 0) {
                playerPositions[currentPlacement] = thisSpace;
                currentPlacement++;
            }
        }

        playerPositions.reverse();

        for (let j = 0; j < playerPositions[0].length; j++) {
            let thisPlayer = playerPositions[0][j].dataset.player
            if (thisPlayer === (currPlayer + 1).toString()) {
                currPlayerFirst = true;
                setLimitedInterval(movePiece, 200, 3, function() {checkSpace(movingPlayer)});
            }
        }
        if (currPlayerFirst) {
            statusText.innerHTML = "Player " + (currPlayer + 1) + " leaps forward another 3 spaces!";
        }

        if (!currPlayerFirst) {
            for (let j = 0; j < playerPositions[0].length; j++) {
                let thisPlayer = playerPositions[0][j].dataset.player
                setLimitedInterval(function() { movePiece(false, -1, (thisPlayer - 1)) }, 200, 3, function() {nextTurn(movingPlayer)});
            }

            statusText.innerHTML = "Player " + (currPlayer + 1) + " has sent their ";
            if (playerPositions[0].length > 1) {
                statusText.innerHTML += "opponents in first place ";
            }
            else {
                statusText.innerHTML += "opponent in first place ";
            }
            statusText.innerHTML += "back 3 spaces!";

        }
    }
    else {
        nextTurn(movingPlayer);
    }
}

function nextTurn(movingPlayer = currPlayer) {
    if (movingPlayer === currPlayer) {
        rollBtn.disabled = false;

        winCheck(win);

        if (!win) {
            if (currPlayer < 3)
                currPlayer++;
            else
                currPlayer = 0;

            updateText();
            updateButton();
        }

        if ((movingPlayer + 1) < 4) {
            if (players[movingPlayer + 1].jailed === true) {
                players[movingPlayer + 1].jailed = false;
                statusText.innerHTML = "Player " + (movingPlayer + 2) + " is still in jail. They will be freed on their next turn."
                nextTurn();
            }
        }
        else {
            if (players[movingPlayer - 3].jailed === true) {
                players[movingPlayer - 3].jailed = false;
                statusText.innerHTML = "Player " + (movingPlayer - 2) + " is still in jail. They will be freed on their next turn."
                nextTurn();
            }
        }
    }
}

function setLimitedInterval(callback, delay, repetitions, performFunction) {
    let x = 0;
    let interval = window.setInterval(function(){
        callback();

        if (++x === repetitions) {
            window.clearInterval(interval);
            performFunction();
        }
    }, delay);
}

function movePiece(dead = false, dir = 1, fixedId = -1) {
    let movingPlayer = currPlayer;

    if (fixedId > -1) {
        movingPlayer = fixedId;
    }
    if (fixedId > 3) {
        movingPlayer = fixedId - 4;
    }

    let playerPieceDataQS = '[data-player="' + players[movingPlayer].playerId + '"]';
    let playerPieceData = players[movingPlayer].playerId;

    if (!dead) {
        if (!(players[movingPlayer].playerSpace + dir < 0)) {
            players[movingPlayer].playerSpace += dir;

            document.querySelector(playerPieceDataQS).remove();
            let playerPiece = document.createElement("div");
            playerPiece.dataset.player = playerPieceData;
            playerPiece.className = "player";
            spaces[players[movingPlayer].playerSpace].append(playerPiece);
        }
    }
    else {
        document.querySelector(playerPieceDataQS).remove();
        let playerPiece = document.createElement("div");
        playerPiece.dataset.player = playerPieceData;
        playerPiece.className = "player";
        spaces[players[movingPlayer].playerSpace].append(playerPiece);
    }
}

function updateText() {
    let indicatorText = document.querySelector(".indicator");
    indicatorText.className = "indicator " + colors[currPlayer];
    indicatorText.innerText = "Player " + (currPlayer + 1);
}

function updateButton() {
    rollBtn.dataset.bgcol = colors[currPlayer];
}

function updateRoll(roll, progress = true) {
    rollText.innerHTML = "Player " + (currPlayer + 1) + "'s roll: " + roll;

    if (!progress) {
        statusText.innerHTML = "Player " + (currPlayer + 1) + " could not progress.";
    }

    rollText.hidden = false;
    statusText.hidden = false;
}

function winCheck(win) {
    if (win) {
        statusText.innerHTML = "Player " + (currPlayer + 1) + " wins!";
    }
}

function decideSpaces() {
    for (let i = 1; i < maxSpaces - 1; i++) {
        let spaceHere = (Math.random() * 50);

        if (spaceHere < 10) {
            if (i < maxSpaces - 6 || i > maxSpaces - 2) {
                let spacePicked = Math.floor(Math.random() * (extraSpaces.length - 1));
                if (extraSpaces[spacePicked][1] < extraSpaces[spacePicked][2]) {
                    spaces[i].className += " " + extraSpaces[spacePicked][0];
                    extraSpaces[spacePicked][1]++;
                }
            }
            else {
                if (extraSpaces[4][1] < extraSpaces[4][2]) {
                    spaces[i].className += " " + extraSpaces[4][0];
                    extraSpaces[4][1]++;
                }
            }
        }
    }
}