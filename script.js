const API_URL = "https://hickory-quilled-actress.glitch.me/computers";
let computerData = [];


//Elements
const loanBtn = document.getElementById('loan');
const workBtn = document.getElementById('work');
const bankBtn = document.getElementById('bank');
const repayBtn = document.getElementById('repay');
const buyBtn = document.getElementById('repay');
const dropdownBtn = document.getElementsByClassName('dropdownBtn')[0];
const dropdownBtnText = dropdownBtn.getElementsByTagName('span')[0];
const outstandingValueElem = document.getElementById('outstanding');
const balanceElem = document.getElementById('balance');
const salaryElem = document.getElementById('salary');

//Event listeners
loanBtn.addEventListener("click", increaseLoan);
workBtn.addEventListener("click", increaseSalary);
bankBtn.addEventListener("click", transferSalary);
repayBtn.addEventListener("click", decreaseLoan);
buyBtn.addEventListener("click", buyComputer);

//Values
let outstanding = 0;
let balance = 0;
let salary = 0;
let loanTaken = false;

balanceElem.innerHTML = balance;
salaryElem.innerHTML = salary;

//Avoke function
fetchComputerData();


function increaseLoan(){
    userInput = parseInt(prompt("Enter amount")); 
    let loanApproval = checkLoanApproval(userInput);

    if(loanApproval){
        outstanding += userInput;
        balance += userInput;
        document.getElementById("outstandingloan-section").style.display="flex";
        outstandingValueElem.innerHTML = outstanding;
        repayBtn.style.display = "inline";
        updateValues();
    }else{
        alert("You are not allowed to take a loan")
    }
  
}

function increaseSalary(){
    salary += 100;
    salaryElem.innerHTML = salary;
}

function transferSalary(){
    if(outstanding > 0){
        outstanding += salary * 0.1;
        balance += salary * 0.9; 
    }else{
        balance += salary;
    }
    
    salary = 0 ;
    updateValues();
}

function decreaseLoan(){
    console.log("hej");
    let diff = salary-outstanding;
    outstanding -= outstanding;
    balance += diff;
    salary = 0;
    updateValues();
}

function updateValues(){
    balanceElem.innerHTML = balance;
    salaryElem.innerHTML = salary;
    outstandingValueElem.innerHTML = outstanding;
}

function checkLoanApproval(userInput){

    if(userInput > (balance * 2)){// checks if loan is more than double of bank balance 
        return false
    }else if(loanTaken){ // checks if a loan is already taken 
        return false
    }else{
        return true
    }
}

function fetchComputerData(){
    fetch(API_URL)
    .then(response => response.json())
    .then(json => {
        computerData = json
        console.log("THE FETCH JSON DATA", json);
        displayDropdownContent();

    })
    .catch(error => console.error(error.message))
}

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

    showDetails();

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

    for (key in computerData) {
        if(computerData[key].title == selected){
            let specs = computerData[key].specs;
            compDescription.innerHTML = computerData[key].description;
            compPrice.innerHTML = computerData[key].price;
            compImg.style.visibility = "visible";
            compImg.src = "https://hickory-quilled-actress.glitch.me/" + computerData[key].image;

            compImg.onerror = function() { //  check if an img error occurs 
                compImg.src="no_image_placeholder.png";
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

function buyComputer(){

}