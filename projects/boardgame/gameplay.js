// variables
const rollBtn = document.querySelector("#roll");
rollBtn.addEventListener("click", function () {roll()});

const rollText = document.querySelector(".rollContainer");
const statusText = document.querySelector(".statusContainer");

const player = {
    playerId: 0,
    playerSpace: 0,
    jailed: false,
}
const players = [];
const colors = ["red", "green", "blue", "yellow"];

for (let i = 0; i < maxPlayers; i++) {
    players.push(Object.create(player));
    players[i].playerId = i;
    players[i].playerSpace = 0;
}

let currPlayer = 0;
let win = false;


// functions
function setLimitedInterval(callback, delay, repetitions, afterRepeat = function() {}) {
    let x = 0;
    let interval = window.setInterval(function(){
        callback();

        if (++x === repetitions) {
            window.clearInterval(interval);
            afterRepeat();
        }
    }, delay);
}

function roll(debug = false, number = 1) {
    rollBtn.disabled = true;
    toggleDebugButtons(true);

    statusText.innerHTML = "";
    let progress = true;
    let dice;

    if (!debug) { dice = Math.floor(Math.random() * 6) + 1; }
    else { dice = number;}

    if (!(players[currPlayer].playerSpace + dice < maxSpaces)) {progress = false;}
    if (players[currPlayer].playerSpace + dice === (maxSpaces - 1)) {win = true;}

    setLimitedInterval(function() {updateRollText(dice, progress);}, 0, 1, function() {checkProgress(progress, dice)})
}

function checkProgress(progress, dice) {
    if (progress) {
        setLimitedInterval(determinePlayerStatus, 150, dice, checkSpace);
    }

    else {
        nextTurn();
    }
}

function determineId(fixedId = -1) {
    let movingPlayer = currPlayer; //default

    if (fixedId > -1) {movingPlayer = fixedId}
    else if (fixedId > (maxPlayers -1)) {movingPlayer = fixedId - maxPlayers}

    return movingPlayer;
}

function determinePlayerStatus(dead = false, dir = 1, fixedId = -1) {
    let movingPlayer = determineId(fixedId);

    if (!(dead && players[movingPlayer].playerSpace + dir < 0)) { players[movingPlayer].playerSpace += dir; }
    movePiece(movingPlayer);
}

function movePiece(movingPlayer) {
    let playerPieceDataQS = '[data-player="' + players[movingPlayer].playerId + '"]';
    let playerPieceData = players[movingPlayer].playerId;

    document.querySelector(playerPieceDataQS).remove();
    let playerPiece = document.createElement("div");
    playerPiece.dataset.player = playerPieceData;
    playerPiece.className = "player";
    currBoard[players[movingPlayer].playerSpace].append(playerPiece);
}

function checkSpace(fixedId = -1) {
    let movingPlayer = determineId(fixedId);

    let currSpace = currBoard[players[movingPlayer].playerSpace].classList;
    let callback = function() {};
    let delay = 200;
    let repetitions = 1;
    let afterRepeat = function() {
        nextTurn(movingPlayer)
    };

    if (currSpace.contains("death")) {
        callback = function() {
            players[movingPlayer].playerSpace = 0;
            determinePlayerStatus(true, 0);
        }

        updateStatusText(("Player " + (currPlayer + 1) + " has perished."));
    }
    if (currSpace.contains("jail")) {
        callback = function() {
            players[movingPlayer].jailed = true;
        }

        updateStatusText(("Player " + (currPlayer + 1) + " is in jail. They will skip the next turn."));
    }
    if (currSpace.contains("leap")) {
        callback = function() {
            determinePlayerStatus()
        }
        repetitions = 3;
        afterRepeat = function() {checkSpace(movingPlayer)};

        updateStatusText(("Player " + (currPlayer + 1) + " leaps forward another 3 spaces!"));
    }
    if (currSpace.contains("back")) {
        callback = function() {
            determinePlayerStatus(false, -1);
        }
        repetitions = 3;
        afterRepeat = function() {checkSpace(movingPlayer)};

        updateStatusText(("Player " + (currPlayer + 1) + " falls back 3 spaces."));
    }

    let playerPositions = findPositions();
    let currPlayerFirst = true;

    if (currSpace.contains("firstBack")) {
        playerPositions.reverse();

        currPlayerFirst = false;

        for (let j = 0; j < playerPositions[0].length; j++) {
            let thisPlayer = playerPositions[0][j].dataset.player
            if (thisPlayer === currPlayer.toString()) {
                currPlayerFirst = true;
                updateStatusText("Player " + (currPlayer + 1) + " leaps forward another 3 spaces!");
                callback = determinePlayerStatus;
                afterRepeat = function() {checkSpace(movingPlayer)};
                repetitions = 3;
            }
        }

        if (!currPlayerFirst) {
            for (let j = 0; j < playerPositions[0].length; j++) {
                let thisPlayer = playerPositions[0][j].dataset.player
                setLimitedInterval(function() { determinePlayerStatus(false, -1, (thisPlayer)) }, 200, 3, function() {nextTurn(movingPlayer)});
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

    //master SetLimitedInterval
    if (currPlayerFirst) {
        setLimitedInterval(callback, delay, repetitions, afterRepeat);
    }
}

function findPositions() {
    let playerPositions = [];
    let currentPlacement = 0;

    for (let i = 0; i < maxSpaces; i++) {
        let thisSpace = currBoard[i].children;
        if (thisSpace.length > 0) {
            playerPositions[currentPlacement] = thisSpace;
            currentPlacement++;
        }
    }

    return playerPositions;
}

function nextTurn(movingPlayer = currPlayer) {
    if (movingPlayer === currPlayer) {
        winCheck(win);

        if (!win) {
            if (currPlayer < 3)
                currPlayer++;
            else
                currPlayer = 0;

            updateText();
            updateButton();
        }

        if (players[currPlayer].jailed === true) {
            players[currPlayer].jailed = false;

            updateStatusText(("Player " + (currPlayer + 1) + " is still in jail. They will be freed on their next turn."));

            setLimitedInterval(function() {}, 2000, 1, function() {nextTurn()});
        }
        else {
            toggleDebugButtons(false);
            rollBtn.disabled = false;
        }
    }
}

function winCheck(win) {
    if (win) {
        statusText.innerHTML = "Player " + (currPlayer + 1) + " wins!";
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

function updateRollText(roll, progress = true) {
    rollText.innerHTML = "Player " + (currPlayer + 1) + "'s roll: " + roll;

    if (!progress) {
        updateStatusText("Player " + (currPlayer + 1) + " could not progress.");
    }
}

function updateStatusText(status) {
    statusText.innerText = status;
}