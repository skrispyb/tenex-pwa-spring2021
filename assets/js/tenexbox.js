// Check if the user is logged in or not
const auth = firebase.auth();
let currUid;

// Variable to store requests from db
let bookings = [];
let requests = [];
let recentUpdates = [];

// Request detail array
let requestDetail = [];
// Booking detail array
let bookingDetail = [];

// Accessing cloud firestore db
const db = firebase.firestore();

// Accessing the firebase storage
let storageRef = firebase.storage();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is logged in");
    currUid = user.uid;
    console.log(currUid);
    // On Request status change in db update front end
    db.collection("newRequests")
      .where("ReqUid", "==", currUid)
      .get()
      .then((doc) => {
        requests = [];

        doc.forEach((fields) => {
          requests.push(fields.data());
        });
        mergeRecentCards();
      })
      .catch((error) => {
        console.error(error);
      });

    // Retreive bookings
    db.collection("bookings")
      .where("BookingUid", "==", currUid)
      .get()
      .then((doc) => {
        bookings = [];

        doc.forEach((fields) => {
          bookings.push(fields.data());
        });
        mergeRecentCards();
      })
      .catch((error) => {
        console.error(error);
      });
  } else {
    // No user is signed in.
    console.log("user is not logged in");
    window.location.pathname = "/index.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  $("#nav_tbox").css("color", "white");
  $("#nav_tbox > svg").children().css("fill", "white");
  $(".body_wrapper_book").addClass("hidden");
  $(".body_wrapper_req").addClass("hidden");
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
let bookingArray = [];

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

// Calling db
function DBRetreiveTenexBox() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        db
          .collection("newRequests")
          .where("ReqUid", "==", currUid)
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

  document.getElementById(
    "requestCards"
  ).innerHTML = `<div class="newRequestCard">
  <div class="newRequestCard_wrapper">
    <div class="newRequestCard_content_wrapper">
      <div class="newBookingCard_status_progress_wrapper">
      </div>
      <div class="newRequestCard_details">
        <h3 class="newRequestCard_title">${array[i].title}</h3>
        <div class="newBookingCard_time_wrapper">
          <p class="newBookingCard_time">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z"
                fill="#4F4F4F" />
            </svg> 14:00 - 15:00
          </p>
        </div>
      </div>
      <p class="newRequestCard_status">BOOKED</p>
    </div>
    <div class="newRequestCard_date_wrapper">
      <div class="newRequest_logo">
        <svg width="56" height="60" viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M49.6904 5.45455H48.9404C47.8359 5.45455 46.9404 4.55911 46.9404 3.45455V2C46.9404 0.895431 46.045 0 44.9404 0H43.4404C42.3359 0 41.4404 0.895431 41.4404 2V3.45455C41.4404 4.55911 40.545 5.45455 39.4404 5.45455H15.9404C14.8359 5.45455 13.9404 4.55911 13.9404 3.45455V2C13.9404 0.895431 13.045 0 11.9404 0H10.4404C9.33586 0 8.44043 0.895431 8.44043 2V3.45455C8.44043 4.55911 7.545 5.45455 6.44043 5.45455H5.69043C2.66543 5.45455 0.19043 7.90909 0.19043 10.9091V54.5455C0.19043 57.5455 2.66543 60 5.69043 60H49.6904C52.7154 60 55.1904 57.5455 55.1904 54.5455V10.9091C55.1904 7.90909 52.7154 5.45455 49.6904 5.45455ZM49.6904 52.5455C49.6904 53.65 48.795 54.5455 47.6904 54.5455H7.69043C6.58586 54.5455 5.69043 53.65 5.69043 52.5455V17.2747C5.69043 16.1702 6.58586 15.2747 7.69043 15.2747H47.6904C48.795 15.2747 49.6904 16.1702 49.6904 17.2747V52.5455Z"
            fill="#4980C1"></path>
        </svg>
      </div>
      <div class="newBookingCard_date_for">MAR<br>17</div>
      <p>Feb 28, 2021</p>
    </div>
  </div>
</div>`;
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
  temp.innerText = `${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
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
