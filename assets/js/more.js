// Navigating through pages
$("#nav_home").click(function () {
  window.location.pathname = "/notificationHome.html";
});
$("#nav_cal").click(function () {
  window.location.pathname = "/calendar.html";
});
$("#nav_tbox").click(function () {
  window.location.pathname = "/tenexbox.html";
});

// Check if the user is logged in or not
const auth = firebase.auth();
let CUid;
window.addEventListener("load", function () {
  $("#nav_more").css("color", "#81B7AE");
  $("#nav_more > svg").children().css("fill", "#81B7AE");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user is logged in");
      CUid = auth.currentUser.uid;
      console.log(CUid);
    } else {
      // No user is signed in.
      console.log("user is not logged in");
      window.location.pathname = "/index.html";
    }
  });
});

// Redirecting to regulations.html page
$(document).ready(function () {
  $("#Regulation").click(function () {
    window.location.assign("regulationsV2.html");
  });
});

// Redirecting to FAQs.html page
$(document).ready(function () {
  $("#FAQs").click(function () {
    window.location.assign("FAQsV2.html");
  });
});

// Signing out
$("#signout_btn").click(function () {
  // Sign out function
  firebase
    .auth()
    .signOut()
    .then(() => {
      window.location.pathname = "/index.html";
      // Sign-out successful.
    })
    .catch((error) => {
      window.reload();
      // An error happened.
    });
});
