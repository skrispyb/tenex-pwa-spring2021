//Variable Declarations
let temp;
let i = 0;

// Variable to store requests from db
let bookings = [];
let requests = [];
let recentUpdates = [];
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
  $(".body_wrapper_alert").addClass("hidden");
  $(".body_wrapper_notif").addClass("hidden");

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
  window.location.pathname = "/newRequestRequest1.html";
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

// Select the alert cards container
let alertCards = document.getElementById("alertCards");

// Select the notification cards container
let notifCards = document.getElementById("notificationCards");

// Select the request cards container
let recentCards = document.getElementById("recentCards");

// Accessing cloud firestore db
const db = firebase.firestore();

// On Request status change in db update front end
db.collection("newRequests")
  .where("ReqUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
  .onSnapshot((doc) => {
    requests = [];

    doc.forEach((fields) => {
      requests.push(fields.data());
    });
    mergeRecentCards();
  });

// Retreive bookings
db.collection("bookings")
  .where("BookingUid", "==", "bISRwswAqQax3h0XUAEW3bSeClg1")
  .onSnapshot((doc) => {
    bookings = [];
    // clearRequestsUI();

    doc.forEach((fields) => {
      bookings.push(fields.data());
    });
    mergeRecentCards();
  });

// Function to display recent cards
function mergeRecentCards() {
  clearRecentsUI();

  recentUpdates = [];
  requests.forEach((card) => {
    recentUpdates.push(card);
  });
  bookings.forEach((card) => {
    recentUpdates.push(card);
  });
  // Sorting array latest posted first
  recentUpdates.sort(function (a, b) {
    if (a.statusChangeTime < b.statusChangeTime) return 1;
    if (a.statusChangeTime > b.statusChangeTime) return -1;
    return 0;
  });
  let recentsLength = recentUpdates.length;
  for (i = 0; i < recentsLength; i++) {
    displayRecenttUI(i);
  }
}

//Function to display recent cards
displayRecenttUI = (i) => {
  temp = document.createElement("div");
  if (recentUpdates[i].cardType === "Booking") {
    temp.setAttribute("data-number", `${recentUpdates[i].bookingID}`);
  } else {
    temp.setAttribute("data-number", `${recentUpdates[i].requestID}`);
  }
  temp.classList.add("newRequestCard");
  recentCards.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("newRequestCard_wrapper");
  recentCards.children[i].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("newRequestCard_content_wrapper");
  recentCards.children[i].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("newRequestCard_status_progress_wrapper");
  recentCards.children[i].children[0].children[0].appendChild(temp);
  if (recentUpdates[i].requestStatus === "SENT") {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  } else if (recentUpdates[i].requestStatus === "READ") {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  } else if (recentUpdates[i].requestStatus === "REJECTED") {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  } else if (recentUpdates[i].requestStatus === "MESSAGE") {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  } else if (recentUpdates[i].requestStatus === "COMPLETED") {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  } else if (recentUpdates[i].requestStatus === "BOOKED") {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  } else {
    temp.innerHTML = `<svg width="8" height="75" viewBox="0 0 8 75" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.5 4.00372C7.5 5.9392 5.93256 7.50743 4 7.50743C2.06744 7.50743 0.5 5.9392 0.5 4.00372C0.5 2.06823 2.06744 0.5 4 0.5C5.93256 0.5 7.5 2.06823 7.5 4.00372Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M7.5 37.5008C7.5 39.4363 5.93256 41.0045 4 41.0045C2.06744 41.0045 0.5 39.4363 0.5 37.5008C0.5 35.5653 2.06744 33.9971 4 33.9971C5.93256 33.9971 7.5 35.5653 7.5 37.5008Z" fill="#FDAE46" stroke="#FDAE46"/>
    <path d="M4 7.24219L4 34.4013" stroke="#FDAE46" stroke-width="2"/>
    <path d="M4 39.833L4 54.1804L4 68.5277" stroke="#FDAE46" stroke-width="2" stroke-miterlimit="16" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="4 4"/>
    <path d="M7.5 70.9969C7.5 72.9324 5.93256 74.5006 4 74.5006C2.06744 74.5006 0.5 72.9324 0.5 70.9969C0.5 69.0614 2.06744 67.4932 4 67.4932C5.93256 67.4932 7.5 69.0614 7.5 70.9969Z" fill="white" stroke="#FDAE46"/>
  </svg>`;
  }

  temp = document.createElement("div");
  temp.classList.add("newRequestCard_details");
  recentCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("h3");
  temp.classList.add("newRequestCard_title");
  temp.innerText = `${recentUpdates[i].title}`;
  recentCards.children[i].children[0].children[0].children[1].appendChild(temp);

  if (recentUpdates[i].cardType === "Booking") {
    temp = document.createElement("div");
    temp.classList.add("newBookingCard_time_wrapper");
    recentCards.children[i].children[0].children[0].children[1].appendChild(
      temp
    );

    temp = document.createElement("p");
    temp.classList.add("newBookingCard_time");
    temp.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z" fill="#4F4F4F"/>
    </svg> ${recentUpdates[i].timeSlot}`;
    recentCards.children[
      i
    ].children[0].children[0].children[1].children[1].appendChild(temp);
  } else {
    temp = document.createElement("p");
    temp.classList.add("newRequestCard_excerpt");
    temp.innerText = `${recentUpdates[i].description}`;
    recentCards.children[i].children[0].children[0].children[1].appendChild(
      temp
    );
  }

  temp = document.createElement("p");
  temp.classList.add("newRequestCard_status");
  temp.innerText = `${recentUpdates[i].requestStatus}`;
  recentCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("newRequestCard_date_wrapper");
  recentCards.children[i].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("newRequest_logo");
  recentCards.children[i].children[0].children[1].appendChild(temp);
  if (recentUpdates[i].requestStatus !== "REJECTED") {
    if (recentUpdates[i].ReqCategory === "Service") {
      temp.innerHTML = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27.5" cy="27.5" r="27.5" fill="#FDAE46"/>
      <path d="M11.8844 21.9399C11.8844 21.9399 1.98501 23.7841 5.92781 33.5606C5.92781 33.5606 7.3947 38.3004 14.4875 38.4276C14.4875 38.4276 16.6158 37.639 16.6497 36.1849C16.6794 34.7265 16.7133 24.6066 16.7133 24.6066C16.7133 24.6066 17.7732 16.2801 25.7351 15.305C25.7351 15.305 32.5439 14.1815 36.0245 19.8583C36.0245 19.8583 37.8815 22.2621 37.7331 26.5059L37.7628 36.1976C37.7628 36.1976 37.8772 37.8765 35.749 38.7159C35.749 38.7159 34.9307 39.161 33.7649 39.1738C33.7649 39.1738 32.7262 37.1981 29.8856 37.5585C27.0451 37.9188 26.3965 40.7424 26.3965 40.7424C26.3965 40.7424 25.8496 44.3503 28.6011 45.2576C28.6011 45.2576 30.2842 46.5676 32.8703 44.8929L33.5359 44.3672C33.5359 44.3672 38.4538 44.257 40.7983 41.408C40.7983 41.408 42.35 39.7715 42.6637 38.0376C42.6637 38.0376 47.0178 37.3041 48.6712 33.1832C48.6712 33.1832 50.791 29.126 47.8614 25.2552C47.8614 25.2552 45.3431 21.8297 42.35 21.8381C42.35 21.8381 41.8879 18.8365 39.7893 16.2504C39.7893 16.2504 36.7326 11.8327 31.0218 10.4337C25.3111 9.03463 20.3593 11.4681 20.3593 11.4681C20.3593 11.4681 16.6878 13.4395 14.8267 15.9918C12.9655 18.544 12.6518 19.6166 11.8844 21.9399Z" fill="white"/>
      </svg>`;
    } else if (recentUpdates[i].ReqCategory === "Complaint") {
      temp.innerHTML = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27.5" cy="27.5" r="27.5" fill="#FDAE46"/>
      <g filter="url(#filter0_d)">
      <path d="M14 35.1675V41H19.8325L37.0346 23.7979L31.2021 17.9654L14 35.1675ZM41.5451 19.2875C42.1516 18.6809 42.1516 17.701 41.5451 17.0944L37.9056 13.4549C37.299 12.8484 36.3191 12.8484 35.7125 13.4549L32.8663 16.3012L38.6988 22.1337L41.5451 19.2875Z" fill="#FDAE46"/>
      <path d="M12.9393 34.1068L12.5 34.5462V35.1675V41V42.5H14H19.8325H20.4538L20.8932 42.0607L38.0952 24.8586L38.6988 24.2551L39.1559 23.7979L39.7595 23.1944L42.6057 20.3481C43.7981 19.1558 43.7981 17.2261 42.6057 16.0338L38.9662 12.3943L37.9178 13.4427L38.9662 12.3943C37.7739 11.2019 35.8442 11.2019 34.6519 12.3943L35.6998 13.4422L34.6519 12.3943L31.8056 15.2405L31.2021 15.8441L30.7449 16.3012L30.1414 16.9048L12.9393 34.1068Z" stroke="white" stroke-width="3"/>
      </g>
      <defs>
      <filter id="filter0_d" x="8" y="10" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
      <feFlood flood-opacity="0" result="BackgroundImageFix"/>
      <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"/>
      <feOffset dy="3"/>
      <feGaussianBlur stdDeviation="1.5"/>
      <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.06 0"/>
      <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow"/>
      <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow" result="shape"/>
      </filter>
      </defs>
      </svg>`;
    } else if (recentUpdates[i].requestStatus === "BOOKED") {
      temp.innerHTML = `<svg width="56" height="60" viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M49.6904 5.45455H48.9404C47.8359 5.45455 46.9404 4.55911 46.9404 3.45455V2C46.9404 0.895431 46.045 0 44.9404 0H43.4404C42.3359 0 41.4404 0.895431 41.4404 2V3.45455C41.4404 4.55911 40.545 5.45455 39.4404 5.45455H15.9404C14.8359 5.45455 13.9404 4.55911 13.9404 3.45455V2C13.9404 0.895431 13.045 0 11.9404 0H10.4404C9.33586 0 8.44043 0.895431 8.44043 2V3.45455C8.44043 4.55911 7.545 5.45455 6.44043 5.45455H5.69043C2.66543 5.45455 0.19043 7.90909 0.19043 10.9091V54.5455C0.19043 57.5455 2.66543 60 5.69043 60H49.6904C52.7154 60 55.1904 57.5455 55.1904 54.5455V10.9091C55.1904 7.90909 52.7154 5.45455 49.6904 5.45455ZM49.6904 52.5455C49.6904 53.65 48.795 54.5455 47.6904 54.5455H7.69043C6.58586 54.5455 5.69043 53.65 5.69043 52.5455V17.2747C5.69043 16.1702 6.58586 15.2747 7.69043 15.2747H47.6904C48.795 15.2747 49.6904 16.1702 49.6904 17.2747V52.5455Z" fill="#4980C1"/>
      </svg>`;

      temp = document.createElement("div");
      temp.classList.add("newBookingCard_date_for");
      const bookedFor = recentUpdates[i].bookedFor.toDate();
      temp.innerHTML = `${
        months[bookedFor.getMonth()]
      }<br>${bookedFor.getDate()}`;
      recentCards.children[i].children[0].children[1].appendChild(temp);
    } else {
      temp.innerHTML = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27.5" cy="27.5" r="27.5" fill="#FDAE46"/>
      <path d="M11.8844 21.9399C11.8844 21.9399 1.98501 23.7841 5.92781 33.5606C5.92781 33.5606 7.3947 38.3004 14.4875 38.4276C14.4875 38.4276 16.6158 37.639 16.6497 36.1849C16.6794 34.7265 16.7133 24.6066 16.7133 24.6066C16.7133 24.6066 17.7732 16.2801 25.7351 15.305C25.7351 15.305 32.5439 14.1815 36.0245 19.8583C36.0245 19.8583 37.8815 22.2621 37.7331 26.5059L37.7628 36.1976C37.7628 36.1976 37.8772 37.8765 35.749 38.7159C35.749 38.7159 34.9307 39.161 33.7649 39.1738C33.7649 39.1738 32.7262 37.1981 29.8856 37.5585C27.0451 37.9188 26.3965 40.7424 26.3965 40.7424C26.3965 40.7424 25.8496 44.3503 28.6011 45.2576C28.6011 45.2576 30.2842 46.5676 32.8703 44.8929L33.5359 44.3672C33.5359 44.3672 38.4538 44.257 40.7983 41.408C40.7983 41.408 42.35 39.7715 42.6637 38.0376C42.6637 38.0376 47.0178 37.3041 48.6712 33.1832C48.6712 33.1832 50.791 29.126 47.8614 25.2552C47.8614 25.2552 45.3431 21.8297 42.35 21.8381C42.35 21.8381 41.8879 18.8365 39.7893 16.2504C39.7893 16.2504 36.7326 11.8327 31.0218 10.4337C25.3111 9.03463 20.3593 11.4681 20.3593 11.4681C20.3593 11.4681 16.6878 13.4395 14.8267 15.9918C12.9655 18.544 12.6518 19.6166 11.8844 21.9399Z" fill="white"/>
      </svg>`;
    }
  } else {
    temp.innerHTML = `<svg width="71" height="55" viewBox="0 0 71 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="35.5" cy="27.5" r="27.5" fill="#BE0707"/>
    <circle cx="35.5" cy="27.5" r="26.5" stroke="white" stroke-width="2"/>
    <path d="M55 27.5C55 37.6707 46.3173 46 35.5 46C24.6827 46 16 37.6707 16 27.5C16 17.3293 24.6827 9 35.5 9C46.3173 9 55 17.3293 55 27.5Z" stroke="white" stroke-width="2"/>
    <ellipse rx="6.01469" ry="5.08842" transform="matrix(0.779859 -0.625955 0.725595 0.688122 18.4589 34.7268)" fill="#BE0707"/>
    <ellipse rx="6.01469" ry="5.08842" transform="matrix(0.779859 -0.625955 0.725595 0.688122 51.2905 19.2209)" fill="#BE0707"/>
    <path d="M13.4829 34.5017L14.4951 36.6858L15.7843 36.0884C16.1475 35.92 16.3851 35.6933 16.497 35.4083C16.6089 35.1232 16.5847 34.8079 16.4246 34.4624C16.2686 34.1257 16.0405 33.9084 15.7405 33.8107C15.4405 33.7129 15.1103 33.7475 14.75 33.9145L13.4829 34.5017ZM14.9016 37.563L16.0163 39.9686L14.8733 40.4983L11.9109 34.1054L14.4494 32.9291C15.1375 32.6102 15.7608 32.5384 16.3193 32.7137C16.8763 32.8861 17.2972 33.2795 17.5819 33.8938C17.7803 34.3221 17.8492 34.7494 17.7885 35.1758C17.7264 35.5992 17.5378 35.9664 17.2227 36.2775L19.8131 38.2092L18.5106 38.8128L16.1376 36.9902L14.9016 37.563ZM24.4612 34.882L24.9087 35.8478L20.7709 37.7653L17.8084 31.3725L21.9462 29.455L22.3938 30.4208L19.3989 31.8086L20.1996 33.5364L23.0305 32.2245L23.4514 33.1327L20.6205 34.4446L21.4663 36.2698L24.4612 34.882ZM24.9115 33.7262L26.0234 33.2109C26.1512 33.471 26.3354 33.644 26.576 33.7298C26.8197 33.8142 27.0744 33.7948 27.3402 33.6716C27.6474 33.5293 27.8389 33.3311 27.9149 33.077C27.9925 32.8186 27.9512 32.5166 27.7911 32.1711L25.7217 27.7054L26.8602 27.1778L28.9338 31.6523C29.2349 32.3021 29.2858 32.892 29.0866 33.422C28.8903 33.9507 28.4672 34.3656 27.8175 34.6667C27.2061 34.95 26.6349 35.0066 26.104 34.8364C25.5718 34.6633 25.1742 34.2932 24.9115 33.7262ZM34.9006 30.0443L35.3481 31.0101L31.2103 32.9276L28.2478 26.5348L32.3856 24.6173L32.8332 25.5831L29.8384 26.9709L30.639 28.6987L33.47 27.3868L33.8908 28.295L31.0599 29.6069L31.9057 31.4321L34.9006 30.0443ZM39.3722 29.2745C38.4566 29.6988 37.5947 29.7394 36.7864 29.3964C35.981 29.0521 35.3415 28.369 34.868 27.3471C34.3972 26.3311 34.2922 25.4039 34.553 24.5654C34.8155 23.7227 35.4015 23.0905 36.3112 22.669C37.0555 22.3241 37.7816 22.2459 38.4897 22.4344C39.1963 22.62 39.7439 23.0389 40.1323 23.6913L39.007 24.2128C38.747 23.8453 38.4103 23.6103 37.9968 23.5077C37.5863 23.4038 37.1743 23.4476 36.7608 23.6392C36.2114 23.8938 35.8707 24.3082 35.7386 24.8825C35.6081 25.4524 35.7077 26.0933 36.0376 26.8051C36.3702 27.5228 36.7961 28.0161 37.3153 28.2849C37.8345 28.5537 38.3718 28.5595 38.927 28.3022C39.3494 28.1065 39.6538 27.8344 39.8404 27.4861C40.0286 27.1334 40.078 26.7445 39.9887 26.3195L41.1095 25.8001C41.3266 26.5318 41.2804 27.2062 40.9708 27.8233C40.6612 28.4404 40.1283 28.9241 39.3722 29.2745ZM45.6369 26.2422L44.4983 26.7698L41.9834 21.3428L40.0696 22.2297L39.622 21.2639L44.5839 18.9645L45.0314 19.9303L43.122 20.8152L45.6369 26.2422ZM52.2476 22.0056L52.6952 22.9713L48.5573 24.8889L45.5948 18.496L49.7327 16.5785L50.1802 17.5443L47.1854 18.9321L47.9861 20.6599L50.817 19.3481L51.2379 20.2563L48.4069 21.5681L49.2528 23.3934L52.2476 22.0056ZM50.9519 16.0135L53.2866 14.9316C54.2436 14.4881 55.118 14.4202 55.9099 14.7277C56.7018 15.0352 57.3317 15.694 57.7998 16.7041C58.2693 17.7172 58.3674 18.6296 58.0943 19.4415C57.8211 20.2533 57.206 20.881 56.2491 21.3244L53.9144 22.4064L50.9519 16.0135ZM52.5424 16.4496L54.6098 20.9109L55.6819 20.4141C56.3258 20.1157 56.7301 19.6951 56.8948 19.1524C57.0594 18.6097 56.9734 17.9751 56.6367 17.2485C56.3055 16.5338 55.8788 16.066 55.3567 15.8451C54.8332 15.6213 54.2525 15.6572 53.6146 15.9528L52.5424 16.4496Z" fill="white"/>
    </svg>`;
  }

  temp = document.createElement("p");
  const postDate = recentUpdates[i].onDate.toDate();
  if (recentUpdates[i].requestStatus === "BOOKED") {
    temp.innerText = `Booked on ${
      months[postDate.getMonth()]
    } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  } else {
    temp.innerText = `Requested on ${
      months[postDate.getMonth()]
    } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  }
  recentCards.children[i].children[0].children[1].appendChild(temp);
};

