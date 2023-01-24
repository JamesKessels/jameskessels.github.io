projName = document.getElementById("projName");
const projText = document.getElementById("projText");
const projLang = document.getElementById("projLang");
const projTool = document.getElementById("projTool");

const titleText = document.getElementById("titleText");
const abtText = document.getElementById("abtText");
const proficienciesTitle = document.getElementById("proficienciesTitle");
const proficienciesText = document.getElementById("proficienciesText");
const hireText = document.getElementById("whyHire");
const carousel = document.getElementById("projCarousel");

const projectBtns = document.getElementsByClassName("projectBtn");
const cardTitles = document.getElementsByClassName("card-caption");
const cardTexts = document.getElementsByClassName("card-text");

let projects = JSON.parse(projectsEN);
let projectImages = JSON.parse(projImg);
let currentLang = "btnradio1";
let currProject = 0;

const cardBtns = document.querySelectorAll('[data-button="card"]');

mainText();
changeText(currProject);

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
        lang = "English";
    }
    else {
        projects = JSON.parse(projectsNL);
        lang = "Dutch";
    }

    changeCardBtns(lang);
    changeText(currProject);
    mainText();
}

function mainText() {
    for (let i = 0; i < projectBtns.length; i++) {
        projectBtns[i].onclick = function () { changeText(i) }
        try {
            projectBtns[i].innerText = projects[i].projectName;
        }
        catch {
            if (currentLang == "btnradio1") {
                projectBtns[i].innerHTML = "<i>COMING SOON</i>";
            }
            else {
                projectBtns[i].innerHTML = "<i>KOMT BINNENKORT</i>";
            }
            projectBtns[i].className += " disabled"
        }
    }

    if (currentLang == "btnradio1") {
        document.querySelector("#othersText").innerText = "Others"
    }
    else {
        document.querySelector("#othersText").innerText = "Overig"
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
    }

    updateCarousel(projectNr);
}

function changeCards() {
    for (let i = 0; i < cardTitles.length; i++) {
        cardTitles[i].innerText = projects[i].projectName;
        cardTexts[i].innerText = projects[i].cardText;
    }
}

function updateCarousel(projectNr) {
    carousel.innerHTML = "";

    for (let i = 0; i < projectImages[projectNr].img[1]; i++) {
        let carItem = document.createElement("div");
        let carImg = document.createElement("img");

        carImg.className = "d-block w-100";
        carImg.src = "asset/image/projects/" + projectImages[projectNr].img[0] + "/" + i + ".png";
        carItem.append(carImg);

        carItem.className = "carousel-item";

        if (i == 0) {
            carItem.className += " active";
        }
        carousel.append(carItem);
    }

    if (projectImages[projectNr].img[1] <= 1) {
        document.querySelector(".carousel-control-prev").hidden = true;
        document.querySelector(".carousel-control-next").hidden = true;
    }
    else {
        document.querySelector(".carousel-control-prev").hidden = false;
        document.querySelector(".carousel-control-next").hidden = false;
    }
}

function changeExtras() {
    if (currentLang == "btnradio1") {   
        document.querySelector("#abtLink").innerHTML = "About&nbsp;Me";
        document.querySelector("#profLink").innerHTML = "Proficiencies";
        document.querySelector("#projLink").innerHTML = "Projects";
        document.querySelector("#contLink").innerHTML = "Contact";
        document.querySelector("#emailText").innerHTML = "&nbsp;Email&nbsp;Me!";
        document.querySelector("#langText").innerHTML = "Languages";
        document.querySelector("#welcomeText").innerHTML = "Welcome to my portfolio.";
        document.querySelector("#scrollBounce").innerHTML = "&darr; Scroll Down &darr;";
    }
    else {
        document.querySelector("#abtLink").innerHTML = "Over&nbsp;Mij";
        document.querySelector("#profLink").innerHTML = "Vaardigheden";
        document.querySelector("#projLink").innerHTML = "Projecten";
        document.querySelector("#contLink").innerHTML = "Contact";
        document.querySelector("#emailText").innerHTML = "&nbsp;Mail&nbsp;Mij!";
        document.querySelector("#langText").innerHTML = "Talen";
        document.querySelector("#welcomeText").innerHTML = "Welkom op mijn portfolio.";
        document.querySelector("#scrollBounce").innerHTML = "&darr; Scroll Omlaag &darr;";
    }
}