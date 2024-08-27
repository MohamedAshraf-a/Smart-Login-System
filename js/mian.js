"use strict";

// Select the HTML elements
var signinEmail = document.querySelector("#signinEmail");
var signinPassword = document.querySelector("#signinPassword");
var btnSignin = document.querySelector("#btnSignin");

var SignupBox = document.querySelector("#SigupBox");
var SigninBox = document.querySelector("#SigninBox");

var SignUp = document.querySelector("#Signup");
var Signin = document.querySelector("#Signin");

var signupName = document.querySelector("#signupName");
var signupEmail = document.querySelector("#signupEmail");
var signupPassword = document.querySelector("#signupPassword");
var btnSignup = document.querySelector("#btnSignup");

var lightBoxContainer = document.querySelector("#lightBoxContainer");
var closeLightBox = document.querySelector("#lightBoxContainer");

var lightBoxContainerError = document.querySelector(".errorCont");

var wrongLogin = document.querySelector("#wrongLogin");
var emptyInputs = document.querySelector("#emptyInputs");

var profile = document.querySelector("#profile");
var profilePic = document.querySelector("#profilePic");
var profileName = document.querySelector("#profileName");

var btnLogout = document.querySelector("#btnLogout");

var accountsList =
  localStorage.getItem("accountsList") == null
    ? []
    : JSON.parse(localStorage.getItem("accountsList"));

// Event listeners
signupEmail.addEventListener("keydown", function (e) {
  var EmailValue = e.target.value;
  if (validateEmail(EmailValue)) {
    signupEmail.classList.add("is-valid");
    signupEmail.classList.remove("is-invalid");
  } else {
    signupEmail.classList.remove("is-valid");
    signupEmail.classList.add("is-invalid");
  }
});

signupName.addEventListener("keydown", function (e) {
  var NameValue = e.target.value;
  if (validateName(NameValue)) {
    signupName.classList.add("is-valid");
    signupName.classList.remove("is-invalid");
  } else {
    signupName.classList.remove("is-valid");
    signupName.classList.add("is-invalid");
  }
});

signupPassword.addEventListener("keydown", function (e) {
  var passwordValue = e.target.value;
  if (validatePass(passwordValue)) {
    signupPassword.classList.add("is-valid");
    signupPassword.classList.remove("is-invalid");
  } else {
    signupPassword.classList.remove("is-valid");
    signupPassword.classList.add("is-invalid");
  }
});

Signin.addEventListener("click", function () {
  SigninMode();
});

SignUp.addEventListener("click", function () {
  SignupMode();
});

btnSignup.addEventListener("click", function () {
  var name = signupName.value;
  var email = signupEmail.value;
  var password = signupPassword.value;
  var image = document.querySelector("#profileImage").files[0]; // Get the selected file

  if (
    validateEmail(email) &&
    validatePass(password) &&
    validateName(name) &&
    image
  ) {
    if (isEmailUsed(email)) {
      showLightBoxError("Email is already used."); // Show error message for used email
    } else {
      var reader = new FileReader();
      reader.onload = function (e) {
        var addList = {
          Name: name,
          Email: email, 
          password: password,
          image: e.target.result,
        };
        console.log(accountsList, "  Addlist ", addList);

        accountsList.push(addList);
        localStorageUpdate();
        showLightBox();
        AccountMode(name, e.target.result);
      };
      reader.readAsDataURL(image); // Read the image file
    }
  } else {
    showLightBoxError("Please fill out all fields correctly.");
  }
});

btnSignin.addEventListener("click", function () {
  var pass = signinPassword.value;
  var em = signinEmail.value;

  if (searchAccount(em, pass)) {
    var account = accountsList.find(
      (acc) => acc.Email && acc.Email.toLowerCase() === em.toLowerCase()
    );
    if (account) {
      AccountMode(account.Name, account.image);
    }
  } else {
    if (em === "" && pass === "") {
      emptyInputs.classList.remove("d-none");
    } else {
      wrongLogin.classList.remove("d-none");
    }
  }
});

