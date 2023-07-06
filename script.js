const API_URL = "https://hickory-quilled-actress.glitch.me/computers";
let computerData = [];
const dropdownBtn = document.getElementsByClassName('dropdownBtn')[0];
const dropdownBtnText = dropdownBtn.getElementsByTagName('span')[0];

getComputerData();

// XMLHTTP req

function getComputerData() {
    let req = new XMLHttpRequest();
    req.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        computerData = JSON.parse(this.responseText);
        //response = JSON.parse(this.responseText);
        displayDropdownContent() 
        showDetails();
      }
    };
    req.open("GET", API_URL, true);
    req.send();
}

// FETCH async 

function displayDropdownContent(){

    let dropdownDiv = document.getElementsByClassName('dropdown-content')[0];

    dropdownBtnText.innerHTML = computerData[0].title; // default value 

    for (key in computerData) {
        let title = computerData[key].title;
        let pTag = document.createElement('p');
        dropdownDiv.appendChild(pTag);
        pTag.innerHTML = title;
        pTag.addEventListener("click", function(){
            dropdownBtnText.innerHTML = this.innerHTML;
            showDetails();
        });
    }

}

function showDetails(){

    let selected = dropdownBtnText.innerHTML;

    let compName = document.getElementsByClassName('name')[0];
    let compDescription = document.getElementsByClassName('description')[0];
    let compPrice = document.getElementsByClassName('price')[0];
    let compImg = document.getElementsByClassName('computerImg')[0];
    let errorMsg = document.getElementsByClassName('errorMsg')[0];

    dropdownBtnText.innerHTML = selected;
    compName.innerHTML = selected;

    let featuresDiv = document.getElementsByClassName('features')[0];
    let ulElem = featuresDiv.getElementsByTagName('ul')[0];
    while (ulElem.firstChild) {
        ulElem.removeChild(ulElem.firstChild);
    }

    errorMsg.style.visibility = "hidden";

    for (key in computerData) {
        if(computerData[key].title == selected){
            let specs = computerData[key].specs;
            compDescription.innerHTML = computerData[key].description;
            compPrice.innerHTML = computerData[key].price;
            compImg.style.visibility = "visible";
            compImg.src = "https://hickory-quilled-actress.glitch.me/" + computerData[key].image;

            compImg.onerror = function() { //  check if an img error occurs 
                compImg.style.visibility = "hidden";
                errorMsg.style.visibility = "visible";
            }

            for (key in specs) {
                let ulElem = featuresDiv.getElementsByTagName('ul')[0];
                let liElem = document.createElement('li');
                liElem.innerHTML = specs[key];
                ulElem.appendChild(liElem);
            }
        }
    }
}

 /*async function fetchComputerDetails(){
    try{
        const response = await fetch(API_URL);
        const json = await response.json();
        computerAsync = json;
        console.log("Log from inside the async funktion", computerAsync)
    }

    catch(error){
        console.error(error.message);
    }
}

getSomeDataAsync(){
    console.log("log from global context", computerAsync);
}*/ 


// FETCH

/*function newFetch(){
    fetch(API_URL)
    .then(response => response.json())
    .then(json => {
        computerData = json
        console.log("THE FETCH JSON DATA", json);
    })
    .catch(error => console.error(error.message))
}*/