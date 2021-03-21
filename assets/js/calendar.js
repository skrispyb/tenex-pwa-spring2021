// Variable Declarations
let temp;
let i = 0;
let obj;

// To hold selected date
let selected;
let currentSelect;

// Array to store all cards for a date
let currentUserCards = [];
let currentDateCards = [];

// Array for date formatting
const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];

// Navigating through pages

$("#nav_home").click(function () {
  window.location.pathname = "/notificationHome.html";
});
$("#nav_tbox").click(function () {
  window.location.pathname = "/tenexbox.html";
});
$("#nav_more").click(function () {
  window.location.pathname = "/more.html";
});

// Check if the user is logged in or not
const auth = firebase.auth();

// Accessing cloud firestore db
const db = firebase.firestore();

window.addEventListener("load", function () {
  $("#nav_cal").css("color", "white");
  $("#nav_cal > svg").children().css("fill", "white");
  $(".body_wrapper_notif").addClass("hide_container");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user is logged in");

      selected = document.getElementById("calendarDate");
      selected.value = new Date().toDateInputValue();
      currentSelect = `${selected.value}`;
      sortDisplay(currentSelect);
    } else {
      // No user is signed in.
      console.log("user is not logged in");
      window.location.pathname = "/index.html";
    }
  });
});

// date picker current date auto fill
Date.prototype.toDateInputValue = function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};

$("input[type=date]").change(function () {
  currentUserCards = [];
  currentDateCards = [];
  document.getElementById("allCards").innerHTML = "";
  currentSelect = `${selected.value}`;
  // loadDB(currentSelect);
  sortDisplay(currentSelect);
});

