//Variable Declarations
let temp;
let i = 0;

// Variable to store requests from db
let requestUpdates = [];
let notifications = [];
let alerts = [];

// Alert Detail array
let alertDetail = [];
// Notification Detail array
let notifDetail = [];

// Check if the user is logged in or not
const auth = firebase.auth();

window.addEventListener("load", function () {
  $("#nav_home").css("color", "white");
  $("#nav_home > svg").children().css("fill", "white");
  $(".body_wrapper_alert").addClass("hide_container");
  $(".body_wrapper_notif").addClass("hide_container");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user is logged in");
    } else {
      // No user is signed in.
      console.log("user is not logged in");
      window.location.pathname = "/index.html";
    }
  });
});

// Navigating through pages
$("#nav_cal").click(function () {
  window.location.pathname = "/calendar.html";
});
$("#nav_tbox").click(function () {
  window.location.pathname = "/tenexbox.html";
});
$("#nav_more").click(function () {
  window.location.pathname = "/more.html";
});

// New request button
$("#newRequest_btn").click(function () {
  $("#newReqBookPopupWrapper").addClass("show_popup");
});

$("#newReqBookPopupWrapper").click(function (e) {
  if (e.target == this) {
    $("#newReqBookPopupWrapper").removeClass("show_popup");
  }
});

$("#new_booking").click(function () {
  window.location.pathname = "/newRequestBooking.html";
});

$("#new_request").click(function () {
  window.location.pathname = "/newRequestRequest.html";
});

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

// Accessing cloud firestore db
const db = firebase.firestore();


// On status change in db update front end
db.collection("newRequests")
  .where("ReqUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
  .onSnapshot((doc) => {
    requestUpdates = [];
    clearRequestsUI();

    doc.forEach((fields) => {
      requestUpdates.push(fields.data());
      // Sorting array latest posted first
      requestUpdates.sort(function (a, b) {
        if (a.statusChangeTime < b.statusChangeTime) return 1;
        if (a.statusChangeTime > b.statusChangeTime) return -1;
        return 0;
      });
    });
    let requestsLength = requestUpdates.length;
    for (i = 0; i < requestsLength; i++) {
      if (requestUpdates[i].infoType === "Booking") {
        displayBookingUI(i);
      } else {
        displayRequestUI(i);
      }
    }
  });

//Function to display booking cards
displayBookingUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("requestCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${requestUpdates[i].title}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  temp.innerText = `${requestUpdates[i].onDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  temp.innerText = `${requestUpdates[i].bookingStatus}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDate");
  temp.innerText = `${requestUpdates[i].bookingDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingTime");
  temp.innerText = `${requestUpdates[i].bookingTime}`;
  document.getElementById("requestCards").children[i].appendChild(temp);
};

//Function to display request cards
displayRequestUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("requestCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${requestUpdates[i].title}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  const postDate = requestUpdates[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  const statusChangeDate = requestUpdates[i].statusChangeTime.toDate();
  temp.innerText = `${requestUpdates[i].requestStatus.toUpperCase()} ${
    months[statusChangeDate.getMonth()]
  } ${statusChangeDate.getDate()}, ${statusChangeDate.getFullYear()}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestExerpt");
  temp.innerText = `${requestUpdates[i].description}`;
  document.getElementById("requestCards").children[i].appendChild(temp);
};

//Function to clear notification archive cards
clearRequestsUI = () => {
  document.getElementById("requestCards").innerHTML = "";
};

clearAlertsUI = () => {
  document.getElementById("alertCards").innerHTML = "";
};

clearAlertDetailUI = () => {
  document.getElementById("alertDetailCard").innerHTML = "";
};

clearNotificationsUI = () => {
  document.getElementById("notificationCards").innerHTML = "";
};

clearNotifDetailUI = () => {
  document.getElementById("notifDetailCard").innerHTML = "";
};

// On status change in db update front end for notifications
db.collection("notifications").onSnapshot((doc) => {
  notifications = [];
  clearNotificationsUI();

  doc.forEach((fields) => {
    notifications.push(fields.data());

    // Sorting array latest posted first
    notifications.sort(function (a, b) {
      if (a.onDate < b.onDate) return 1;
      if (a.onDate > b.onDate) return -1;
      return 0;
    });
  });
  let notificationsLength = notifications.length;
  for (i = 0; i < notificationsLength; i++) {
    displayNotificationUI(i);
  }
  // Adding the view more at the end of notification cards
  temp = document.createElement("div");
  temp.classList.add("notificationCard");
  document.getElementById("notificationCards").appendChild(temp);
  temp = document.createElement("div");
  temp.classList.add("view_more_notification");
  document
    .getElementById("notificationCards")
    .children[notificationsLength].appendChild(temp);
  temp = document.createElement("a");
  temp.innerText = "View Past notifications";
  temp.setAttribute("href", "./notificationArchive.html");
  document
    .getElementById("notificationCards")
    .children[notificationsLength].children[0].appendChild(temp);
});

