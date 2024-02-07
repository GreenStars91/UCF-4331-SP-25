
/*
Password.onfocus = function () 
{
  document.getElementById("message").style.display = "block";
}

Password.onblur = function () 
{
  document.getElementById("message").style.display = "hidden";
}
*/
Password.onkeyup = function () 
{
    ValidateRegister();
}

function PswdCheck() 
{
    var Password = document.getElementById("registerPassword");
    var Password2 = document.getElementById("registerPassword2");
    var letterC = document.getElementById("letterC");
    var capitalC = document.getElementById("capitalC");
    var numberC = document.getElementById("numberC");
    var specialC = document.getElementById("specialC");
    var lengthC = document.getElementById("lengthC");
    var matchC = document.getElementById("matchC");

    var error = 0;
    console.log(Password.value);
    
    // Letter Test
    if (Password.value.match(/[a-z]/g)) {
        letterC.classList.remove("invalid");
        letterC.classList.add("valid");
    } else {
        letterC.classList.remove("valid");
        letterC.classList.add("invalid");
        error = 1;
    }
    // Capital Test
    if (Password.value.match(/[A-Z]/g)) {
        capitalC.classList.remove("invalid");
        capitalC.classList.add("valid");
    } else {
        capitalC.classList.remove("valid");
        capitalC.classList.add("invalid");
        error = 1;
    }
    // Number Test
    if (Password.value.match(/[0-9]/g)) {
        numberC.classList.remove("invalid");
        numberC.classList.add("valid");
    } else {
        numberC.classList.remove("valid");
        numberC.classList.add("invalid");
        error = 1;
    }
    // Special Test
    if (Password.value.match(/[@$!%*?&]/g)) {
        specialC.classList.remove("invalid");
        specialC.classList.add("valid");
    } else {
        specialC.classList.remove("valid");
        specialC.classList.add("invalid");
        error = 1;
    }
    // Length Test
    if (Password.value.length >= 8) {
        lengthC.classList.remove("invalid");
        lengthC.classList.add("valid");
    } else {
        lengthC.classList.remove("valid");
        lengthC.classList.add("invalid");
        error = 1;
    }
    // Match Test
    if (Password.value == Password2.value) {
        matchC.classList.remove("invalid");
        matchC.classList.add("valid");
    } else {
        matchC.classList.remove("valid");
        matchC.classList.add("invalid");
        error = 1;
    }

    return error;
}

function ValidateRegister()
{
    var error = 0;
    if (PswdCheck() == 0) {
        document.getElementById("confirmRegister").disabled = false;
    }
    else 
    {
        document.getElementById("confirmRegister").disabled = true;
    }
}