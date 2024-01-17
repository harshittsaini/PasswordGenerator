const slider = document.querySelector("[data-rangeSlider]");
const indicator = document.querySelector("[data-indicator]");
const displayPass = document.querySelector("[data-displayPassword]");
const lengthNum = document.querySelector("[data-lengthNum]");
const copyMsg = document.querySelector("[data-copyMsg]");
const copyBtn = document.querySelector("[data-copyButton]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const symbols = '~!@#$%^&*()_+{[}]/?<>'

// for all checkboxes
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
const generatePass = document.querySelector(".generate-btn");

let password = "";
let passwordLength = 8;
let checkCount = 0;
handleSlider();
// set strength circle to grey
setIndicator("#ccc");

function handleSlider(){
    slider.value = passwordLength;
    lengthNum.innerText = passwordLength;
    //slider distance covered
    const min = slider.min;
    const max = slider.max;

    slider.style.backgroundSize = ((passwordLength - min) * 100 / (max-min) + "% 100%");
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    //shadow
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndNmbr(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

function generateRndNumbr(){
    return getRndNmbr(0,9);
}

function generateUpprcase(){
    return String.fromCharCode(getRndNmbr(65,91));
}

function generateLowercase(){
    return String.fromCharCode(getRndNmbr(97,123));
}

function generateSymbl(){
    const rndNum = getRndNmbr(0, symbols.length)
    return symbols.charAt(rndNum);
}

function calcStrength(){
    let hasLower = false;
    let hasUpper = false;
    let hasNum = false;
    let hasSymbol = false;

    if(lowerCheck.checked) hasLower = true;
    if(upperCheck.checked) hasUpper = true;
    if(numCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSymbol = true;

    if(hasLower && hasUpper && (hasNum || hasSymbol) && passwordLength >= 9){
        setIndicator("#0f0");
    }
    else if((hasLower || hasUpper) && (hasNum || hasSymbol) && passwordLength >=6){
        setIndicator("#ff0");
    }
    else{
        setIndicator("#f00");
    }
}

async function copyContent(){
    try{
        await navigator.clipboard.writeText(displayPass.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(() => {
        copyMsg.classList.remove("active");
    }, 1000);
}

function shufflePassword(array){
    //fisher yates method
    for(let i = array.length - 1; i > 0; i--){
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i+1));
        //swap i & j
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckboxes.forEach((checkbox) => {
        if(checkbox.checked){
            checkCount++;
        }
    })

    //special condition
    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

slider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', (e) => {
    if(displayPass.value){
        copyContent();
    }
})

generatePass.addEventListener('click', (e) => {
    if(checkCount == 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //to find new password

    //remove old password
    password = "";

    // let's put the stuff mentioned by checkboxes
    let funcArry = [];

    if(upperCheck.checked)
        funcArry.push(generateUpprcase);
    if(lowerCheck.checked)
        funcArry.push(generateLowercase);
    if(numCheck.checked)
        funcArry.push(generateRndNumbr);
    if(symbolCheck.checked)
        funcArry.push(generateSymbl);

    //compulsory addition
    for(let i = 0; i<funcArry.length; i++){
        password += funcArry[i]();
    }

    // remaining addition
    for(let i=0; i<passwordLength-funcArry.length; i++){
        let randIndex = getRndNmbr(0, funcArry.length);
        password += funcArry[randIndex]();
    }

    password = shufflePassword(Array.from(password));
    displayPass.value = password;

    calcStrength();
})