//Function to clear notification archive cards
clearRecentsUI = () => {
  recentCards.innerHTML = "";
};

clearAlertsUI = () => {
  alertCards.innerHTML = "";
};

clearAlertDetailUI = () => {
  document.getElementById("alertDetailCard").innerHTML = "";
};

clearNotificationsUI = () => {
  notifCards.innerHTML = "";
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
  temp.classList.add("notifCard");
  document.getElementById("notificationCards").appendChild(temp);
  temp = document.createElement("div");
  temp.classList.add("view_more_notif");
  document
    .getElementById("notificationCards")
    .children[notificationsLength].appendChild(temp);
  temp = document.createElement("a");
  temp.innerHTML = `VIEW MORE <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.03274 0.705384C0.643468 1.09466 0.643124 1.72569 1.03197 2.11538L4.20333 5.29366C4.59283 5.68401 4.59283 6.31599 4.20333 6.70634L1.03197 9.88462C0.643124 10.2743 0.643468 10.9053 1.03274 11.2946C1.42231 11.6842 2.05394 11.6842 2.44351 11.2946L7.03102 6.70711C7.42154 6.31658 7.42154 5.68342 7.03102 5.29289L2.44351 0.705384C2.05394 0.315811 1.42231 0.315811 1.03274 0.705384Z" fill="#81B7AE"/>
  </svg>`;
  temp.setAttribute("href", "./notificationArchive.html");
  document
    .getElementById("notificationCards")
    .children[notificationsLength].children[0].appendChild(temp);
});