// Access all data from db for current user and store objects in array
function loadDB() {
  return new Promise((resolve) => {
    db.collection("newRequests")
      .where("ReqUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
      .onSnapshot((doc) => {
        doc.forEach((fields) => {
          currentUserCards.push(fields.data());
          // console.log(currentUserCards);
        });
      });

    db.collection("bookings")
      .where("BookingUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
      .onSnapshot((doc) => {
        doc.forEach((fields) => {
          currentUserCards.push(fields.data());
          // console.log(currentUserCards);
        });
      });

    db.collection("notifications")
      .where("recipient", "array-contains-any", [
        "Lansdown Square Building",
        "104",
      ])
      .onSnapshot((doc) => {
        doc.forEach((fields) => {
          currentUserCards.push(fields.data());
          // console.log(currentUserCards.length);
        });
      });
    setTimeout(() => {
      resolve("resolved");
    }, 1000);
  });
}

// Sort in reverse chronological order of date and display cards
async function sortDisplay(currentSelect) {
  await loadDB();
  // console.log(currentUserCards.length);
  currentUserCards.forEach(function (items) {
    obj = items.onDate;
    // console.log(items.cardType + obj.toDate().getUTCDate());
    if (
      obj.toDate().getFullYear() === new Date(currentSelect).getUTCFullYear() &&
      obj.toDate().getMonth() === new Date(currentSelect).getUTCMonth() &&
      obj.toDate().getDate() === new Date(currentSelect).getUTCDate()
    ) {
      currentDateCards.push(items);
      // console.log(currentDateCards);
    }
  });

  if (currentDateCards.length > 0) {
    document.querySelector(".no_events").classList.add("hide_container");

    currentDateCards.sort(function (a, b) {
      if (a.onDate < b.onDate) return 1;
      if (a.onDate > b.onDate) return -1;
      return 0;
    });

    for (i = 0; i < currentDateCards.length; i++) {
      if (currentDateCards[i].cardType == "Booking") {
        displayBookingUI(i);
      } else if (currentDateCards[i].cardType == "Request") {
        displayRequestUI(i);
      } else {
        displayNotifUI(i);
      }
    }
    // currentDateCards = [];
    // currentUserCards = [];
    // currentSelect = [];
  } else {
    document.querySelector(".no_events").classList.remove("hide_container");
  }
}

// Display Alert cards
// function displayAlertUI(i) {
//   temp = document.createElement("div");
//   temp.setAttribute("data-number", `${currentDateCards[i].alertID}`);
//   temp.classList.add("alertCard");
//   document.getElementById("allCards").appendChild(temp);

//   temp = document.createElement("h2");
//   temp.classList.add("notificationCardTitle");
//   temp.innerText = `${currentDateCards[i].alertHead}`;
//   document.getElementById("allCards").children[i].appendChild(temp);

//   temp = document.createElement("p");
//   temp.classList.add("notificationPostedDate");
//   const postDate = currentDateCards[i].onDate.toDate();
//   temp.innerText = `Posted on ${
//     months[postDate.getMonth()]
//   } ${postDate.getDate()}, ${postDate.getFullYear()}`;
//   document.getElementById("allCards").children[i].appendChild(temp);

//   temp = document.createElement("p");
//   temp.classList.add("notificationExerpt");
//   temp.innerText = `${currentDateCards[i].description}`;
//   document.getElementById("allCards").children[i].appendChild(temp);
// }

// Display Notification cards
function displayNotifUI(i) {
  temp = document.createElement("div");
  temp.setAttribute("data-number", `${currentDateCards[i].notifID}`);
  temp.classList.add("notificationCard");
  document.getElementById("allCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notificationCardTitle");
  temp.innerText = `${currentDateCards[i].notifHead}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedDate");
  const postDate = currentDateCards[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedTime");
  temp.innerText = `Duration ${currentDateCards[i].duration}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationExerpt");
  temp.innerText = `${currentDateCards[i].description}`;
  document.getElementById("allCards").children[i].appendChild(temp);
}

// Display Booking cards
function displayBookingUI(i) {
  temp = document.createElement("div");
  temp.setAttribute("data-number", `${currentDateCards[i].bookingID}`);
  temp.classList.add("newBookingCard");
  document.getElementById("allCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("bookingTitle");
  temp.innerText = `${currentDateCards[i].title}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newBookingDate");
  const postDate = currentDateCards[i].onDate.toDate();
  temp.innerText = `Booked on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDate");
  const bookDate = currentDateCards[i].bookedFor.toDate();
  temp.innerText = `Booked for ${
    months[bookDate.getMonth()]
  } ${bookDate.getDay()}, ${bookDate.getFullYear()}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingTime");
  temp.innerText = `Time slot: ${currentDateCards[i].timeSlot}`;
  document.getElementById("allCards").children[i].appendChild(temp);
}

// Display Request cards
function displayRequestUI(i) {
  temp = document.createElement("div");
  temp.setAttribute("data-number", `${currentDateCards[i].requestID}`);
  temp.classList.add("newRequestCard");
  document.getElementById("allCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${currentDateCards[i].title}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  const postDate = currentDateCards[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  const statusChangeDate = currentDateCards[i].statusChangeTime.toDate();
  temp.innerText = `${currentDateCards[i].requestStatus.toUpperCase()} ${
    months[statusChangeDate.getMonth()]
  } ${statusChangeDate.getDate()}, ${statusChangeDate.getFullYear()}`;
  document.getElementById("allCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestExerpt");
  temp.innerText = `${currentDateCards[i].description}`;
  document.getElementById("allCards").children[i].appendChild(temp);
}

clearNotifDetailUI = () => {
  document.getElementById("notifDetailCard").innerHTML = "";
};

/******************************************************************************
      Different Cards Detail view JS starts here
******************************************************************************/
// Back button
$(".back_btn").click(function () {
  $(".body_wrapper_notif").addClass("hide_container");
  $(".body_wrapper_calendar").removeClass("hide_container");
  clearNotifDetailUI();
});

// Navigating to card details page
let cardID;

document.onclick = function (e) {
  notifDetail = [];
  cardID = undefined;
  if (e.target.className == "notificationCard") {
    cardID = e.target.getAttribute("data-number");
  } else if (e.target.parentNode.className == "notificationCard") {
    cardID = e.target.parentNode.getAttribute("data-number");
  } else {
    cardID = undefined;
  }
  if (cardID) {
    if (cardID.includes("notif")) {
      $(".body_wrapper_calendar").addClass("hide_container");
      $(".body_wrapper_notif").removeClass("hide_container");
      notifDetail.push(
        currentDateCards.find((element) => element.notifID === cardID)
      );
      displayNotifDetailUI(0);
    }
  }
};

/******************************************************************************
      Different Cards Detail view JS ends here
******************************************************************************/

/******************************************************************************
      Notification Detail view JS starts here
******************************************************************************/

//Function to display notification detail card
displayNotifDetailUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("notifDetailCard");
  document.getElementById("notifDetailCard").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notifDetailCardTitle");
  temp.innerText = `${notifDetail[i].notifHead}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifDetailPostedDate");
  const postDate = notifDetail[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDay()}, ${postDate.getFullYear()}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifDetailDuration");
  temp.innerText = `${notifDetail[i].duration}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifDetaildescription");
  temp.innerText = `${notifDetail[i].description}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);
};

/******************************************************************************
      Notification Detail view JS ends here
******************************************************************************/