// Function to display notification cards
displayNotificationUI = (i) => {
  temp = document.createElement("div");
  temp.setAttribute("data-number", `${notifications[i].notifID}`);
  temp.classList.add("notificationCard");
  document.getElementById("notificationCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notificationCardTitle");
  temp.innerText = `${notifications[i].notifHead}`;
  document.getElementById("notificationCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedDate");
  const postDate = notifications[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDay()}, ${postDate.getFullYear()}`;
  document.getElementById("notificationCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedTime");
  temp.innerText = `Duration ${notifications[i].duration}`;
  document.getElementById("notificationCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationExerpt");
  temp.innerText = `${notifications[i].description}`;
  document.getElementById("notificationCards").children[i].appendChild(temp);
};

// On status change in db update front end for alerts
db.collection("alerts").onSnapshot((doc) => {
  alerts = [];
  clearAlertsUI();

  doc.forEach((fields) => {
    if (fields.data().status == "active") {
      alerts.push(fields.data());

      // Sorting array latest posted first
      alerts.sort(function (a, b) {
        if (a.onDate < b.onDate) return 1;
        if (a.onDate > b.onDate) return -1;
        return 0;
      });
    }
  });
  let alertsLength = alerts.length;

  if (alertsLength > 0) {
    // If there is any alert then showing alerts sections and adding view more alerts at the end of alert cards
    for (i = 0; i < alertsLength; i++) {
      displayAlertUI(i);
    }

    document.querySelector(".notification_home_header").style.display = "flex";
    temp = document.createElement("div");
    temp.classList.add("alertCard");
    document.getElementById("alertCards").appendChild(temp);
    temp = document.createElement("div");
    temp.classList.add("view_more_alert");
    document
      .getElementById("alertCards")
      .children[alertsLength].appendChild(temp);
    temp = document.createElement("a");
    temp.innerText = "View Past alerts";
    temp.setAttribute("href", "./notificationArchive.html");
    document
      .getElementById("alertCards")
      .children[alertsLength].children[0].appendChild(temp);
  } else {
    document.querySelector(".notification_home_header").style.display = "none";
  }
});

// Function to display alert cards
displayAlertUI = (i) => {
  temp = document.createElement("div");
  temp.setAttribute("data-number", `${alerts[i].alertID}`);
  temp.classList.add("alertCard");
  document.getElementById("alertCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notificationCardTitle");
  temp.innerText = `${alerts[i].alertHead}`;
  document.getElementById("alertCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedDate");
  const postDate = alerts[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("alertCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationExerpt");
  temp.innerText = `${alerts[i].description}`;
  document.getElementById("alertCards").children[i].appendChild(temp);
};

/******************************************************************************
      Different Cards Detail view JS starts here
******************************************************************************/
// Back button
$(".back_btn").click(function () {
  $(".body_wrapper_alert").addClass("hide_container");
  $(".body_wrapper_notif").addClass("hide_container");
  $(".body_wrapper_home").removeClass("hide_container");
  clearAlertDetailUI();
  clearNotifDetailUI();
});

// Navigating to card details page
let cardID;

document.onclick = function (e) {
  alertDetail = [];
  notifDetail = [];
  cardID = undefined;
  if (e.target.className == "alertCard") {
    cardID = e.target.getAttribute("data-number");
  } else if (e.target.parentNode.className == "alertCard") {
    cardID = e.target.parentNode.getAttribute("data-number");
  } else if (e.target.className == "notificationCard") {
    cardID = e.target.getAttribute("data-number");
  } else if (e.target.parentNode.className == "notificationCard") {
    cardID = e.target.parentNode.getAttribute("data-number");
  } else {
    cardID = undefined;
  }
  if (cardID) {
    if (cardID.includes("alert")) {
      $(".body_wrapper_home").addClass("hide_container");
      $(".body_wrapper_alert").removeClass("hide_container");
      alertDetail.push(alerts.find((element) => element.alertID === cardID));
      displayAlertDetailUI(0);
    } else if (cardID.includes("notif")) {
      $(".body_wrapper_home").addClass("hide_container");
      $(".body_wrapper_notif").removeClass("hide_container");
      notifDetail.push(
        notifications.find((element) => element.notifID === cardID)
      );
      displayNotifDetailUI(0);
    }
  }
};

/******************************************************************************
      Different Cards Detail view JS ends here
******************************************************************************/

/******************************************************************************
      Alert Detail view JS starts here
******************************************************************************/

//Function to display alert detail card
displayAlertDetailUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("alertDetailCard");
  document.getElementById("alertDetailCard").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("alertDetailCardTitle");
  temp.innerText = `${alertDetail[0].alertHead}`;
  document.getElementById("alertDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alertDetailPostedDate");
  const postDate = alerts[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("alertDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alertDetailDescription");
  temp.innerText = `${alertDetail[i].description}`;
  document.getElementById("alertDetailCard").children[i].appendChild(temp);
};

/******************************************************************************
      Alert Detail view JS ends here
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