// Function to display notification cards
displayNotificationUI = (i) => {
  temp = document.createElement("div");
  temp.setAttribute("data-number", `${notifications[i].notifID}`);
  temp.classList.add("notifCard");
  notifCards.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("notifCard_wrapper");
  notifCards.children[i].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("notifCard_content_wrapper");
  notifCards.children[i].children[0].appendChild(temp);

  temp = document.createElement("h3");
  temp.classList.add("notifCard_title");
  temp.innerText = `${notifications[i].notifHead}`;
  notifCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notif_excerpt");
  temp.innerText = `${notifications[i].description}`;
  notifCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("notifCard_duration_date_wrapper");
  notifCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifCard_duration_date");
  const postDurationStartDate = notifications[i].startDate.toDate();
  const postDurationEndDate = notifications[i].endDate.toDate();
  temp.innerHTML = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 13.5938C15 14.3701 14.2801 15 13.3929 15H1.60714C0.719867 15 0 14.3701 0 13.5938V5.625H15V13.5938ZM12.8571 7.96875C12.8571 7.71094 12.6161 7.5 12.3214 7.5H9.10714C8.8125 7.5 8.57143 7.71094 8.57143 7.96875V10.7812C8.57143 11.0391 8.8125 11.25 9.10714 11.25H12.3214C12.6161 11.25 12.8571 11.0391 12.8571 10.7812V7.96875ZM1.60714 1.875H3.21429V0.46875C3.21429 0.210938 3.45536 0 3.75 0H4.82143C5.11607 0 5.35714 0.210938 5.35714 0.46875V1.875H9.64286V0.46875C9.64286 0.210938 9.88393 0 10.1786 0H11.25C11.5446 0 11.7857 0.210938 11.7857 0.46875V1.875H13.3929C14.2801 1.875 15 2.50488 15 3.28125V4.6875H0V3.28125C0 2.50488 0.719867 1.875 1.60714 1.875Z" fill="#4F4F4F"/>
  </svg> ${
    months[postDurationStartDate.getMonth()]
  } ${postDurationStartDate.getDay()}, ${postDurationStartDate.getFullYear()} - ${
    months[postDurationEndDate.getMonth()]
  } ${postDurationEndDate.getDay()}, ${postDurationEndDate.getFullYear()}`;
  notifCards.children[i].children[0].children[0].children[2].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("notifCard_duration_time_wrapper");
  notifCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifCard_duration_time");
  temp.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z" fill="#4F4F4F"/>
  </svg> 14:00 - 15:00`;
  notifCards.children[i].children[0].children[0].children[3].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("notifCard_date_wrapper");
  notifCards.children[i].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("notif_icon");
  temp.innerHTML = `<svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path opacity="0.8" d="M27.67 27.4179C26.7596 26.4842 26.25 25.2316 26.25 23.9274V16.3462C26.25 10.9174 23.65 6.3017 19.0623 4.57725C18.3438 4.30718 17.8125 3.65218 17.8125 2.88462C17.8125 1.28846 16.5562 0 15 0C13.4438 0 12.1875 1.28846 12.1875 2.88462C12.1875 3.65205 11.656 4.30685 10.9372 4.57567C6.33537 6.29666 3.75 10.8984 3.75 16.3462V23.9274C3.75 25.2316 3.24044 26.4842 2.33 27.4179L0.388219 29.4095C0.139311 29.6648 0 30.0072 0 30.3638C0 31.1188 0.612013 31.7308 1.36697 31.7308H28.633C29.388 31.7308 30 31.1188 30 30.3638C30 30.0072 29.8607 29.6648 29.6118 29.4095L27.67 27.4179ZM16.875 24.0865C16.875 25.1221 16.0355 25.9615 15 25.9615C13.9645 25.9615 13.125 25.1221 13.125 24.0865V23.9904C13.125 22.9549 13.9645 22.1154 15 22.1154C16.0355 22.1154 16.875 22.9549 16.875 23.9904V24.0865ZM16.875 16.3942C16.875 17.4298 16.0355 18.2692 15 18.2692C13.9645 18.2692 13.125 17.4298 13.125 16.3942V12.4519C13.125 11.4164 13.9645 10.5769 15 10.5769C16.0355 10.5769 16.875 11.4164 16.875 12.4519V16.3942ZM15 37.5C15.7679 37.5 16.4839 37.2601 17.0801 36.8497C18.7861 35.6754 17.0711 33.6538 15 33.6538C12.9289 33.6538 11.2082 35.6787 12.9149 36.8519C13.51 37.2609 14.2265 37.5 15 37.5Z" fill="#81B7AE"/>
</svg>`;
  notifCards.children[i].children[0].children[1].appendChild(temp);

  temp = document.createElement("p");
  const postDate = notifications[i].onDate.toDate();
  temp.innerHTML = `Posted on<br>${
    months[postDate.getMonth()]
  } ${postDate.getDay()}, ${postDate.getFullYear()}`;
  notifCards.children[i].children[0].children[1].appendChild(temp);
};

