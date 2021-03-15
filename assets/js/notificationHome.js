// Check if the user is logged in or not
const auth = firebase.auth();

//Variable Declarations
let temp;
let i = 0;
let CUid;

// Variable to store requests from db
let requestUpdates = [];
let notifications = [];
let alerts = [];

window.addEventListener("load", function () {
  $("#nav_home").css("color", "white");
  $("#nav_home > svg").children().css("fill", "white");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user is logged in");
      CUid = auth.currentUser.uid;
      console.log("current user id:", CUid);
      // DBRetreiveAlerts();
      // DBRetreiveNotifications();
      // (async () => {
      //   const response = await DBRetreiveRequestUpdates();
      // })().then(async () => {
      //   const response = await DBRetreiveAlerts();
      // });
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

// Calling db
// function DBRetreiveRequestUpdates() {
//   return new Promise((resolve, reject) => {
//     setTimeout(() => {
//       resolve(
//         db
//           .collection("newRequests")
//           .where("ReqUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
//           .get()
//           .then((doc) => {
//             doc.forEach((fields) => {
//               requestUpdates = [];
//               requestUpdates.push(fields.data());
//             });
//           })
//       );
//     }, 300);
//   });
// }

// On status change in db update front end
db.collection("newRequests")
  .where("ReqUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
  .onSnapshot((doc) => {
    requestUpdates = [];
    clearRequestsUI();

    doc.forEach((fields) => {
      requestUpdates.push(fields.data());
      // console.log(requestUpdates);
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
  temp.innerText = `${requestUpdates[i].submittedDate}`;
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
  const postDate = requestUpdates[i].submittedDate.toDate();
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

clearNotificationsUI = () => {
  document.getElementById("notificationCards").innerHTML = "";
};


// On status change in db update front end for notifications
db.collection("notifications").onSnapshot((doc) => {
  notifications = [];
  clearNotificationsUI();

  doc.forEach((fields) => {
      notifications.push(fields.data());

      // Sorting array latest posted first
      notifications.sort(function (a, b) {
        if (a.postedOn < b.postedOn) return 1;
        if (a.postedOn > b.postedOn) return -1;
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
  temp.classList.add("notificationCard");
  document.getElementById("notificationCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notificationCardTitle");
  temp.innerText = `${notifications[i].notifHead}`;
  document.getElementById("notificationCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedDate");
  const postDate = notifications[i].postedOn.toDate();
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
        if (a.postedOn < b.postedOn) return 1;
        if (a.postedOn > b.postedOn) return -1;
        return 0;
      });
    }
  });
  let alertsLength = alerts.length;
  for (i = 0; i < alertsLength; i++) {
    displayAlertUI(i);
  }
  if (alertsLength > 0) {
    // If there is any alert then showing alerts sections and adding view more alerts at the end of alert cards
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
  temp.classList.add("alertCard");
  document.getElementById("alertCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notificationCardTitle");
  temp.innerText = `${alerts[i].alertHead}`;
  document.getElementById("alertCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationPostedDate");
  const postDate = alerts[i].postedOn.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("alertCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationExerpt");
  temp.innerText = `${alerts[i].description}`;
  document.getElementById("alertCards").children[i].appendChild(temp);
};
