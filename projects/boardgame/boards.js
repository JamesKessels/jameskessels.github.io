// boards, action spaces, other general variables
let boards = [
    [
        [
            0 , 1 , 2 , 3 , "", "", 10, 11, 12, 13
        ],
        [
            "", "", "", 4 , "", "", 9 , "", "", 14
        ],
        [
            50, "", "", 5 , 6 , 7 , 8 , "", "", 15
        ],
        [
            49, 48, 47, "", "", "", "", 18, 17, 16
        ],
        [
            "", "", 46, "", "", "", "", 19, "", ""
        ],
        [
            "", "", 45, "", "", "", "", 20, "", ""
        ],
        [
            42, 43, 44, "", "", "", "", 21, 22, 23
        ],
        [
            41, "", "", 34, 33, 32, 31, "", "", 24
        ],
        [
            40, "", "", 35, "", "", 30, "", "", 25
        ],
        [
            39, 38, 37, 36, "", "", 29, 28, 27, 26
        ],
    ],
    [
        [
            0,  1,  2,  3,  4,  5,  6,  7,  8,  9
        ],
        [
            "", "", "", "", "", "", "", "", "", 10
        ],
        [
            "", "", "", "", "", "", "", "", "", 11
        ],
        [
            "", "", "", "", "", "", "", "", "", 12
        ],
        [
            22, 21, 20, 19, 18, 17, 16, 15, 14, 13
        ],
        [
            23, "", "", "", "", "", "", "", "", ""
        ],
        [
            24, "", "", "", "", "", "", "", "", ""
        ],
        [
            25, "", "", "", "", "", "", "", "", 38
        ],
        [
            26, "", "", "", "", "", "", "", "", 37
        ],
        [
            27, 28, 29, 30, 31, 32, 33, 34, 35, 36
        ],
    ],
    [
        [
            0,  1,  2,  3,  4,  5,  6,  7,  8,  9
        ],
        [
            "", "", "", "", "", "", "", "", "", 10
        ],
        [
            34, 35, 36, 37, 38, 39, 40, 41, "", 11
        ],
        [
            33, "", "", "", "", "", "", 42, "", 12
        ],
        [
            32, "", 54, 55, 56, 57, "", 43, "", 13
        ],
        [
            31, "", 53, "", "", 58, "", 44, "", 14
        ],
        [
            30, "", 52, "", "", "", "", 45, "", 15
        ],
        [
            29, "", 51, 50, 49, 48, 47, 46, "", 16
        ],
        [
            28, "", "", "", "", "", "", "", "", 17
        ],
        [
            27, 26, 25, 24, 23, 22, 21, 20, 19, 18
        ]
    ]
]

let currBoard = [];
let maxSpaces = 0;
let maxPlayers = 0;

let boardDivs = document.querySelectorAll(".board");

const actionSpaces = [
    ["jail", 0, 1],
    ["leap", 0, 5],
    ["back", 0, 5],
    ["firstBack", 0, 1],
    ["death", 0, 1]
];

//functions
function generateBoard(boardId = 0, board) {
    board //get gameboard @ ".board"

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

        board.append(boardRow); //append row to board
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