/******************************************************************************
        Alerts cards retreival and display in order starts here
******************************************************************************/
// On status change in db update front end for alerts
db.collection("alerts").onSnapshot((doc) => {
  alerts = [];
  // clearAlertsUI();

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
    temp.innerHTML = `VIEW MORE <svg width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.03274 0.705384C0.643468 1.09466 0.643124 1.72569 1.03197 2.11538L4.20333 5.29366C4.59283 5.68401 4.59283 6.31599 4.20333 6.70634L1.03197 9.88462C0.643124 10.2743 0.643468 10.9053 1.03274 11.2946C1.42231 11.6842 2.05394 11.6842 2.44351 11.2946L7.03102 6.70711C7.42154 6.31658 7.42154 5.68342 7.03102 5.29289L2.44351 0.705384C2.05394 0.315811 1.42231 0.315811 1.03274 0.705384Z" fill="#BE0707"/>
    </svg>`;
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
  alertCards.appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("alertCard_wrapper");
  alertCards.children[i].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("alertCard_content_wrapper");
  alertCards.children[i].children[0].appendChild(temp);

  temp = document.createElement("h3");
  temp.classList.add("alertCard_title");
  temp.innerText = `${alerts[i].alertHead}`;
  alertCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alert_excerpt");
  temp.innerText = `${alerts[i].description}`;
  alertCards.children[i].children[0].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("alertCard_date_wrapper");
  alertCards.children[i].children[0].appendChild(temp);

  temp = document.createElement("div");
  temp.classList.add("alert_icon");
  alertCards.children[i].children[0].children[1].appendChild(temp);

  alertCards.children[
    i
  ].children[0].children[1].children[0].innerHTML = `<svg width="35" height="30" viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M0.877258 28.4961C0.488375 29.1628 0.969246 30 1.74104 30H33.259C34.0308 30 34.5116 29.1628 34.1227 28.4961L18.3638 1.48077C17.9779 0.81926 17.0221 0.819258 16.6362 1.48076L0.877258 28.4961ZM19.0909 24.2632C19.0909 24.8154 18.6432 25.2632 18.0909 25.2632H16.9091C16.3568 25.2632 15.9091 24.8154 15.9091 24.2632V23.1053C15.9091 22.553 16.3568 22.1053 16.9091 22.1053H18.0909C18.6432 22.1053 19.0909 22.553 19.0909 23.1053V24.2632ZM19.0909 17.9474C19.0909 18.4997 18.6432 18.9474 18.0909 18.9474H16.9091C16.3568 18.9474 15.9091 18.4997 15.9091 17.9474V13.6316C15.9091 13.0793 16.3568 12.6316 16.9091 12.6316H18.0909C18.6432 12.6316 19.0909 13.0793 19.0909 13.6316V17.9474Z" fill="#BE0707"/>
</svg>`;

  temp = document.createElement("p");
  temp.classList.add("alertCard_date_posted");
  const postDate = alerts[i].onDate.toDate();
  temp.innerHTML = `Posted on<br>${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  alertCards.children[i].children[0].children[1].appendChild(temp);
};

/******************************************************************************
        Alerts cards retreival and display in order ends here
******************************************************************************/

 
/******************************************************************************
      Different Cards Detail view JS starts here
******************************************************************************/
// Back button
$(".back_btn").click(function () {
  $(".body_wrapper_alert").addClass("hidden");
  $(".body_wrapper_notif").addClass("hidden");
  $(".body_wrapper_home").removeClass("hidden");
  clearAlertDetailUI();
  clearNotifDetailUI();
});

// Navigating to card details page
let cardID;
// let getTarget;

document.onclick = function (e) {
  console.log(e.target);
  alertDetail = [];
  notifDetail = [];
  cardID = undefined;
  // getTarget = undefined;
  if (e.target.closest(".alertCard") != undefined) {
    cardID = e.target.closest(".alertCard").getAttribute("data-number");
  } else if (e.target.closest(".notifCard") != undefined) {
    cardID = e.target.closest(".notifCard").getAttribute("data-number");
  } else if (e.target.closest(".newRequestCard") != undefined) {
    cardID = e.target.closest(".newReqeustCard").getAttribute("data-number");
  } else {
    cardID = undefined;
  }

  if (cardID) {
    if (cardID.includes("alert")) {
      $(".body_wrapper_home").addClass("hidden");
      $(".body_wrapper_alert").removeClass("hidden");
      alertDetail.push(alerts.find((element) => element.alertID === cardID));
      displayAlertDetailUI(0);
    } else if (cardID.includes("notif")) {
      $(".body_wrapper_home").addClass("hidden");
      $(".body_wrapper_notif").removeClass("hidden");
      notifDetail.push(
        notifications.find((element) => element.notifID === cardID)
      );
      displayNotifDetailUI(0);
    } else if (cardID.includes("book")) {
      $(".body_wrapper_home").addClass("hidden");
      $(".body_wrapper_notif").removeClass("hidden");
      notifDetail.push(
        notifications.find((element) => element.bookingID === cardID)
      );
      displayBookingDetailUI(0);
    } else if (cardID.includes("request")) {
      $(".body_wrapper_home").addClass("hidden");
      $(".body_wrapper_notif").removeClass("hidden");
      notifDetail.push(
        notifications.find((element) => element.requestID === cardID)
      );
      displayRequestDetailUI(0);
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
  document.getElementById("alertDetail").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("alertDetailCardTitle");
  temp.innerText = `${alertDetail[0].alertHead}`;
  document.getElementById("alertDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alertDetailPostedDate");
  const postDate = alerts[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  document.getElementById("alertDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alertDetailDescription");
  temp.innerText = `${alertDetail[i].description}`;
  document.getElementById("alertDetail").children[i].appendChild(temp);
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
  document.getElementById("notifDetail").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notifDetailCardTitle");
  temp.innerText = `${notifDetail[i].notifHead}`;
  document.getElementById("notifDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifDetailPostedDate");
  const postDate = notifDetail[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDay()}, ${postDate.getFullYear()}`;
  document.getElementById("notifDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifDetailDuration");
  temp.innerText = `${notifDetail[i].duration}`;
  document.getElementById("notifDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notifDetaildescription");
  temp.innerText = `${notifDetail[i].description}`;
  document.getElementById("notifDetail").children[i].appendChild(temp);
};

/******************************************************************************
      Notification Detail view JS ends here
******************************************************************************/


/******************************************************************************
      Request Detail view JS starts here
******************************************************************************/

//Function to display Request detail card
displayRequestDetailUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("requestDetailCard");
  document.getElementById("requestDetail").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestDetailCardTitle");
  temp.innerText = `${requestDetail[i].requestHead}`;
  document.getElementById("requestDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("requestDetailPostedDate");
  const postDate = requestDetail[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDay()}, ${postDate.getFullYear()}`;
  document.getElementById("requestDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("requestDetailDuration");
  temp.innerText = `${requestDetail[i].duration}`;
  document.getElementById("requestDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("requestDetaildescription");
  temp.innerText = `${requestDetail[i].description}`;
  document.getElementById("requestDetail").children[i].appendChild(temp);
};

/******************************************************************************
      Request Detail view JS ends here
******************************************************************************/


/******************************************************************************
      Booking Detail view JS starts here
******************************************************************************/

//Function to display Booking detail card
displayBookingDetailUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("bookingDetailCard");
  document.getElementById("bookingDetail").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("bookingDetailCardTitle");
  temp.innerText = `${bookingDetail[i].bookingHead}`;
  document.getElementById("bookingDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDetailPostedDate");
  const postDate = bookingDetail[i].onDate.toDate();
  temp.innerText = `Posted on ${
    months[postDate.getMonth()]
  } ${postDate.getDay()}, ${postDate.getFullYear()}`;
  document.getElementById("bookingDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDetailDuration");
  temp.innerText = `${bookingDetail[i].duration}`;
  document.getElementById("bookingDetail").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDetaildescription");
  temp.innerText = `${bookingDetail[i].description}`;
  document.getElementById("bookingDetail").children[i].appendChild(temp);
};

/******************************************************************************
      Booking Detail view JS ends here
******************************************************************************/
