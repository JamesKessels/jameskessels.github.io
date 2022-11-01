const projName = document.getElementById("projName");
const projText = document.getElementById("projText");
const projLang = document.getElementById("projLang");
const projTool = document.getElementById("projTool");

const titleText = document.getElementById("titleText");
const abtText = document.getElementById("abtText");
const proficienciesTitle = document.getElementById("proficienciesTitle");
const proficienciesText = document.getElementById("proficienciesText");

const projectBtns = document.getElementsByClassName("projectBtn");
const cardTitles = document.getElementsByClassName("card-caption");
const cardTexts = document.getElementsByClassName("card-text");

let projects = JSON.parse(projectsEN);
let generalText = JSON.parse(generalEN);
let currentLang = "";
let currProject = 0;

const cardBtns = document.querySelectorAll('[data-button="card"]');
console.log(cardBtns);

mainText();
changeCards();
changeText(0);

const radioButtons = document.querySelectorAll("input");
for (const radioButton of radioButtons) {
    radioButton.addEventListener("click", function () {
        currentLang = radioButton.id;
        changeLang(currentLang);
    });
}

function changeLang(language) {
    let lang;
    if (language == "btnradio1") {
        projects = JSON.parse(projectsEN);
        generalText = JSON.parse(generalEN);
        lang = "English";
    }
    else {
        projects = JSON.parse(projectsNL);
        generalText = JSON.parse(generalNL);
        lang = "Dutch";
    }

    changeCardBtns(lang);
    changeText(currProject);
    changeCards();
    mainText();
}

function mainText() {
    titleText.innerHTML = generalText[0].about[0];
    abtText.innerHTML = generalText[0].about[1];
    proficienciesTitle.innerHTML = generalText[0].proficiencies[0];
    proficienciesText.innerHTML = generalText[0].proficiencies[1];

    for (let i = 0; i < projectBtns.length; i++) {
        projectBtns[i].onclick = function () { changeText(i) }
        try {
            projectBtns[i].innerText = projects[i].projectName;
        }
        catch {
            projectBtns[i].innerHTML = "<i>No project</i>";
            projectBtns[i].className += " disabled"
        }
    }
}

function changeCardBtns(lang) {
    for (let j = 0; j < cardBtns.length; j++) {
        if (lang == "English") {
            cardBtns[j].innerText = "View Project";
        }
        else {
            cardBtns[j].innerText = "Bekijk Project";
        }
    }
}

function changeText(projectNr) {
    currProject = projectNr;
    projTool.innerHTML = "";
    projLang.innerHTML = "";

    try {
        projName.innerHTML = projects[projectNr].projectName;
        projText.innerHTML = projects[projectNr].projectText;

        for (let i = 0; i < projects[projectNr].projectLanguages.length; i++) {
            projLang.innerHTML += "<li>" + projects[projectNr].projectLanguages[i] + "</li>";
        }

        for (let i = 0; i < projects[projectNr].projectTools.length; i++) {
            projTool.innerHTML += "<li>" + projects[projectNr].projectTools[i] + "</li>";
        }
    }

    catch (error) {
        projName.innerHTML = "No project :("
        projText.innerHTML = "Sorry, this project cannot be found!"
        console.log(error);
    }
}

function changeCards() {
    for (let i = 0; i < cardTitles.length; i++) {
        cardTitles[i].innerText = projects[i].projectName;
        cardTexts[i].innerText = projects[i].cardText;
    }
}