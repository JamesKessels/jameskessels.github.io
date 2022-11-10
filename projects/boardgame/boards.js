// boards, action spaces, other general variables
let boards = [
    [
        [
            0,  1,  2,  3,  "", "", "", "", "", ""
        ],
        [
            "", "", "", 4,  "", "", "", "", "", ""
        ],
        [
            "", 43, "", 5,  "", "", "", "", "", ""
        ],
        [
            "", 42, "", 6,  7,  8,  9,  10, 11, 12
        ],
        [
            "", 41, "", "", "", "", "", "", "", 13
        ],
        [
            "", 40, 39, 38, 37, 36, "", "", "", 14
        ],
        [
            "", "", "", "", "", 35, "", "", "", 15
        ],
        [
            29, 30, 31, 32, 33, 34, "", "", "", 16
        ],
        [
            28, "", "", "", "", "", "", "", "", 17
        ],
        [
            27, 26, 25, 24, 23, 22, 21, 20, 19, 18
        ],
    ]
]

let currBoard = [];
let maxSpaces = 0;
let maxPlayers = 4;

const actionSpaces = [
    ["jail", 0, 1],
    ["leap", 0, 5],
    ["back", 0, 5],
    ["firstBack", 0, 1],
    ["death", 0, 1]
];

document.body.onload = function() {generateBoard(0); boardPlacements()};

//functions
function generateBoard(boardId = 0) {
    let gameBoard = document.querySelector(".board"); //get gameboard @ ".board"

    // looping through array board
    for (let row = 0; row < boards[boardId].length; row++) { //for each row
        let boardRow = document.createElement("div"); // create row div
        boardRow.className = "d-flex flex-row"; //set row class

        for (let space = 0; space < boards[boardId][row].length; space++) { //for each space
            let boardSpace = document.createElement("div"); //create space div

            boardSpace.className = "empty"; //set space class to empty by default

            let thisSpace = boards[boardId][row][space]; //set thisSpace to current space in array

            if (thisSpace !== '') { //check if corresponding space in board array has a value
                boardSpace.className = "space"; //set space class to "space"
                boardSpace.dataset.spaceNr = thisSpace.toString(); //give space numeric value
            }

            boardRow.append(boardSpace); //append space to row
        }

        gameBoard.append(boardRow); //append row to board
    }

    maxSpaces = document.querySelectorAll(".space").length;

    for (let space = 0; space < maxSpaces; space++) {
        let selector = '[data-space-nr="' + space + '"]';

        currBoard.push(document.querySelector(selector));
    }
}

function boardPlacements() {
    //find first space, place players there
    setInitialPositions();

    //find last space, place win space there
    setWin();

    //set Action Spaces
    setActionSpaces();
}

function setInitialPositions() {
    for (let player = 0; player < maxPlayers; player++) {
        let boardPlayer = document.createElement("div");
        boardPlayer.className = "player";
        boardPlayer.dataset.player = (player).toString();

        currBoard[0].append(boardPlayer);
    }
}

function setWin() {
    currBoard[(currBoard.length - 1)].className += " win";
}

function setActionSpaces() {
    while(!allActionSpaces()) {
        // loop through each space of the board, and do this until all spaces have been placed
        for (let space = 1; space < maxSpaces; space++) {
            // on each space, go through the following checklist; assume that for each step that does not have sub-steps, the previous steps yield "true"
            // if any of these do not yield the desired result, "continue"
            let actionSpaceHere = (Math.random() * 50); // 1. randomly generate a number to decide whether or not an action space should be placed on the current space

            if (!(actionSpaceHere < 5)) { continue } // 2. check if randomized number meets threshold
            if (!(currBoard[space].className === "space")) { continue } // 3. check if the selected space does not have an action space assigned to it
            let zone = determineZone(space);
            let spacePicked;

            // 4. check for space zones (specific zones TBD, for now just use the original zones)
            if (zone === "general") { // 4.1. if in "general zone", randomly generate which space should appear.
                spacePicked = Math.floor(Math.random() * (actionSpaces.length - 1));
            }
            else {
                spacePicked = (actionSpaces.length - 1);
            }
            // 5. determine whether space has appeared max amount of times
            if (!(actionSpaces[spacePicked][1] < actionSpaces[spacePicked][2])) { continue }

            // 6.1. if the currently selected Action Space is a leap space, or a first-back space, check if the space 3 spaces ahead is a "back" space [SHOULD BE FALSE TO CONTINUE]
            if (actionSpaces[spacePicked][0] === "leap" || actionSpaces[spacePicked][0] === "firstBack") {
                if (currBoard[space + 3].classList.contains("back")) { continue }
            }

            // 6.2 if the currently selected Action Space is a back space, check if the space 3 spaces back is a leap/first-back space. [SHOULD BE FALSE TO CONTINUE]
            if (actionSpaces[spacePicked][0] === "back") {
                try {
                    if (currBoard[space - 3].classList.contains("leap") || currBoard[space - 3].classList.contains("firstBack")) { continue }
                }

                catch {
                    console.log("could not check 3 spaces back");
                }
            }



            // 7. place space.
            currBoard[space].className += " " + actionSpaces[spacePicked][0];
            actionSpaces[spacePicked][1]++;
        }
    }
}

function determineZone(space) {
    if (space < maxSpaces - 6 || space > maxSpaces - 2) {
        return "general";
    }

    return "death";
}

function allActionSpaces() {
    for (let i = 0; i < actionSpaces.length; i++) {
        if (actionSpaces[i][1] < actionSpaces[i][2]) {
            return false
        }
    }

    return true;
}