// Firebase authentication
const auth = firebase.auth();

// Access firestore db
const db = firebase.firestore();

let htmlEmail;
let htmlPassword;

$("#loginForm").submit(function () {
  htmlEmail = $("#username").val();
  htmlPassword = $("#password").val();

  firebase
    .auth()
    .signInWithEmailAndPassword(htmlEmail, htmlPassword)
    .then((userCredential) => {
      // Signed in
      var user = userCredential.user;

      console.log("logged in");
      window.location.pathname = "/notificationHome.html";
      // console.log("still logged in");
    })
    .catch((error) => {
      var errorCode = error.code;
      // var errorMessage = error.message;
      console.log(`GOT ERROR: ` + errorCode);
      if (errorCode == "auth/weak-password") return; // password to weak. Minimal 6 characters
      if (errorCode == "auth/email-already-in-use") return; // Return a email already in use error
    });

  return false;
});

// Onboarding transition manipulation with js
var slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
  showSlides((slideIndex += n));
}

function currentSlide(n) {
  showSlides((slideIndex = n));
}

function showSlides(n) {
  var i;
  var slides = document.getElementsByClassName("mySlides");
  var dots = document.getElementsByClassName("dot");
  if (n > slides.length) {
    slideIndex = 1;
  }
  if (n < 1) {
    slideIndex = slides.length;
  }
  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex - 1].style.display = "block";
  dots[slideIndex - 1].className += " active";
}

function showDiv() {
  var x = document.getElementById("tenexform");
  var y = document.getElementById("slideshow-container");
  if (x.style.display === "none") {
    x.style.display = "block";
    y.style.display = "none";
  } else {
    x.style.display = "none";
    y.style.display = "block";
  }
}

function mainpage() {
  var x = document.getElementById("tenexform");
  var y = document.getElementById("slideshow-container");
  if (x.style.display === "block") x.style.display = "none";
  y.style.display = "block";
}

document.getElementById("username").addEventListener("keyup", function () {
  if (
    document.getElementById("username").value.length > 0 &&
    document.getElementById("password").value.length > 0
  ) {
    document.getElementById("signInBtn").removeAttribute("disabled");
  } else {
    document.getElementById("signInBtn").setAttribute("disabled", "true");
  }
});

document.getElementById("password").addEventListener("keyup", function () {
  if (
    document.getElementById("username").value.length > 0 &&
    document.getElementById("password").value.length > 0
  ) {
    document.getElementById("signInBtn").removeAttribute("disabled");
  } else {
    document.getElementById("signInBtn").setAttribute("disabled", "true");
  }
});

// *************************Adding Splash Screen  ****************************
setTimeout(function () {
  mainpage();
  var x = document.getElementById("main_page_img");
  var y = document.getElementById("slideshow-container");
  if (x.style.display === "block") x.style.display = "none";
  y.style.display = "block";
}, 2000);
