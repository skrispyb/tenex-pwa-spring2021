// Navigating through pages

$("#nav_home").click(function() {
  window.location.pathname = "/notificationHome.html";
});
$("#nav_tbox").click(function() {
  window.location.pathname = "/tenexbox.html";
});
$("#nav_more").click(function() {
  window.location.pathname = "/more.html";
});

// Check if the user is logged in or not
const auth = firebase.auth();
let CUid;
window.addEventListener("load", function () {
  $("#nav_cal").css("color", "white");
  $("#nav_cal > svg").children().css("fill", "white");

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

// date picker current date auto fill
Date.prototype.toDateInputValue = (function() {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0,10);
});

document.getElementById('calendarDate').value = new Date().toDateInputValue();