signinEmail.addEventListener("keypress", function (event) {
  if (event.key == "Enter") {
    var pass = signinPassword.value;
    var em = signinEmail.value;

    if (searchAccount(em, pass)) {
      var account = accountsList.find(
        (acc) => acc.Email && acc.Email.toLowerCase() === em.toLowerCase()
      );
      if (account) {
        AccountMode(account.Name, account.image);
      }
    } else {
      if (em === "" && pass === "") {
        emptyInputs.classList.remove("d-none");
      } else {
        wrongLogin.classList.remove("d-none");
      }
    }
  }
});

lightBoxContainerError.addEventListener("click", function () {
  lightBoxContainerError.classList.add("d-none");
});

signinEmail.addEventListener("keydown", function () {
  emptyInputs.classList.add("d-none");
  wrongLogin.classList.add("d-none");
});

signinPassword.addEventListener("keydown", function () {
  emptyInputs.classList.add("d-none");
  wrongLogin.classList.add("d-none");
});

btnLogout.addEventListener("click", function () {
  console.log("Logout");
  LogoutMode();
  clearInputs();
});

closeLightBox.addEventListener("click", hideLightBox);

document.addEventListener("keyup", function (event) {
  if (event.key === "Escape") {
    hideLightBox();
  }
});

function SignupMode() {
  SigninBox.classList.add("d-none");
  SignupBox.classList.remove("d-none");
}

function SigninMode() {
  SignupBox.classList.add("d-none");
  SigninBox.classList.remove("d-none");
}
function localStorageUpdate() {
  // Limit the number of accounts stored
  const maxAccounts = 100; // Example limit
  if (accountsList.length > maxAccounts) {
    accountsList = accountsList.slice(-maxAccounts); // Keep only the latest 'maxAccounts' entries
  }

  // Convert accountsList to JSON and check its size
  const accountsListString = JSON.stringify(accountsList);
  const storageQuota = 5 * 1024 * 1024; // 5 MB, typical localStorage quota
  if (accountsListString.length > storageQuota) {
    console.warn("Data size exceeds localStorage quota.");
    return; // Prevent storing if data size is too large
  }

  try {
    localStorage.setItem("accountsList", accountsListString);
  } catch (e) {
    if (e.name === "QuotaExceededError") {
      console.error(
        "LocalStorage quota exceeded. Consider reducing the data size or using a different storage solution."
      );
    } else {
      console.error(
        "An unexpected error occurred while updating localStorage:",
        e
      );
    }
  }
}

function AccountMode(name, image) {
  SigninBox.classList.add("d-none");
  SignupBox.classList.add("d-none");
  profile.classList.remove("d-none");

  // Update profile name and profile picture
  profileName.textContent = name;

  // Update profile picture
  if (image) {
    profilePic.innerHTML = `<img class="rounded-circle border-primary pb-2" src="${image}" alt="Profile Picture"/>`;
  } else {
    profilePic.innerHTML = ""; // Clear profile picture if none is provided
  }
}

function LogoutMode() {
  SigninBox.classList.remove("d-none");
  profile.classList.add("d-none");
}

function showLightBox() {
  lightBoxContainer.classList.remove("d-none");
}

function hideLightBox() {
  lightBoxContainer.classList.add("d-none");
}

function showLightBoxError(message) {
  lightBoxContainerError.classList.remove("d-none");
  document.querySelector(".errorMessage").textContent = message;
}

function hideLightBoxError() {
  lightBoxContainerError.classList.add("d-none");
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validateName(name) {
  const nameRegex = /^[A-Za-z]+([ '-][A-Za-z]+)*$/;
  return nameRegex.test(name);
}

function validatePass(pass) {
  const passRegex = /^.{6,}$/;
  return passRegex.test(pass);
}

function clearInputs() {
  signupName.value = "";
  signupEmail.value = "";
  signupPassword.value = "";
  signupName.classList.remove("is-valid", "is-invalid");
  signupEmail.classList.remove("is-valid", "is-invalid");
  signupPassword.classList.remove("is-valid", "is-invalid");
}

function searchAccount(email, password) {
  email = email.toLowerCase();
  password = password.toLowerCase();

  return accountsList.some(
    (account) =>
      account.Email &&
      account.Email.toLowerCase() === email &&
      account.password &&
      account.password.toLowerCase() === password
  );
}

function isEmailUsed(email) {
  return accountsList.some(
    (account) =>
      account.Email && account.Email.toLowerCase() === email.toLowerCase()
  );
}
