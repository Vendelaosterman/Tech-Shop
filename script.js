//Elements
const loanBtn = document.getElementById('loan');
const workBtn = document.getElementById('work');
const bankBtn = document.getElementById('bank');
const repayBtn = document.getElementById('repay');
const buyBtn = document.getElementById('buy');
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
const API_URL = "https://hickory-quilled-actress.glitch.me/computers";
let computerData = [];
let outstanding = 0;
let balance = 0;
let salary = 0;
let selected = "";

balanceElem.innerHTML = balance;
salaryElem.innerHTML = salary;

fetchComputerData();

//increase the loan 
function increaseLoan(){
    let userInput = prompt("enter amount");
    userInput = parseInt(userInput);

    if(isNaN(userInput) || userInput === null){
        return
    }
    
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

//increase the salary
function increaseSalary(){
    salary += 100;
    salaryElem.innerHTML = salary;
}

//transfer the salary 
function transferSalary(){
    if(outstanding > 0){
        outstanding -= salary * 0.1;
        balance += salary * 0.9; 
    }else{
        balance += salary;
    }
    
    salary = 0 ;
    updateValues();
}

//decrease loan 
function decreaseLoan(){
    let diff = salary-outstanding;
    outstanding -= outstanding;
    balance += diff;
    salary = 0;
    updateValues();
}


// updates the values in joe banker and work section
function updateValues(){
    balanceElem.innerHTML = balance;
    salaryElem.innerHTML = salary;
    outstandingValueElem.innerHTML = outstanding;
}

// checks if the user can take a loan 
function checkLoanApproval(userInput){

    // checks if loan is less than double of bank balance or if there is already a loan 
    if(userInput <  (balance * 2) && outstanding == 0){
        //isApproved = true;
        return true
    }else{
        return false
    }
}

// call API and fetch data 
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


// display contents of the dropdown btn
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
            currentLaptop = this.innerHTML;
            showDetails();
        });
    }

    showDetails();

}

// display details of the computer 
function showDetails(){

    selected = dropdownBtnText.innerHTML;

    let compName = document.getElementsByClassName('name')[0];
    let compDescription = document.getElementsByClassName('description')[0];
    let compPrice = document.getElementsByClassName('price')[0];
    let compImg = document.getElementsByClassName('computerImg')[0];

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
                compImg.src="img/no_image_placeholder.png";
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

// checks if the user can buy a computer or not 
function buyComputer(){

    for (key in computerData) {
        if(computerData[key].title == selected){
            if (balance < computerData[key].price){
                alert("Unfortunately, you don't have enough money in your bank account")
            }else{
                balance -= computerData[key].price;
                alert("Congratulations! You are now the owner of the " + selected);
                updateValues();
            }
        }
    }
}