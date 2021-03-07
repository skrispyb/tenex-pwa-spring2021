// Firebase authentication
const auth = firebase.auth();
let email;
let password;
$("#loginForm").submit(function () {
  email = $("#username").val();
  password = $("#password").val();

  firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    // Signed in 
    var user = userCredential.user;
    console.log("logged in");
    window.location.pathname = "/notificationHome.html";
    console.log("still logged in");
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log("wrong creds");
  });

  return false;
});


// Sign out function
function signOut() {
  firebase
    .auth()
    .signOut()
    .then(() => {
      // Sign-out successful.
    })
    .catch((error) => {
      // An error happened.
    });
}

// Accessing cloud firestore db
// db = firebase.firestore();
// // console.log(db);
// db.collection("alerts").add({
//   "title" : "covid alert"
// });

// Adding document while also assigning an id to it
// db.collection("data").doc("one").set(docData).then(() => {
//   console.log("Document successfully written!");
// });

// Updating and existing document using its id
// db.collection("alerts").doc("0w3iioZfKRVTrcFwUpJc").update({
//   "title" : "Heavy snowfall"
// });







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
