// variables
const debugContainer = document.createElement("div");
debugContainer.className = "debug mt-3";
const rollContainer = document.querySelector(".rollContainer");

createDice();
rollContainer.parentNode.insertBefore(debugContainer, rollContainer);

const debugDice = document.querySelectorAll(".debugRolls");
debugDiceFunction();

// functions
function createDice() {
    for (let i = 1; i < 7; i++) {
        let dice = document.createElement("button");
        dice.className = "debugRolls";
        dice.innerText = i;
        debugContainer.append(dice);
    }
}

function toggleDebugButtons(onOff = false) {
    for (let i = 0; i < debugDice.length; i++) {
        debugDice[i].disabled = onOff;
    }
}

function debugDiceFunction() {
    for (let i = 0; i < debugDice.length; i++) {
        debugDice[i].addEventListener("click", function() {roll(true, (i + 1))});
    }
}