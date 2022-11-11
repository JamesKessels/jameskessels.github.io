// variables
const rollBtn = document.querySelector("#roll");
rollBtn.addEventListener("click", function () {roll()});

const rollText = document.querySelector(".rollContainer");
const statusText = document.querySelector(".statusContainer");

const player = {
    playerId: 0,
    playerSpace: 0,
    jailed: false,

    playerName: 0,
    playerColor: 0,
}
const players = [];
const colors = ["red", "green", "blue", "yellow", "purple", "orange"];

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

    if (!(dead || players[movingPlayer].playerSpace + dir < 0)) { players[movingPlayer].playerSpace += dir; }
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

        updateStatusText(players[currPlayer].playerName + " has perished.");
    }
    if (currSpace.contains("jail")) {
        callback = function() {
            players[movingPlayer].jailed = true;
        }

        updateStatusText(players[currPlayer].playerName + " is in jail. They will skip the next turn.");
    }
    if (currSpace.contains("leap")) {
        callback = function() {
            determinePlayerStatus()
        }
        repetitions = 3;
        afterRepeat = function() {checkSpace(movingPlayer)};

        updateStatusText(players[currPlayer].playerName + " leaps forward another 3 spaces!");
    }
    if (currSpace.contains("back")) {
        callback = function() {
            determinePlayerStatus(false, -1);
        }
        repetitions = 3;
        afterRepeat = function() {checkSpace(movingPlayer)};

        updateStatusText(players[currPlayer].playerName + " falls back 3 spaces.");
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
                updateStatusText(players[currPlayer].playerName + " leaps forward another 3 spaces!");
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

            statusText.innerHTML = players[currPlayer].playerName + " has sent their ";
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
            if (currPlayer < (maxPlayers - 1))
                currPlayer++;
            else
                currPlayer = 0;

            updateText();
            updateButton();
        }

        if (players[currPlayer].jailed === true) {
            players[currPlayer].jailed = false;

            updateStatusText((players[currPlayer].playerName + " is still in jail. They will be freed on their next turn."));

            setLimitedInterval(function() {}, 2000, 1, function() {nextTurn()});
        }
        else {
            rollBtn.disabled = false;
        }
    }
}

function winCheck(win) {
    if (win) {
        statusText.innerHTML = players[currPlayer].playerName + " wins!";
    }
}

function updateText() {
    let indicatorText = document.querySelector(".indicator");
    indicatorText.className = "indicator " + colors[players[currPlayer].playerColor].toString();
    indicatorText.children[0].innerText = players[currPlayer].playerName;
}

function updateButton() {
    rollBtn.dataset.bgcol = colors[players[currPlayer].playerColor];
}

function updateRollText(roll, progress = true) {
    rollText.innerHTML = players[currPlayer].playerName + "'s roll: " + roll;

    if (!progress) {
        updateStatusText(players[currPlayer].playerName + " could not progress.");
    }
}

function updateStatusText(status) {
    statusText.innerText = status;
}