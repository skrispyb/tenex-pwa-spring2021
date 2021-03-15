// Check if the user is logged in or not
const auth = firebase.auth();
let CUid;
window.addEventListener("load", function () {
  $("#nav_tbox").css("color", "white");
  $("#nav_tbox > svg").children().css("fill", "white");

  auth.onAuthStateChanged((user) => {
    if (user) {
      console.log("user is logged in");
      CUid = auth.currentUser.uid;
      console.log(CUid);
      (async () => {
        const response = await DBRetreiveTenexBox();
      })().then(() => {
        // Display notification object information on cards
        displayAll();
      });
    } else {
      // No user is signed in.
      console.log("user is not logged in");
      window.location.pathname = "/index.html";
    }
  });
});

// Navigating through pages
$("#nav_home").click(function () {
  window.location.pathname = "/notificationHome.html";
});
$("#nav_cal").click(function () {
  window.location.pathname = "/calendar.html";
});
$("#nav_more").click(function () {
  window.location.pathname = "/more.html";
});

//Request objects
let requestArray = [];

//Booking objects
let bookingArray = [
  {
    infoType: "Booking",
    title: "Meeting Room Booking",
    submittedDate: "FEB 15, 2021",
    bookingStatus: "BOOKED",
    bookingDate: "FEB 21, 2021",
    bookingTime: "14:00 - 15:00",
  },
  {
    infoType: "Booking",
    title: "Manager Meeting Booking",
    submittedDate: "FEB 12, 2021",
    bookingStatus: "BOOKED",
    bookingDate: "FEB 13, 2021",
    bookingTime: "10:00 - 10:30",
  },
];

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
function DBRetreiveTenexBox() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        db
          .collection("newRequests")
          .where("ReqUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
          .get()
          .then((doc) => {
            doc.forEach((fields) => {
              requestArray.push(fields.data());
            });
          })
      );
    }, 300);
  });
}

//Variable Declarations
let temp;
let i = 0;
let allArray = [];

//Function to display booking cards
displayBookingUI = (i, array) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("requestCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${array[i].title}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  temp.innerText = `${array[i].submittedDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  temp.innerText = `${array[i].bookingStatus}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDate");
  temp.innerText = `${array[i].bookingDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingTime");
  temp.innerText = `${array[i].bookingTime}`;
  document.getElementById("requestCards").children[i].appendChild(temp);
};

//Function to display request cards
displayRequestUI = (i, array) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("requestCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${array[i].title}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  const postDate = array[i].submittedDate.toDate();
  console.log(postDate.getDate());
  temp.innerText = `${months[postDate.getMonth()]} ${postDate.getDate()}, ${postDate.getFullYear()}`;
  // temp.innerText = `${tenexboxArray[i].submittedDate}`;
  // console.log(postDate);
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  temp.innerText = `${array[i].requestStatus}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestExerpt");
  temp.innerText = `${array[i].description}`;
  document.getElementById("requestCards").children[i].appendChild(temp);
};

// Display booking and alert information on cards
function displayAll() {
  allArray = bookingArray.concat(requestArray);
  for (i = 0; i < allArray.length; i++) {
    if (allArray[i].infoType === "Booking") {
      displayBookingUI(i, allArray);
    } else {
      displayRequestUI(i, allArray);
    }
  }
}

// Clear UI before every update
clearRequestsUI = () => {
  document.getElementById("requestCards").innerHTML = "";
};

//Dispaly search bar
document.getElementById("search_btn").addEventListener("click", function () {
  document.getElementById("searchBarInput").classList.toggle("hidden");
  document
    .getElementById("search_btn")
    .classList.toggle("activeFilterBackground");
  document
    .getElementById("search_btn")
    .children[0].children[0].classList.toggle("activeFilterIcon");
  document.getElementById("searchBarInput").classList.toggle("searchBarExpand");
  document.getElementById("searchBar").classList.toggle("searchBarExpand");
  document.getElementById("headerTitle").classList.toggle("hidden");
});

// Function to filter cards with search input
// displaySearchResultUI = () => {
//   clearRequestsUI();
// for (i = 0; i < tenexboxArray.length; i++) {
//   for (let property in tenexboxArray[i]) {
//     console.log(tenexboxArray[i][property]);
//   }
// if (
//   tenexboxArray[i].infoType === "Booking" &&
//   (tenexboxArray[i].infoType.toUpperCase() ===
//     document.getElementById("searchBarInput").value.toUpperCase() ||
//     tenexboxArray[i].title.toUpperCase() ===
//       document.getElementById("searchBarInput").value.toUpperCase() ||
//     tenexboxArray[i].submittedDate.toUpperCase() ===
//       document.getElementById("searchBarInput").value.toUpperCase())
// ) {
//   displayBookingUI(i);
// } else if (
//   tenexboxArray[i].infoType.toUpperCase() ===
//     document.getElementById("searchBarInput").value.toUpperCase() ||
//   tenexboxArray[i].title.toUpperCase() ===
//     document.getElementById("searchBarInput").value.toUpperCase() ||
//   tenexboxArray[i].submittedDate.toUpperCase() ===
//     document.getElementById("searchBarInput").value.toUpperCase()
// ) {
//   displayRequestUI(i);
// }
//   }
// };

// Tag filtering
document.getElementById("requests_btn").addEventListener("click", function () {
  clearRequestsUI();
  if (
    !document
      .getElementById("requests_btn")
      .classList.contains("activeFilterBackground")
  ) {
    document
      .getElementById("requests_btn")
      .classList.add("activeFilterBackground");
    document.getElementById("requests_btn").classList.add("activeFilterText");
    document
      .getElementById("bookings_btn")
      .classList.remove("activeFilterBackground");
    document
      .getElementById("bookings_btn")
      .classList.remove("activeFilterText");
    for (i = 0; i < requestArray.length; i++) {
      displayRequestUI(i, requestArray);
    }
  } else {
    document
      .getElementById("requests_btn")
      .classList.remove("activeFilterBackground");
    document
      .getElementById("requests_btn")
      .classList.remove("activeFilterText");
    for (i = 0; i < allArray.length; i++) {
      if (allArray[i].infoType === "Booking") {
        displayBookingUI(i, allArray);
      } else {
        displayRequestUI(i, allArray);
      }
    }
  }
});

document.getElementById("bookings_btn").addEventListener("click", function () {
  clearRequestsUI();
  if (
    !document
      .getElementById("bookings_btn")
      .classList.contains("activeFilterBackground")
  ) {
    document
      .getElementById("bookings_btn")
      .classList.add("activeFilterBackground");
    document.getElementById("bookings_btn").classList.add("activeFilterText");
    document
      .getElementById("requests_btn")
      .classList.remove("activeFilterBackground");
    document
      .getElementById("requests_btn")
      .classList.remove("activeFilterText");
    for (i = 0; i < bookingArray.length; i++) {
      displayBookingUI(i, bookingArray);
    }
  } else {
    document
      .getElementById("bookings_btn")
      .classList.remove("activeFilterBackground");
    document
      .getElementById("bookings_btn")
      .classList.remove("activeFilterText");
    for (i = 0; i < allArray.length; i++) {
      if (allArray[i].infoType === "Booking") {
        displayBookingUI(i, allArray);
      } else {
        displayRequestUI(i, allArray);
      }
    }
  }
});
