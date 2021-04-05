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
  $("#nav_tbox").css("color", "#81B7AE");
  $("#nav_tbox > svg").children().css("fill", "#81B7AE");
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

// Tag filtering
document.getElementById("requests_btn").addEventListener("click", function () {
  clearRecentsUI();
  if (
    !document
      .getElementById("requests_btn")
      .classList.contains("activeFilterTextRequest")
  ) {
    document.getElementById("requests_btn").classList.add("activeFilterTextRequest");
    document
      .getElementById("bookings_btn")
      .classList.remove("activeFilterTextBooking");
    recentUpdates = [];
    requests.forEach((card) => {
      recentUpdates.push(card);
    });
    recentUpdates.sort(function (a, b) {
      if (a.statusChangeTime < b.statusChangeTime) return 1;
      if (a.statusChangeTime > b.statusChangeTime) return -1;
      return 0;
    });
    let recentsLength = recentUpdates.length;
    for (i = 0; i < recentsLength; i++) {
      displayRecenttUI(i);
    }
  } else {
    document
      .getElementById("requests_btn")
      .classList.remove("activeFilterTextRequest");
    mergeRecentCards();
  }
});

document.getElementById("bookings_btn").addEventListener("click", function () {
  clearRecentsUI();
  if (
    !document
      .getElementById("bookings_btn")
      .classList.contains("activeFilterTextBooking")
  ) {
    document.getElementById("bookings_btn").classList.add("activeFilterTextBooking");
    document
      .getElementById("requests_btn")
      .classList.remove("activeFilterTextRequest");
    recentUpdates = [];
    bookings.forEach((card) => {
      recentUpdates.push(card);
    });
    recentUpdates.sort(function (a, b) {
      if (a.statusChangeTime < b.statusChangeTime) return 1;
      if (a.statusChangeTime > b.statusChangeTime) return -1;
      return 0;
    });
    let recentsLength = recentUpdates.length;
    for (i = 0; i < recentsLength; i++) {
      displayRecenttUI(i);
    }
  } else {
    document
      .getElementById("bookings_btn")
      .classList.remove("activeFilterTextBooking");
    mergeRecentCards();
  }
});

/////////////////////////////////////////////////////
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

// Select the request cards container
let recentCards = document.getElementById("recentCards");

//Function to clear notification archive cards
clearRecentsUI = () => {
  recentCards.innerHTML = "";
};

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
    temp.classList.add("requestStatusBar");
    temp.innerHTML = `<div class="statusProgressSent"></div>`;
  } else if (recentUpdates[i].requestStatus === "READ") {
    temp.classList.add("requestStatusBar");
    temp.innerHTML = `<div class="statusProgressRead"></div>`;
  } else if (recentUpdates[i].requestStatus === "REJECTED") {
    temp.classList.add("requestStatusBar");
    temp.innerHTML = `<div class="statusProgressRejected"></div>`;
  } else if (recentUpdates[i].requestStatus === "MESSAGE") {
    temp.classList.add("requestStatusBar");
    temp.innerHTML = `<div class="statusProgressMessage"></div>`;
  } else if (recentUpdates[i].requestStatus === "COMPLETED") {
    temp.classList.add("requestStatusBar");
    temp.innerHTML = `<div class="statusProgressCompleted"></div>`;
  } else if (recentUpdates[i].requestStatus === "BOOKED") {
    temp.classList.add("bookingStatusBar");
  } else {
    temp.classList.add("requestStatusBar");
    temp.innerHTML = `<div class="statusProgressOngoing"></div>`;
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
    temp.innerHTML = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="27.5" cy="27.5" r="27.5" fill="#BE0707"/>
    <path d="M47 27.5C47 37.6707 38.3173 46 27.5 46C16.6827 46 8 37.6707 8 27.5C8 17.3293 16.6827 9 27.5 9C38.3173 9 47 17.3293 47 27.5Z" stroke="white" stroke-width="2"/>
    <rect x="1.94678" y="31.8781" width="50" height="13" transform="rotate(-24.86 1.94678 31.8781)" fill="#BE0707"/>
    <path d="M5.37852 34.5501L6.64557 33.9629C7.3677 33.6283 8.00814 33.8374 8.3202 34.5108C8.64046 35.2019 8.40642 35.8001 7.67986 36.1368L6.39066 36.7342L5.37852 34.5501ZM6.79715 37.6114L8.03319 37.0386L10.4062 38.8612L11.7086 38.2576L9.11827 36.3259C9.75299 35.6981 9.86958 34.7884 9.47746 33.9422C8.91083 32.7195 7.72721 32.3369 6.34497 32.9775L3.80644 34.1538L6.76893 40.5467L7.91193 40.017L6.79715 37.6114ZM16.3568 34.9304L13.3619 36.3183L12.5161 34.493L15.347 33.1811L14.9261 32.2729L12.0952 33.5848L11.2945 31.857L14.2894 30.4692L13.8418 29.5034L9.70398 31.4209L12.6665 37.8137L16.8043 35.8962L16.3568 34.9304ZM16.807 33.7746C17.3326 34.9087 18.4947 35.2797 19.7131 34.7151C21.0111 34.1136 21.433 33.0032 20.8294 31.7007L18.7558 27.2262L17.6173 27.7538L19.6867 32.2195C20.007 32.9106 19.8472 33.4367 19.2358 33.72C18.7042 33.9664 18.1766 33.7803 17.919 33.2593L16.807 33.7746ZM26.7962 30.0927L23.8013 31.4805L22.9555 29.6553L25.7864 28.3434L25.3655 27.4352L22.5346 28.7471L21.734 27.0193L24.7288 25.6315L24.2812 24.6657L20.1434 26.5832L23.1059 32.976L27.2437 31.0585L26.7962 30.0927ZM31.2678 29.3229C32.7785 28.6228 33.4401 27.3098 33.0051 25.8485L31.8843 26.3679C32.0643 27.2209 31.6688 27.9585 30.8226 28.3506C29.7151 28.8639 28.5983 28.2889 27.9332 26.8535C27.2721 25.427 27.5577 24.1968 28.6564 23.6876C29.4848 23.3037 30.3804 23.5291 30.9026 24.2612L32.0279 23.7397C31.2497 22.432 29.6909 22.0296 28.2068 22.7174C26.3904 23.5591 25.8192 25.3576 26.7636 27.3955C27.7141 29.4467 29.4426 30.1687 31.2678 29.3229ZM37.5325 26.2906L35.0176 20.8636L36.927 19.9787L36.4795 19.0129L31.5176 21.3123L31.9651 22.2781L33.879 21.3912L36.3939 26.8182L37.5325 26.2906ZM44.1432 22.054L41.1484 23.4418L40.3025 21.6165L43.1335 20.3047L42.7126 19.3965L39.8817 20.7083L39.081 18.9805L42.0758 17.5927L41.6283 16.6269L37.4904 18.5444L40.4529 24.9373L44.5908 23.0198L44.1432 22.054ZM42.8475 16.0619L45.81 22.4548L48.1447 21.3728C50.0586 20.4859 50.6336 18.7772 49.6954 16.7525C48.7572 14.7279 47.0917 14.0951 45.1822 14.98L42.8475 16.0619ZM44.438 16.498L45.5102 16.0012C46.7861 15.41 47.8692 15.8659 48.5323 17.2969C49.2078 18.7545 48.8623 19.8671 47.5775 20.4625L46.5054 20.9593L44.438 16.498Z" fill="white"/>
    </svg>`;
  }

  temp = document.createElement("p");
  const postDate = recentUpdates[i].onDate.toDate();
  if (recentUpdates[i].requestStatus === "BOOKED") {
    temp.innerText = `${
      months[postDate.getMonth()]
    } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  } else {
    temp.innerText = `${
      months[postDate.getMonth()]
    } ${postDate.getDate()}, ${postDate.getFullYear()}`;
  }
  recentCards.children[i].children[0].children[1].appendChild(temp);
};

/******************************************************************************
        Different Cards Detail view JS starts here
******************************************************************************/
// Back button
$(".back_btn").click(function () {
  $(".body_wrapper_req").addClass("hidden");
  $(".body_wrapper_book").addClass("hidden");
  $(".body_wrapper_tenexbox").removeClass("hidden");
});

// Navigating to card details page
let cardID;
// let getTarget;

document.onclick = function (e) {
  // console.log(e.target);
  requestDetail = [];
  bookingDetail = [];
  cardID = undefined;
  // getTarget = undefined;
  if (e.target.closest(".newRequestCard") != undefined) {
    cardID = e.target.closest(".newRequestCard").getAttribute("data-number");
  } else {
    cardID = undefined;
  }

  if (cardID) {
    if (cardID.includes("book")) {
      $(".body_wrapper_tenexbox").addClass("hidden");
      $(".body_wrapper_req").addClass("hidden");
      $(".body_wrapper_book").removeClass("hidden");
      bookingDetail.push(
        recentUpdates.find((element) => element.bookingID === cardID)
      );
      displayBookingDetailUI(0);
    } else if (cardID.includes("request")) {
      $(".body_wrapper_tenexbox").addClass("hidden");
      $(".body_wrapper_book").addClass("hidden");
      $(".body_wrapper_req").removeClass("hidden");
      requestDetail.push(
        recentUpdates.find((element) => element.requestID === cardID)
      );
      displayRequestDetailUI(0);
    }
  }
};

/******************************************************************************
      Different Cards Detail view JS ends here
******************************************************************************/

/******************************************************************************
      Request Detail view JS starts here
******************************************************************************/

//Function to display Request detail card
displayRequestDetailUI = (i) => {
  const postDate = requestDetail[i].onDate.toDate();
  document.getElementById(
    "requestDetail"
  ).innerHTML = `<div class="RequestDetailCard">
  <h3 class="requestTitle">
  ${requestDetail[i].title}
  </h3>
  <div class="requestDetail">
      <div class="requestStatusBar"></div>
      <div class="requestInfoMain">
          <p class="description">${requestDetail[i].description}</p>
          <div class="attachmentSection">
          </div>
      </div>
  </div>
  <div class="requestDetailSub">
      <p class="newRequestStatus">${requestDetail[i].requestStatus}</p>
      <p class="newRequestDate">${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}</p>
  </div>
</div>`;
  if (requestDetail[i].requestStatus === "SENT") {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressSent"></div>`;
    document.querySelector(
      ".tipsInfoSection"
    ).innerHTML = `<div class="illustration">
    <svg width="129" height="98" viewBox="0 0 129 98" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g opacity="0.5">
            <path
                d="M3.29602 97.3995L0.00275268 21.034C0.00275268 21.034 -0.198165 18.457 2.83305 18.457C5.86426 18.457 55.9972 18.8327 55.9972 18.8327L65.746 29.8044L62.6187 97.3995H3.29602Z"
                fill="#A7A9AC" />
            <path
                d="M55.5865 32.2676H27.6505C27.1728 32.2676 26.7856 32.6548 26.7856 33.1324V33.6565C26.7856 34.1341 27.1728 34.5213 27.6505 34.5213H55.5865C56.0641 34.5213 56.4513 34.1341 56.4513 33.6565V33.1324C56.4513 32.6548 56.0641 32.2676 55.5865 32.2676Z"
                fill="#F1F2F2" />
            <path
                d="M55.5865 37.6406H27.6505C27.1728 37.6406 26.7856 38.0278 26.7856 38.5055V39.0296C26.7856 39.5072 27.1728 39.8944 27.6505 39.8944H55.5865C56.0641 39.8944 56.4513 39.5072 56.4513 39.0296V38.5055C56.4513 38.0278 56.0641 37.6406 55.5865 37.6406Z"
                fill="#F1F2F2" />
            <path
                d="M54.7305 45.3711H10.5465C10.0688 45.3711 9.68164 45.7583 9.68164 46.2359V46.76C9.68164 47.2377 10.0688 47.6249 10.5465 47.6249H54.7305C55.2081 47.6249 55.5953 47.2377 55.5953 46.76V46.2359C55.5953 45.7583 55.2081 45.3711 54.7305 45.3711Z"
                fill="#F1F2F2" />
            <path
                d="M54.7305 57.9316H10.5465C10.0688 57.9316 9.68164 58.3188 9.68164 58.7964V59.3206C9.68164 59.7982 10.0688 60.1854 10.5465 60.1854H54.7305C55.2081 60.1854 55.5953 59.7982 55.5953 59.3206V58.7964C55.5953 58.3188 55.2081 57.9316 54.7305 57.9316Z"
                fill="#F1F2F2" />
            <path
                d="M54.7305 63.8477H10.5465C10.0688 63.8477 9.68164 64.2348 9.68164 64.7125V65.2366C9.68164 65.7142 10.0688 66.1014 10.5465 66.1014H54.7305C55.2081 66.1014 55.5953 65.7142 55.5953 65.2366V64.7125C55.5953 64.2348 55.2081 63.8477 54.7305 63.8477Z"
                fill="#F1F2F2" />
            <path
                d="M54.7305 71.1152H10.5465C10.0688 71.1152 9.68164 71.5024 9.68164 71.98V72.5041C9.68164 72.9818 10.0688 73.3689 10.5465 73.3689H54.7305C55.2081 73.3689 55.5953 72.9818 55.5953 72.5041V71.98C55.5953 71.5024 55.2081 71.1152 54.7305 71.1152Z"
                fill="#F1F2F2" />
            <path
                d="M54.7305 83.9297H10.5465C10.0688 83.9297 9.68164 84.3169 9.68164 84.7945V85.3186C9.68164 85.7962 10.0688 86.1835 10.5465 86.1835H54.7305C55.2081 86.1835 55.5953 85.7962 55.5953 85.3186V84.7945C55.5953 84.3169 55.2081 83.9297 54.7305 83.9297Z"
                fill="#F1F2F2" />
            <path
                d="M44.2479 76.5742H10.5465C10.0688 76.5742 9.68164 76.9614 9.68164 77.439V77.9631C9.68164 78.4408 10.0688 78.8279 10.5465 78.8279H44.2479C44.7255 78.8279 45.1127 78.4408 45.1127 77.9631V77.439C45.1127 76.9614 44.7255 76.5742 44.2479 76.5742Z"
                fill="#F1F2F2" />
            <path
                d="M44.2479 90.4277H10.5465C10.0688 90.4277 9.68164 90.8149 9.68164 91.2925V91.8166C9.68164 92.2943 10.0688 92.6815 10.5465 92.6815H44.2479C44.7255 92.6815 45.1127 92.2943 45.1127 91.8166V91.2925C45.1127 90.8149 44.7255 90.4277 44.2479 90.4277Z"
                fill="#F1F2F2" />
            <path
                d="M44.2479 50.7441H10.5465C10.0688 50.7441 9.68164 51.1313 9.68164 51.609V52.1331C9.68164 52.6107 10.0688 52.9979 10.5465 52.9979H44.2479C44.7255 52.9979 45.1127 52.6107 45.1127 52.1331V51.609C45.1127 51.1313 44.7255 50.7441 44.2479 50.7441Z"
                fill="#F1F2F2" />
            <path
                d="M13.272 40.2356C13.272 40.2356 13.2021 40.1745 13.1409 40.0435L12.9662 39.6329L8.27527 27.84C8.1209 27.4951 7.90478 27.1813 7.63758 26.914C7.37387 26.667 7.05255 26.4898 6.70288 26.3987C6.51859 26.3471 6.34004 26.2768 6.17002 26.189C6.11933 26.165 6.07577 26.1282 6.0436 26.0823C6.01144 26.0363 5.99178 25.9828 5.98657 25.927C5.98657 25.8396 6.04772 25.7785 6.16129 25.7348C6.30947 25.696 6.4624 25.6783 6.61553 25.6824C6.94748 25.6824 7.27069 25.6824 7.5677 25.6824C7.8647 25.6824 8.18791 25.6824 8.5548 25.6824C8.92169 25.6824 9.341 25.6824 9.70789 25.6824H10.5814C10.7374 25.6783 10.8933 25.696 11.0444 25.7348C11.158 25.7348 11.2191 25.8309 11.2191 25.9182C11.2163 25.9714 11.1984 26.0226 11.1674 26.066C11.1365 26.1093 11.0938 26.1429 11.0444 26.1628C10.8683 26.2387 10.6874 26.3029 10.5028 26.355C10.4263 26.3666 10.3541 26.3976 10.2929 26.445C10.2318 26.4924 10.1838 26.5546 10.1534 26.6258C10.0934 26.7665 10.0636 26.9183 10.066 27.0713C10.0781 27.3897 10.137 27.7047 10.2408 28.006L11.1143 30.3122C11.3938 31.011 11.6646 31.6836 11.9354 32.33C12.2062 32.9765 12.4858 33.6316 12.809 34.3043C13.1322 34.9769 13.4379 35.7281 13.7961 36.558C13.866 36.7153 13.9271 36.7939 13.9795 36.7764C14.032 36.7589 14.0756 36.6978 14.1193 36.5842L15.8664 32.3825C15.8664 32.2689 15.9363 32.1641 15.9625 32.0855C16.0151 31.9296 16.0151 31.7608 15.9625 31.605L15.8315 31.2469L14.5735 28.1894C14.3887 27.7301 14.0877 27.3268 13.7 27.0189C13.3479 26.7421 12.9483 26.5319 12.5207 26.3987C12.3364 26.3471 12.1579 26.2768 11.9878 26.189C11.9372 26.165 11.8936 26.1282 11.8614 26.0823C11.8293 26.0363 11.8096 25.9828 11.8044 25.927C11.8044 25.8396 11.8655 25.7785 11.9791 25.7348C12.1273 25.696 12.2802 25.6783 12.4334 25.6824C12.6692 25.6824 12.8876 25.6824 13.0973 25.6824C13.3069 25.6824 13.5253 25.6824 13.7524 25.6824H14.4775C14.8094 25.6824 15.1239 25.6824 15.4034 25.6824H16.1547C16.3078 25.6777 16.4608 25.6954 16.6089 25.7348C16.7312 25.7348 16.7836 25.8309 16.7836 25.9182C16.779 25.9822 16.7559 26.0435 16.7171 26.0947C16.6784 26.1459 16.6256 26.1847 16.5652 26.2065L16.1197 26.4423C16.0488 26.48 15.9899 26.5368 15.9498 26.6063C15.9096 26.6758 15.8898 26.7552 15.8926 26.8354C15.8926 26.8354 15.8926 26.8878 15.8926 26.9228C15.8905 26.9519 15.8905 26.9811 15.8926 27.0101C15.8926 27.0626 15.98 27.2111 16.0586 27.4295C16.1372 27.6478 16.2333 27.9099 16.3381 28.1807L16.6526 28.9582L16.871 29.4648C16.9496 29.6395 17.0107 29.7269 17.0544 29.7356C17.0981 29.7443 17.1767 29.657 17.2641 29.4648C17.3514 29.2726 17.4999 28.9057 17.6222 28.5913C17.7445 28.2768 17.8581 27.9449 17.9542 27.6478L18.1376 27.0276C18.1429 26.9753 18.1429 26.9227 18.1376 26.8704C18.143 26.7937 18.128 26.717 18.0943 26.648C18.0606 26.579 18.0092 26.5201 17.9454 26.4773L17.5436 26.2327C17.4848 26.2072 17.4341 26.166 17.3971 26.1136C17.3601 26.0612 17.3383 25.9996 17.334 25.9357C17.334 25.8483 17.3951 25.7872 17.5087 25.7522C17.6569 25.7134 17.8098 25.6958 17.9629 25.6998H18.6181C18.778 25.7111 18.9386 25.7111 19.0985 25.6998C19.308 25.7105 19.518 25.7105 19.7275 25.6998C19.9456 25.6843 20.1645 25.6843 20.3826 25.6998C20.5358 25.6958 20.6887 25.7134 20.8369 25.7522C20.9504 25.7959 21.0116 25.8571 21.0116 25.9444C21.0078 25.9973 20.9895 26.0481 20.9586 26.0913C20.9278 26.1344 20.8857 26.1683 20.8369 26.189C20.6671 26.2782 20.4843 26.3401 20.2953 26.3724C19.954 26.4256 19.6288 26.5539 19.3431 26.7481C19.1336 26.945 18.9541 27.1717 18.8103 27.4207C18.7404 27.5488 18.6355 27.7672 18.4958 28.0759C18.356 28.3816 18.2162 28.7136 18.059 29.0717C17.9018 29.4299 17.7795 29.7793 17.6572 30.0938C17.6055 30.2354 17.5675 30.3817 17.5436 30.5305C17.5137 30.6599 17.5137 30.7943 17.5436 30.9237L19.7886 36.689C19.7886 36.7589 19.8498 36.7851 19.8935 36.7502C19.9551 36.7005 20.0007 36.6336 20.0245 36.558C20.3914 35.5971 20.8019 34.3742 21.2562 32.8804C21.7104 31.3866 22.1909 29.8055 22.6801 28.137C22.7254 28.0066 22.7576 27.872 22.7762 27.7352C22.7879 27.6102 22.7879 27.4845 22.7762 27.3596C22.7809 27.1529 22.7328 26.9484 22.6364 26.7656C22.5809 26.6735 22.5061 26.5945 22.4171 26.5342C22.3281 26.4739 22.2271 26.4336 22.121 26.4161C21.9812 26.4161 21.824 26.32 21.658 26.2502C21.492 26.1803 21.4047 26.0842 21.4047 25.9881C21.4047 25.892 21.4658 25.8396 21.5794 25.7959C21.7276 25.7571 21.8805 25.7395 22.0336 25.7435H22.8286H23.606C23.9642 25.7435 24.3136 25.7435 24.6456 25.7435C24.9775 25.7435 25.2832 25.7435 25.5628 25.7435C25.7159 25.7389 25.869 25.7565 26.017 25.7959C26.1393 25.8396 26.1917 25.9007 26.1917 25.9881C26.19 26.0416 26.1725 26.0933 26.1414 26.1369C26.1103 26.1804 26.0671 26.2137 26.017 26.2327C25.8473 26.3219 25.6645 26.3838 25.4754 26.4161C25.1487 26.4864 24.847 26.6433 24.6019 26.8704C24.3733 27.0819 24.1814 27.3298 24.0341 27.6042C23.903 27.875 23.7895 28.1195 23.7021 28.3379L19.8498 39.6941C19.8139 39.7963 19.7701 39.8956 19.7187 39.9911C19.6489 40.1308 19.5702 40.192 19.5004 40.192C19.4617 40.1857 19.4247 40.1717 19.3917 40.1506C19.3586 40.1296 19.3302 40.102 19.3082 40.0697C19.2337 39.9844 19.1746 39.8869 19.1335 39.7814C18.7578 38.9079 18.4259 38.1304 18.1551 37.4403C17.8843 36.7502 17.6135 36.0601 17.3602 35.37C17.1068 34.6799 16.8011 33.9024 16.4866 33.0638C16.4866 32.959 16.408 32.9153 16.3818 32.9415C16.3237 33.0177 16.2793 33.1034 16.2508 33.1949C15.9013 34.016 15.6043 34.7498 15.3772 35.3875C15.1501 36.0252 14.8706 36.6716 14.626 37.3355C14.3814 37.9994 14.1018 38.7506 13.7961 39.6067C13.7339 39.7602 13.661 39.9091 13.5777 40.0522C13.4467 40.1658 13.3593 40.2356 13.272 40.2356Z"
                fill="#F1F2F2" />
            <path
                d="M55.9969 18.877L55.2456 27.132C55.3064 27.7631 55.594 28.3508 56.055 28.786C56.516 29.2213 57.1191 29.4747 57.7527 29.4993C60.0326 29.6129 65.7457 29.8487 65.7457 29.8487L55.9969 18.877Z"
                fill="#939598" />
            <path d="M95.8003 87.1099L96.1748 92.1453L97.7978 93.4521L99.5956 92.4616V86.1777L95.8003 87.1099Z"
                fill="#E6E7E8" />
            <path d="M118.597 84.6201L120.652 89.9968H123.141L123.357 88.9397L122.733 84.0625L118.597 84.6201Z"
                fill="#E6E7E8" />
            <path
                d="M121.377 88.5408C120.869 88.5991 119.379 88.133 119.255 88.8155C119.189 89.5603 119.189 90.3095 119.255 91.0544L123.141 97.2133C123.141 97.2133 126.279 97.5879 126.687 97.2133C127.095 96.8388 127.028 93.235 127.028 93.235C127.028 93.235 124.107 87.4089 123.541 87.5171C122.975 87.6253 122.051 88.4576 121.377 88.5408Z"
                fill="#808285" />
            <path
                d="M84.2727 6.00927C84.2727 6.00927 84.5973 11.7605 84.2727 13.0672C83.9481 14.3739 85.2548 13.0672 85.2548 13.0672C85.2548 13.0672 85.13 18.0609 86.6198 18.1025C88.1096 18.1442 92.654 16.1133 92.654 16.1133L92.2794 9.64641C92.2794 9.64641 91.5969 7.65722 92.654 7.28269C93.2452 7.058 93.8844 6.98922 94.51 7.08294C94.51 7.08294 96.0164 4.58604 92.9036 3.9202C92.9036 3.9202 93.9607 1.19027 91.5304 0.591013C90.9239 0.378043 90.2628 0.379184 89.6571 0.594213C89.0514 0.809242 88.5376 1.2252 88.2012 1.77289L86.4617 1.58145C86.4617 1.58145 83.9648 -2.08064 81.7342 1.83115C79.5037 5.74295 84.2727 6.00927 84.2727 6.00927Z"
                fill="#E6E7E8" />
            <path d="M81.3874 38.0293L75.7388 41.0525L79.8367 46.2853L85.6295 39.7851L81.3874 38.0293Z"
                fill="#E6E7E8" />
            <path
                d="M79.8452 38.7531C79.8452 38.7531 83.3825 42.2987 82.8248 44.9121C82.2672 47.5255 89.3584 36.5142 89.3584 36.5142L93.0621 47.9749L112.296 53.6096L110.257 48.4577L111.006 30.7298C113.064 33.5212 114.35 36.8051 114.735 40.2512L120.561 40.0598C120.561 40.0598 123.175 20.4675 110.482 15.6152H98.1308C98.1308 15.6152 97.4733 21.4413 94.5186 21.5578C93.6695 21.5719 92.8365 21.3258 92.1313 20.8527C91.4261 20.3796 90.8825 19.7021 90.5735 18.9111L84.2897 24.3294C84.2897 24.3294 85.1553 34.833 79.8452 38.7531Z"
                fill="white" />
            <path
                d="M87.2856 96.2475C87.2856 96.2475 90.0822 90.5878 96.366 91.2537C96.366 91.2537 96.366 92.3107 98.1055 92.3773C99.845 92.4438 99.5371 91.5034 99.5371 91.5034L100.278 91.6282V96.7884H87.2856V96.2475Z"
                fill="#808285" />
            <path
                d="M90.5151 50.6621L115.026 59.3679L123.349 83.9956V85.3689L118.63 86.351L102.076 50.6621H100.211C100.211 50.6621 100.911 87.8408 100.303 88.8146H94.7099C94.7099 88.8146 93.5946 51.6359 90.5151 50.6621Z"
                fill="#A7A9AC" />
            <path
                d="M94.6679 10.7708C95.5002 7.69126 93.9272 6.3346 93.9272 6.3346H91.8381L91.6883 6.10156L91.0391 15.6064L90.29 20.0842L96.7237 24.7533L98.7795 17.1961L94.6679 10.7708Z"
                fill="#E6E7E8" />
            <path
                d="M84.2729 13.5935C84.2729 13.477 84.2729 13.3189 84.2729 13.1191C84.2064 13.3855 84.2147 13.5269 84.2729 13.5935Z"
                fill="#BCBEC0" />
            <path
                d="M93.3534 4.04595C93.239 4.01106 93.1419 3.93422 93.0817 3.83081C93.0215 3.7274 93.0026 3.60508 93.0288 3.48832C93.2119 2.65603 93.3534 1.03304 91.5307 0.566952C90.9623 0.371198 90.3469 0.358246 89.7707 0.529894C89.1946 0.701542 88.6866 1.04918 88.318 1.52409C88.2695 1.59173 88.2038 1.64516 88.1277 1.67882C88.0516 1.71249 87.9679 1.72516 87.8852 1.71553L86.6451 1.58236C86.5801 1.57594 86.5171 1.5564 86.4599 1.52493C86.4027 1.49345 86.3524 1.4507 86.3122 1.39925C85.7962 0.741735 83.6572 -1.60533 81.7096 1.80709C79.4707 5.72721 84.2731 6.01018 84.2731 6.01018C84.7944 6.11436 85.3334 6.08753 85.8418 5.9321C86.3502 5.77667 86.8121 5.4975 87.1861 5.11962C87.235 5.07581 87.2924 5.04246 87.3546 5.02157C87.4169 5.00069 87.4828 4.99273 87.5482 4.99818C87.6137 5.00364 87.6773 5.02238 87.7353 5.05327C87.7932 5.08417 87.8442 5.12658 87.8852 5.17788C88.2557 5.51456 88.7205 5.72952 89.2169 5.79378C89.3301 5.81783 89.4293 5.88541 89.4932 5.98194C89.557 6.07847 89.5803 6.19621 89.5582 6.3098C89.5616 6.54806 89.6161 6.78282 89.718 6.9982C89.82 7.21359 89.967 7.40457 90.1491 7.55824C90.1943 7.60277 90.2301 7.65591 90.2544 7.71453C90.2787 7.77314 90.291 7.83604 90.2906 7.89949V11.8862C90.292 12.0022 90.2515 12.1149 90.1766 12.2036C90.1017 12.2922 89.9974 12.3509 89.8828 12.3689L85.2552 13.0681C85.2552 13.0681 85.1303 18.0618 86.6201 18.1035C87.8769 18.1617 91.2976 16.7135 92.3463 16.2558C92.4365 16.2145 92.5124 16.1474 92.5642 16.0629C92.6161 15.9784 92.6417 15.8804 92.6377 15.7813L92.2881 9.70558V9.58905C92.1882 9.26445 91.7305 7.61651 92.6793 7.2836C93.2182 7.11304 93.793 7.09006 94.3439 7.21702C94.4051 7.23179 94.4686 7.23421 94.5308 7.22416C94.593 7.21411 94.6526 7.19177 94.706 7.15845C94.7595 7.12514 94.8058 7.08152 94.8422 7.03013C94.8786 6.97874 94.9044 6.92059 94.9181 6.85912C95.0129 6.57187 95.047 6.26811 95.0185 5.967C94.9899 5.66589 94.8993 5.37398 94.7522 5.10966C94.6052 4.84534 94.405 4.61436 94.1643 4.43129C93.9235 4.24821 93.6474 4.11699 93.3534 4.04595Z"
                fill="#BCBEC0" />
            <path
                d="M106.029 54.1175L108.826 54.6752C110.544 53.9975 112.415 53.8046 114.236 54.1175C116.791 54.7417 115.792 52.378 115.792 52.378C115.792 52.378 118.905 47.9585 119.271 46.0359C119.637 44.1133 120.395 40.0684 120.395 40.0684L114.86 40.2265L113.928 51.8204H108.102L106.029 54.1175Z"
                fill="#E6E7E8" />
            <path
                d="M42.8911 31.8027L52.9296 32.6499H53.0059L127.74 59.4024C127.79 59.4175 127.834 59.447 127.867 59.4872C128.299 59.9954 131.129 63.6042 125.783 64.3328C125.736 64.3458 125.686 64.3458 125.639 64.3328L50.9473 38.0715H50.8711L42.6962 32.2941C42.66 32.253 42.6359 32.2028 42.6265 32.1489C42.6171 32.095 42.6228 32.0395 42.643 31.9886C42.6631 31.9378 42.697 31.8935 42.7408 31.8607C42.7846 31.8279 42.8366 31.8078 42.8911 31.8027Z"
                fill="#808285" />
            <path
                d="M50.582 37.9109L42.7291 32.3621C42.6754 32.3231 42.6359 32.2675 42.6166 32.2039C42.5974 32.1403 42.5994 32.0722 42.6224 32.0099C42.6454 31.9476 42.6881 31.8945 42.7441 31.8587C42.8 31.8229 42.8661 31.8063 42.9324 31.8115L52.5643 32.6586C52.611 32.6624 52.6561 32.6769 52.6963 32.7009C52.7365 32.7249 52.7705 32.7579 52.7959 32.7972C52.8213 32.8365 52.8373 32.8811 52.8427 32.9276C52.8481 32.9741 52.8427 33.0212 52.8269 33.0653L51.0479 37.7584C51.0315 37.8025 51.0053 37.8424 50.9714 37.875C50.9374 37.9077 50.8965 37.9322 50.8517 37.9469C50.807 37.9615 50.7595 37.9659 50.7128 37.9597C50.6661 37.9534 50.6214 37.9368 50.582 37.9109Z"
                fill="#BCBEC0" />
        </g>
    </svg>
</div>
<p>You can edit your description before the status changes to “READ”.</p>`;
  } else if (requestDetail[i].requestStatus === "READ") {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressRead"></div>`;
    document.querySelector(
      ".tipsInfoSection"
    ).innerHTML = `<div class="illustration">
    <svg width="106" height="99" viewBox="0 0 106 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7">
<path d="M59.034 30.7489C59.038 30.7197 59.038 30.6902 59.034 30.661C58.9462 30.19 58.108 25.8711 57.3496 25.7593C56.9424 25.6795 56.8386 26.2223 56.8386 26.7572C56.8352 26.8334 56.8095 26.9068 56.7648 26.9686C56.7201 27.0304 56.6584 27.0778 56.5871 27.1049C56.5159 27.132 56.4383 27.1378 56.3638 27.1214C56.2894 27.105 56.2213 27.0672 56.168 27.0127L54.3558 25.2005C54.2825 25.1343 54.1872 25.0977 54.0884 25.0977C53.9896 25.0977 53.8943 25.1343 53.821 25.2005C53.4269 25.5816 53.1393 26.0591 52.9867 26.5856C52.834 27.1122 52.8217 27.6694 52.9508 28.2022C53.2861 30.693 56.0243 32.8485 56.6949 32.6569C57.3095 32.5331 57.9365 32.4822 58.563 32.5052C58.6595 32.5077 58.7533 32.4738 58.8258 32.4101C58.8983 32.3465 58.9442 32.2579 58.9542 32.1619L59.034 30.7489Z" fill="#E6E7E8"/>
<path d="M93.6099 30.4286C93.6059 30.4021 93.6059 30.3752 93.6099 30.3487C93.6977 29.8777 94.536 25.5588 95.2944 25.447C95.7095 25.3672 95.8053 25.9021 95.8133 26.4449C95.8161 26.5205 95.8413 26.5935 95.8856 26.6548C95.9298 26.7161 95.9913 26.763 96.0621 26.7894C96.133 26.8159 96.21 26.8208 96.2837 26.8035C96.3573 26.7863 96.4242 26.7476 96.4759 26.6924L98.2881 24.8802C98.3614 24.814 98.4567 24.7773 98.5555 24.7773C98.6543 24.7773 98.7496 24.814 98.823 24.8802C99.2184 25.2605 99.5075 25.7376 99.6616 26.2642C99.8156 26.7907 99.8293 27.3484 99.7011 27.8819C99.3578 30.3647 96.6196 32.5282 95.949 32.3286C95.3341 32.2075 94.7071 32.1593 94.0809 32.1849C93.9853 32.1873 93.8924 32.1531 93.8212 32.0893C93.75 32.0255 93.7058 31.9369 93.6977 31.8416L93.6099 30.4286Z" fill="#E6E7E8"/>
<path d="M70.0914 94.9707L70.4825 89.4941L74.0989 89.7416L73.8595 96.0724L69.5645 96.7829L70.0914 94.9707Z" fill="#E6E7E8"/>
<path d="M85.499 94.8791L85.1558 89.9375L88.4369 90.2329L88.7243 95.6136L85.499 94.8791Z" fill="#E6E7E8"/>
<path d="M79.1356 62.2025C81.5732 72.1018 83.2413 82.1748 84.1252 92.3314C84.1252 92.3314 88.3323 93.2175 89.7135 92.3314C89.7135 92.3314 89.6177 75.7981 88.6357 68.7568C88.6357 68.7568 85.9933 50.7545 86.1928 44.9826C86.3924 39.2107 71.6154 45.6692 71.6154 45.6692C71.6154 45.6692 70.3381 83.7254 69.8511 92.044C69.8511 92.044 74.1541 91.549 75.136 92.2356C75.128 92.2356 79.0398 65.6274 79.1356 62.2025Z" fill="#A7A9AC"/>
<path d="M70.1868 93.8457C70.1868 93.8457 64.6624 95.5142 64.2153 96.7835C63.7682 98.0529 64.2153 98.3004 64.2153 98.3004H74.881C74.881 98.3004 75.3759 95.8575 74.881 95.8575C74.7275 95.8539 74.5767 95.817 74.4389 95.7495C74.3011 95.6819 74.1795 95.5854 74.0826 95.4663C74.0826 95.4663 70.562 96.2008 70.4183 95.61C70.3051 95.0272 70.2278 94.438 70.1868 93.8457Z" fill="#808285"/>
<path d="M83.5112 98.6927H89.7062C89.7062 98.6927 89.5785 95.204 88.405 93.8469C87.2314 92.4897 85.4033 94.0624 85.4033 94.0624C85.4033 94.0624 83.9024 95.3318 83.5112 98.6927Z" fill="#808285"/>
<path d="M72.3807 12.7785C73.0273 11.8125 74.5511 6.8334 74.5511 6.8334C74.5511 6.8334 75.3952 5.98936 76.4202 5.62756C77.4451 5.26576 81.2434 5.38632 82.811 7.2554C84.3786 9.12449 82.4973 11.3574 82.4973 11.3574C82.0194 11.0994 81.4836 10.9675 80.9405 10.9742C79.9426 10.9663 79.9426 12.7785 79.9426 12.7785L79.7362 18.1272C79.7362 18.1272 75.4791 18.9042 74.2497 18.4092C73.0203 17.9143 73.2446 13.763 73.2446 13.763C73.2446 13.763 71.734 13.7444 72.3807 12.7785Z" fill="#E6E7E8"/>
<path d="M81.5468 14.3906C83.1435 12.1393 82.2494 10.5826 82.2494 10.5826L80.5569 9.96783L80.501 9.73633L77.1959 17.2486L75.272 20.6574L79.1199 26.3256L82.9998 20.8091L81.5468 14.3906Z" fill="#E6E7E8"/>
<path d="M72.2947 13.623C72.2947 13.5194 72.3664 13.3918 72.4222 13.2324C72.2947 13.4157 72.2628 13.5512 72.2947 13.623Z" fill="#BCBEC0"/>
<path d="M98.7512 30.0851C98.7512 30.0851 94.0411 34.3561 94.0411 29.9014C94.0411 27.1791 92.5242 31.2826 91.231 34.7553C90.7999 29.8136 89.8658 20.9442 89.8658 20.9442C87.6397 19.3264 84.9153 18.5436 82.1699 18.7328C80.9599 19.5532 79.5284 19.9848 78.0665 19.9702C75.8472 19.8425 76.0388 19.3156 76.0388 19.3156C76.0388 19.3156 72.1908 19.7707 71.3446 20.4892C70.4984 21.2076 66.9139 26.756 66.5546 34.3801C66.5546 34.3801 60.0323 31.1868 58.5714 29.8855C58.5714 29.8855 56.0247 29.3586 56.2882 32.5599L64.966 40.9024C64.966 40.9024 67.832 42.9302 69.269 40.3196C70.0325 39.0323 70.623 37.6499 71.0253 36.2082L70.8337 47.1054L71.2887 46.9058C72.7257 46.6424 78.2023 46.6424 80.1582 47.5604C82.1141 48.4785 86.0338 47.9516 86.5448 47.5604C87.0557 47.1693 86.5448 42.0759 86.5448 42.0759C86.5448 42.0759 89.7381 43.2016 90.0734 43.002C90.257 42.9541 98.7512 33.5658 98.7512 30.0851Z" fill="white"/>
<path d="M92.4469 32.9217L91.9089 31.5538C93.1641 33.6983 95.5435 32.974 96.9345 32.143C97.2407 31.9601 97.3807 31.6031 97.2085 31.2908C96.9885 30.8917 96.5674 30.3317 95.8243 29.6866C94.6259 28.6464 94.2277 27.2382 94.1784 26.6642L94.0128 24.8123C94.0028 24.7011 94.0157 24.5892 94.0183 24.4776C94.0277 24.062 93.7853 23.2936 92.7293 22.566C91.6023 21.7896 91.5046 20.9087 91.6111 20.482C91.6274 20.4167 91.6469 20.3523 91.6581 20.2859L91.8216 19.3196C91.8503 19.1499 91.8351 18.9765 91.7766 18.8146C90.9342 16.4819 89.1652 11.64 88.1551 9.07825C87.1079 6.42259 84.9248 4.21742 83.9641 3.4468C83.5878 3.17783 82.2871 2.63435 80.0944 2.61221C78.5162 2.59627 76.7665 4.11974 75.5415 5.52568C75.1902 5.92891 75.6153 6.44896 76.1005 6.22413C76.6746 5.95815 77.3523 6.25182 77.5507 6.85258L79.6753 13.2845C78.9518 19.7959 78.9045 25.1924 81.421 28.9132C82.7041 30.8105 82.6048 33.0011 82.1189 34.7229C81.8714 35.5999 82.6971 36.6448 83.5783 36.4127L91.771 34.2547C92.3498 34.1022 92.6659 33.4788 92.4469 32.9217Z" fill="#BCBEC0"/>
<path d="M3.91534 78.6177L1.51592 22.9791C1.51592 22.9791 1.36954 21.1016 3.57802 21.1016C5.78651 21.1016 42.3125 21.3752 42.3125 21.3752L49.4152 29.3691L47.1367 78.6177H3.91534Z" fill="#A7A9AC"/>
<path d="M42.0136 31.1641H21.6599C21.3119 31.1641 21.0298 31.4462 21.0298 31.7942V32.176C21.0298 32.524 21.3119 32.8061 21.6599 32.8061H42.0136C42.3616 32.8061 42.6437 32.524 42.6437 32.176V31.7942C42.6437 31.4462 42.3616 31.1641 42.0136 31.1641Z" fill="#F1F2F2"/>
<path d="M42.0136 35.0781H21.6599C21.3119 35.0781 21.0298 35.3602 21.0298 35.7082V36.0901C21.0298 36.4381 21.3119 36.7202 21.6599 36.7202H42.0136C42.3616 36.7202 42.6437 36.4381 42.6437 36.0901V35.7082C42.6437 35.3602 42.3616 35.0781 42.0136 35.0781Z" fill="#F1F2F2"/>
<path d="M41.3897 40.7109H9.19796C8.84997 40.7109 8.56787 40.9931 8.56787 41.341V41.7229C8.56787 42.0709 8.84997 42.353 9.19796 42.353H41.3897C41.7376 42.353 42.0198 42.0709 42.0198 41.7229V41.341C42.0198 40.9931 41.7376 40.7109 41.3897 40.7109Z" fill="#F1F2F2"/>
<path d="M41.3897 49.8633H9.19796C8.84997 49.8633 8.56787 50.1454 8.56787 50.4934V50.8752C8.56787 51.2232 8.84997 51.5053 9.19796 51.5053H41.3897C41.7376 51.5053 42.0198 51.2232 42.0198 50.8752V50.4934C42.0198 50.1454 41.7376 49.8633 41.3897 49.8633Z" fill="#F1F2F2"/>
<path d="M41.3897 54.1719H9.19796C8.84997 54.1719 8.56787 54.454 8.56787 54.802V55.1838C8.56787 55.5318 8.84997 55.8139 9.19796 55.8139H41.3897C41.7376 55.8139 42.0198 55.5318 42.0198 55.1838V54.802C42.0198 54.454 41.7376 54.1719 41.3897 54.1719Z" fill="#F1F2F2"/>
<path d="M41.3897 59.4668H9.19796C8.84997 59.4668 8.56787 59.7489 8.56787 60.0969V60.4787C8.56787 60.8267 8.84997 61.1088 9.19796 61.1088H41.3897C41.7376 61.1088 42.0198 60.8267 42.0198 60.4787V60.0969C42.0198 59.7489 41.7376 59.4668 41.3897 59.4668Z" fill="#F1F2F2"/>
<path d="M41.3897 68.8047H9.19796C8.84997 68.8047 8.56787 69.0868 8.56787 69.4348V69.8166C8.56787 70.1646 8.84997 70.4467 9.19796 70.4467H41.3897C41.7376 70.4467 42.0198 70.1646 42.0198 69.8166V69.4348C42.0198 69.0868 41.7376 68.8047 41.3897 68.8047Z" fill="#F1F2F2"/>
<path d="M33.7522 63.4453H9.19796C8.84997 63.4453 8.56787 63.7274 8.56787 64.0754V64.4572C8.56787 64.8052 8.84997 65.0873 9.19796 65.0873H33.7522C34.1002 65.0873 34.3823 64.8052 34.3823 64.4572V64.0754C34.3823 63.7274 34.1002 63.4453 33.7522 63.4453Z" fill="#F1F2F2"/>
<path d="M33.7522 73.5391H9.19796C8.84997 73.5391 8.56787 73.8212 8.56787 74.1691V74.551C8.56787 74.899 8.84997 75.1811 9.19796 75.1811H33.7522C34.1002 75.1811 34.3823 74.899 34.3823 74.551V74.1691C34.3823 73.8212 34.1002 73.5391 33.7522 73.5391Z" fill="#F1F2F2"/>
<path d="M33.7522 44.625H9.19796C8.84997 44.625 8.56787 44.9071 8.56787 45.2551V45.637C8.56787 45.985 8.84997 46.2671 9.19796 46.2671H33.7522C34.1002 46.2671 34.3823 45.985 34.3823 45.637V45.2551C34.3823 44.9071 34.1002 44.625 33.7522 44.625Z" fill="#F1F2F2"/>
<path d="M11.1835 36.969C11.1835 36.969 11.1326 36.9245 11.088 36.829L10.9607 36.5299L7.54299 27.9378C7.43052 27.6865 7.27306 27.4578 7.07838 27.2631C6.88625 27.0831 6.65214 26.954 6.39738 26.8876C6.26311 26.8501 6.13302 26.7989 6.00914 26.7349C5.97221 26.7174 5.94047 26.6906 5.91704 26.6571C5.89361 26.6236 5.87929 26.5847 5.87549 26.544C5.87549 26.4803 5.92004 26.4358 6.00278 26.4039C6.11075 26.3757 6.22217 26.3628 6.33373 26.3658C6.57559 26.3658 6.81107 26.3658 7.02747 26.3658C7.24386 26.3658 7.47935 26.3658 7.74666 26.3658C8.01397 26.3658 8.31946 26.3658 8.58677 26.3658H9.22322C9.33689 26.3628 9.45041 26.3757 9.56054 26.4039C9.64328 26.4039 9.68783 26.474 9.68783 26.5376C9.68579 26.5763 9.67272 26.6137 9.65017 26.6453C9.62762 26.6768 9.59653 26.7013 9.56054 26.7158C9.43222 26.7711 9.3004 26.8179 9.16594 26.8558C9.11022 26.8643 9.05759 26.8869 9.01303 26.9214C8.96848 26.9559 8.93348 27.0013 8.91136 27.0531C8.86764 27.1557 8.84595 27.2663 8.84771 27.3777C8.85652 27.6097 8.89941 27.8392 8.97501 28.0587L9.61145 29.7389C9.81512 30.2481 10.0124 30.7382 10.2097 31.2091C10.407 31.6801 10.6107 32.1575 10.8462 32.6475C11.0817 33.1376 11.3044 33.6849 11.5654 34.2896C11.6163 34.4041 11.6608 34.4614 11.699 34.4487C11.7372 34.4359 11.769 34.3914 11.8008 34.3087L13.0737 31.2473C13.0737 31.1646 13.1247 31.0882 13.1438 31.0309C13.1821 30.9174 13.1821 30.7944 13.1438 30.6809L13.0483 30.42L12.1318 28.1924C11.9971 27.8577 11.7778 27.5639 11.4954 27.3395C11.2389 27.1378 10.9477 26.9847 10.6361 26.8876C10.5019 26.8501 10.3718 26.7989 10.2479 26.7349C10.211 26.7174 10.1792 26.6906 10.1558 26.6571C10.1324 26.6236 10.1181 26.5847 10.1143 26.544C10.1143 26.4803 10.1588 26.4358 10.2415 26.4039C10.3495 26.3757 10.4609 26.3628 10.5725 26.3658C10.7443 26.3658 10.9035 26.3658 11.0562 26.3658C11.2089 26.3658 11.3681 26.3658 11.5335 26.3658H12.0618C12.3036 26.3658 12.5328 26.3658 12.7364 26.3658H13.2838C13.3954 26.3624 13.5069 26.3752 13.6147 26.4039C13.7038 26.4039 13.742 26.474 13.742 26.5376C13.7386 26.5842 13.7218 26.6289 13.6936 26.6662C13.6653 26.7035 13.6269 26.7317 13.5829 26.7476L13.2583 26.9195C13.2067 26.9469 13.1637 26.9883 13.1345 27.0389C13.1052 27.0896 13.0908 27.1474 13.0928 27.2059C13.0928 27.2059 13.0928 27.2441 13.0928 27.2695C13.0913 27.2907 13.0913 27.312 13.0928 27.3332C13.0928 27.3713 13.1565 27.4796 13.2138 27.6387C13.271 27.7978 13.3411 27.9887 13.4174 28.186L13.6466 28.7525L13.8057 29.1216C13.863 29.2489 13.9075 29.3125 13.9393 29.3189C13.9711 29.3252 14.0284 29.2616 14.0921 29.1216C14.1557 28.9816 14.2639 28.7143 14.353 28.4851C14.4421 28.256 14.5249 28.0142 14.5949 27.7978L14.7285 27.3459C14.7324 27.3078 14.7324 27.2694 14.7285 27.2313C14.7324 27.1755 14.7215 27.1196 14.697 27.0693C14.6724 27.019 14.635 26.9761 14.5885 26.9449L14.2957 26.7667C14.2529 26.7481 14.2159 26.7181 14.189 26.6799C14.1621 26.6418 14.1461 26.5969 14.143 26.5503C14.143 26.4867 14.1875 26.4421 14.2703 26.4167C14.3782 26.3884 14.4897 26.3755 14.6012 26.3785H15.0786C15.1951 26.3867 15.3121 26.3867 15.4286 26.3785C15.5813 26.3863 15.7342 26.3863 15.8869 26.3785C16.0458 26.3672 16.2053 26.3672 16.3642 26.3785C16.4758 26.3755 16.5872 26.3884 16.6952 26.4167C16.7779 26.4485 16.8224 26.493 16.8224 26.5567C16.8197 26.5952 16.8063 26.6322 16.7839 26.6637C16.7614 26.6951 16.7307 26.7198 16.6952 26.7349C16.5715 26.7999 16.4383 26.845 16.3006 26.8685C16.0519 26.9073 15.815 27.0007 15.6068 27.1422C15.4542 27.2857 15.3234 27.4509 15.2186 27.6323C15.1677 27.7256 15.0913 27.8848 14.9895 28.1096C14.8876 28.3324 14.7858 28.5742 14.6712 28.8352C14.5567 29.0961 14.4676 29.3507 14.3785 29.5798C14.3409 29.683 14.3132 29.7896 14.2957 29.8981C14.274 29.9923 14.274 30.0902 14.2957 30.1845L15.9314 34.385C15.9314 34.4359 15.976 34.455 16.0078 34.4296C16.0527 34.3933 16.0859 34.3446 16.1033 34.2896C16.3706 33.5895 16.6697 32.6984 17.0007 31.6101C17.3316 30.5218 17.6817 29.3698 18.0381 28.1542C18.0711 28.0592 18.0946 27.9611 18.1081 27.8614C18.1167 27.7704 18.1167 27.6788 18.1081 27.5877C18.1115 27.4372 18.0765 27.2882 18.0062 27.155C17.9658 27.0879 17.9113 27.0304 17.8465 26.9864C17.7816 26.9424 17.708 26.9131 17.6307 26.9004C17.5289 26.9004 17.4143 26.8304 17.2934 26.7795C17.1725 26.7285 17.1089 26.6585 17.1089 26.5885C17.1089 26.5185 17.1534 26.4803 17.2361 26.4485C17.3441 26.4202 17.4555 26.4074 17.5671 26.4103H18.1463H18.7127C18.9737 26.4103 19.2282 26.4103 19.4701 26.4103C19.7119 26.4103 19.9347 26.4103 20.1384 26.4103C20.2499 26.4069 20.3614 26.4198 20.4693 26.4485C20.5584 26.4803 20.5966 26.5249 20.5966 26.5885C20.5954 26.6275 20.5826 26.6652 20.56 26.6969C20.5373 26.7286 20.5058 26.7529 20.4693 26.7667C20.3456 26.8317 20.2124 26.8768 20.0747 26.9004C19.8367 26.9515 19.6168 27.0659 19.4383 27.2313C19.2717 27.3854 19.1319 27.5661 19.0246 27.7659C18.9291 27.9632 18.8464 28.1414 18.7827 28.3006L15.976 36.5744C15.9499 36.6489 15.9179 36.7213 15.8805 36.7908C15.8296 36.8926 15.7723 36.9372 15.7214 36.9372C15.6932 36.9326 15.6663 36.9224 15.6422 36.9071C15.6181 36.8918 15.5974 36.8717 15.5814 36.8481C15.5271 36.786 15.484 36.7149 15.4541 36.6381C15.1804 36.0016 14.9386 35.4352 14.7413 34.9324C14.544 34.4296 14.3467 33.9268 14.1621 33.424C13.9775 32.9212 13.7548 32.3548 13.5256 31.7438C13.5256 31.6674 13.4684 31.6356 13.4493 31.6547C13.4069 31.7102 13.3746 31.7726 13.3538 31.8392C13.0992 32.4375 12.8828 32.9721 12.7173 33.4367C12.5519 33.9013 12.3482 34.3723 12.17 34.856C11.9918 35.3397 11.7881 35.8871 11.5654 36.5108C11.5201 36.6226 11.4669 36.7311 11.4062 36.8354C11.3108 36.9181 11.2471 36.969 11.1835 36.969Z" fill="#F1F2F2"/>
<path d="M42.3125 21.4082L41.7651 27.4227C41.8094 27.8825 42.019 28.3106 42.3548 28.6278C42.6907 28.9449 43.1302 29.1296 43.5917 29.1475C45.2529 29.2302 49.4153 29.402 49.4153 29.402L42.3125 21.4082Z" fill="#939598"/>
<path d="M3.18649 56.3926C1.46578 57.0936 0.398311 58.8356 0 59.6587L3.18649 62.1283V56.3926Z" fill="#7E7E7E"/>
<path d="M47.877 56.4707C49.5977 57.1717 50.6652 58.9137 51.0635 59.7369L47.877 62.2064V56.4707Z" fill="#7E7E7E"/>
<path d="M0 98.6115V59.7363L20.5528 75.2705H30.2716L51.0635 59.7363V98.6115H0Z" fill="#C4C4C4"/>
<path d="M2.46953 92.8768L20.6325 75.2715H30.0326C35.37 80.3433 46.5546 90.9649 48.5939 92.8768C50.6333 94.7887 51.0369 97.5503 50.9838 98.6922H0C0.254919 94.9321 1.75257 93.2486 2.46953 92.8768Z" fill="#A8A8A8"/>
</g>
</svg>
</div>
<p>Need to change your request?</p>
<p>Please cancel this request and submit a new one.</p>`;
  } else if (requestDetail[i].requestStatus === "COMPLETED") {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressCompleted"></div>`;
    document.querySelector(
      ".tipsInfoSection"
    ).innerHTML = `<div class="illustration">
    <svg width="106" height="99" viewBox="0 0 106 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7">
<path d="M59.034 30.7489C59.038 30.7197 59.038 30.6902 59.034 30.661C58.9462 30.19 58.108 25.8711 57.3496 25.7593C56.9424 25.6795 56.8386 26.2223 56.8386 26.7572C56.8352 26.8334 56.8095 26.9068 56.7648 26.9686C56.7201 27.0304 56.6584 27.0778 56.5871 27.1049C56.5159 27.132 56.4383 27.1378 56.3638 27.1214C56.2894 27.105 56.2213 27.0672 56.168 27.0127L54.3558 25.2005C54.2825 25.1343 54.1872 25.0977 54.0884 25.0977C53.9896 25.0977 53.8943 25.1343 53.821 25.2005C53.4269 25.5816 53.1393 26.0591 52.9867 26.5856C52.834 27.1122 52.8217 27.6694 52.9508 28.2022C53.2861 30.693 56.0243 32.8485 56.6949 32.6569C57.3095 32.5331 57.9365 32.4822 58.563 32.5052C58.6595 32.5077 58.7533 32.4738 58.8258 32.4101C58.8983 32.3465 58.9442 32.2579 58.9542 32.1619L59.034 30.7489Z" fill="#E6E7E8"/>
<path d="M93.6099 30.4286C93.6059 30.4021 93.6059 30.3752 93.6099 30.3487C93.6977 29.8777 94.536 25.5588 95.2944 25.447C95.7095 25.3672 95.8053 25.9021 95.8133 26.4449C95.8161 26.5205 95.8413 26.5935 95.8856 26.6548C95.9298 26.7161 95.9913 26.763 96.0621 26.7894C96.133 26.8159 96.21 26.8208 96.2837 26.8035C96.3573 26.7863 96.4242 26.7476 96.4759 26.6924L98.2881 24.8802C98.3614 24.814 98.4567 24.7773 98.5555 24.7773C98.6543 24.7773 98.7496 24.814 98.823 24.8802C99.2184 25.2605 99.5075 25.7376 99.6616 26.2642C99.8156 26.7907 99.8293 27.3484 99.7011 27.8819C99.3578 30.3647 96.6196 32.5282 95.949 32.3286C95.3341 32.2075 94.7071 32.1593 94.0809 32.1849C93.9853 32.1873 93.8924 32.1531 93.8212 32.0893C93.75 32.0255 93.7058 31.9369 93.6977 31.8416L93.6099 30.4286Z" fill="#E6E7E8"/>
<path d="M70.0914 94.9707L70.4825 89.4941L74.0989 89.7416L73.8595 96.0724L69.5645 96.7829L70.0914 94.9707Z" fill="#E6E7E8"/>
<path d="M85.499 94.8791L85.1558 89.9375L88.4369 90.2329L88.7243 95.6136L85.499 94.8791Z" fill="#E6E7E8"/>
<path d="M79.1356 62.2025C81.5732 72.1018 83.2413 82.1748 84.1252 92.3314C84.1252 92.3314 88.3323 93.2175 89.7135 92.3314C89.7135 92.3314 89.6177 75.7981 88.6357 68.7568C88.6357 68.7568 85.9933 50.7545 86.1928 44.9826C86.3924 39.2107 71.6154 45.6692 71.6154 45.6692C71.6154 45.6692 70.3381 83.7254 69.8511 92.044C69.8511 92.044 74.1541 91.549 75.136 92.2356C75.128 92.2356 79.0398 65.6274 79.1356 62.2025Z" fill="#A7A9AC"/>
<path d="M70.1868 93.8457C70.1868 93.8457 64.6624 95.5142 64.2153 96.7835C63.7682 98.0529 64.2153 98.3004 64.2153 98.3004H74.881C74.881 98.3004 75.3759 95.8575 74.881 95.8575C74.7275 95.8539 74.5767 95.817 74.4389 95.7495C74.3011 95.6819 74.1795 95.5854 74.0826 95.4663C74.0826 95.4663 70.562 96.2008 70.4183 95.61C70.3051 95.0272 70.2278 94.438 70.1868 93.8457Z" fill="#808285"/>
<path d="M83.5112 98.6927H89.7062C89.7062 98.6927 89.5785 95.204 88.405 93.8469C87.2314 92.4897 85.4033 94.0624 85.4033 94.0624C85.4033 94.0624 83.9024 95.3318 83.5112 98.6927Z" fill="#808285"/>
<path d="M72.3807 12.7785C73.0273 11.8125 74.5511 6.8334 74.5511 6.8334C74.5511 6.8334 75.3952 5.98936 76.4202 5.62756C77.4451 5.26576 81.2434 5.38632 82.811 7.2554C84.3786 9.12449 82.4973 11.3574 82.4973 11.3574C82.0194 11.0994 81.4836 10.9675 80.9405 10.9742C79.9426 10.9663 79.9426 12.7785 79.9426 12.7785L79.7362 18.1272C79.7362 18.1272 75.4791 18.9042 74.2497 18.4092C73.0203 17.9143 73.2446 13.763 73.2446 13.763C73.2446 13.763 71.734 13.7444 72.3807 12.7785Z" fill="#E6E7E8"/>
<path d="M81.5468 14.3906C83.1435 12.1393 82.2494 10.5826 82.2494 10.5826L80.5569 9.96783L80.501 9.73633L77.1959 17.2486L75.272 20.6574L79.1199 26.3256L82.9998 20.8091L81.5468 14.3906Z" fill="#E6E7E8"/>
<path d="M72.2947 13.623C72.2947 13.5194 72.3664 13.3918 72.4222 13.2324C72.2947 13.4157 72.2628 13.5512 72.2947 13.623Z" fill="#BCBEC0"/>
<path d="M98.7512 30.0851C98.7512 30.0851 94.0411 34.3561 94.0411 29.9014C94.0411 27.1791 92.5242 31.2826 91.231 34.7553C90.7999 29.8136 89.8658 20.9442 89.8658 20.9442C87.6397 19.3264 84.9153 18.5436 82.1699 18.7328C80.9599 19.5532 79.5284 19.9848 78.0665 19.9702C75.8472 19.8425 76.0388 19.3156 76.0388 19.3156C76.0388 19.3156 72.1908 19.7707 71.3446 20.4892C70.4984 21.2076 66.9139 26.756 66.5546 34.3801C66.5546 34.3801 60.0323 31.1868 58.5714 29.8855C58.5714 29.8855 56.0247 29.3586 56.2882 32.5599L64.966 40.9024C64.966 40.9024 67.832 42.9302 69.269 40.3196C70.0325 39.0323 70.623 37.6499 71.0253 36.2082L70.8337 47.1054L71.2887 46.9058C72.7257 46.6424 78.2023 46.6424 80.1582 47.5604C82.1141 48.4785 86.0338 47.9516 86.5448 47.5604C87.0557 47.1693 86.5448 42.0759 86.5448 42.0759C86.5448 42.0759 89.7381 43.2016 90.0734 43.002C90.257 42.9541 98.7512 33.5658 98.7512 30.0851Z" fill="white"/>
<path d="M92.4469 32.9217L91.9089 31.5538C93.1641 33.6983 95.5435 32.974 96.9345 32.143C97.2407 31.9601 97.3807 31.6031 97.2085 31.2908C96.9885 30.8917 96.5674 30.3317 95.8243 29.6866C94.6259 28.6464 94.2277 27.2382 94.1784 26.6642L94.0128 24.8123C94.0028 24.7011 94.0157 24.5892 94.0183 24.4776C94.0277 24.062 93.7853 23.2936 92.7293 22.566C91.6023 21.7896 91.5046 20.9087 91.6111 20.482C91.6274 20.4167 91.6469 20.3523 91.6581 20.2859L91.8216 19.3196C91.8503 19.1499 91.8351 18.9765 91.7766 18.8146C90.9342 16.4819 89.1652 11.64 88.1551 9.07825C87.1079 6.42259 84.9248 4.21742 83.9641 3.4468C83.5878 3.17783 82.2871 2.63435 80.0944 2.61221C78.5162 2.59627 76.7665 4.11974 75.5415 5.52568C75.1902 5.92891 75.6153 6.44896 76.1005 6.22413C76.6746 5.95815 77.3523 6.25182 77.5507 6.85258L79.6753 13.2845C78.9518 19.7959 78.9045 25.1924 81.421 28.9132C82.7041 30.8105 82.6048 33.0011 82.1189 34.7229C81.8714 35.5999 82.6971 36.6448 83.5783 36.4127L91.771 34.2547C92.3498 34.1022 92.6659 33.4788 92.4469 32.9217Z" fill="#BCBEC0"/>
<path d="M3.91534 78.6177L1.51592 22.9791C1.51592 22.9791 1.36954 21.1016 3.57802 21.1016C5.78651 21.1016 42.3125 21.3752 42.3125 21.3752L49.4152 29.3691L47.1367 78.6177H3.91534Z" fill="#A7A9AC"/>
<path d="M42.0136 31.1641H21.6599C21.3119 31.1641 21.0298 31.4462 21.0298 31.7942V32.176C21.0298 32.524 21.3119 32.8061 21.6599 32.8061H42.0136C42.3616 32.8061 42.6437 32.524 42.6437 32.176V31.7942C42.6437 31.4462 42.3616 31.1641 42.0136 31.1641Z" fill="#F1F2F2"/>
<path d="M42.0136 35.0781H21.6599C21.3119 35.0781 21.0298 35.3602 21.0298 35.7082V36.0901C21.0298 36.4381 21.3119 36.7202 21.6599 36.7202H42.0136C42.3616 36.7202 42.6437 36.4381 42.6437 36.0901V35.7082C42.6437 35.3602 42.3616 35.0781 42.0136 35.0781Z" fill="#F1F2F2"/>
<path d="M41.3897 40.7109H9.19796C8.84997 40.7109 8.56787 40.9931 8.56787 41.341V41.7229C8.56787 42.0709 8.84997 42.353 9.19796 42.353H41.3897C41.7376 42.353 42.0198 42.0709 42.0198 41.7229V41.341C42.0198 40.9931 41.7376 40.7109 41.3897 40.7109Z" fill="#F1F2F2"/>
<path d="M41.3897 49.8633H9.19796C8.84997 49.8633 8.56787 50.1454 8.56787 50.4934V50.8752C8.56787 51.2232 8.84997 51.5053 9.19796 51.5053H41.3897C41.7376 51.5053 42.0198 51.2232 42.0198 50.8752V50.4934C42.0198 50.1454 41.7376 49.8633 41.3897 49.8633Z" fill="#F1F2F2"/>
<path d="M41.3897 54.1719H9.19796C8.84997 54.1719 8.56787 54.454 8.56787 54.802V55.1838C8.56787 55.5318 8.84997 55.8139 9.19796 55.8139H41.3897C41.7376 55.8139 42.0198 55.5318 42.0198 55.1838V54.802C42.0198 54.454 41.7376 54.1719 41.3897 54.1719Z" fill="#F1F2F2"/>
<path d="M41.3897 59.4668H9.19796C8.84997 59.4668 8.56787 59.7489 8.56787 60.0969V60.4787C8.56787 60.8267 8.84997 61.1088 9.19796 61.1088H41.3897C41.7376 61.1088 42.0198 60.8267 42.0198 60.4787V60.0969C42.0198 59.7489 41.7376 59.4668 41.3897 59.4668Z" fill="#F1F2F2"/>
<path d="M41.3897 68.8047H9.19796C8.84997 68.8047 8.56787 69.0868 8.56787 69.4348V69.8166C8.56787 70.1646 8.84997 70.4467 9.19796 70.4467H41.3897C41.7376 70.4467 42.0198 70.1646 42.0198 69.8166V69.4348C42.0198 69.0868 41.7376 68.8047 41.3897 68.8047Z" fill="#F1F2F2"/>
<path d="M33.7522 63.4453H9.19796C8.84997 63.4453 8.56787 63.7274 8.56787 64.0754V64.4572C8.56787 64.8052 8.84997 65.0873 9.19796 65.0873H33.7522C34.1002 65.0873 34.3823 64.8052 34.3823 64.4572V64.0754C34.3823 63.7274 34.1002 63.4453 33.7522 63.4453Z" fill="#F1F2F2"/>
<path d="M33.7522 73.5391H9.19796C8.84997 73.5391 8.56787 73.8212 8.56787 74.1691V74.551C8.56787 74.899 8.84997 75.1811 9.19796 75.1811H33.7522C34.1002 75.1811 34.3823 74.899 34.3823 74.551V74.1691C34.3823 73.8212 34.1002 73.5391 33.7522 73.5391Z" fill="#F1F2F2"/>
<path d="M33.7522 44.625H9.19796C8.84997 44.625 8.56787 44.9071 8.56787 45.2551V45.637C8.56787 45.985 8.84997 46.2671 9.19796 46.2671H33.7522C34.1002 46.2671 34.3823 45.985 34.3823 45.637V45.2551C34.3823 44.9071 34.1002 44.625 33.7522 44.625Z" fill="#F1F2F2"/>
<path d="M11.1835 36.969C11.1835 36.969 11.1326 36.9245 11.088 36.829L10.9607 36.5299L7.54299 27.9378C7.43052 27.6865 7.27306 27.4578 7.07838 27.2631C6.88625 27.0831 6.65214 26.954 6.39738 26.8876C6.26311 26.8501 6.13302 26.7989 6.00914 26.7349C5.97221 26.7174 5.94047 26.6906 5.91704 26.6571C5.89361 26.6236 5.87929 26.5847 5.87549 26.544C5.87549 26.4803 5.92004 26.4358 6.00278 26.4039C6.11075 26.3757 6.22217 26.3628 6.33373 26.3658C6.57559 26.3658 6.81107 26.3658 7.02747 26.3658C7.24386 26.3658 7.47935 26.3658 7.74666 26.3658C8.01397 26.3658 8.31946 26.3658 8.58677 26.3658H9.22322C9.33689 26.3628 9.45041 26.3757 9.56054 26.4039C9.64328 26.4039 9.68783 26.474 9.68783 26.5376C9.68579 26.5763 9.67272 26.6137 9.65017 26.6453C9.62762 26.6768 9.59653 26.7013 9.56054 26.7158C9.43222 26.7711 9.3004 26.8179 9.16594 26.8558C9.11022 26.8643 9.05759 26.8869 9.01303 26.9214C8.96848 26.9559 8.93348 27.0013 8.91136 27.0531C8.86764 27.1557 8.84595 27.2663 8.84771 27.3777C8.85652 27.6097 8.89941 27.8392 8.97501 28.0587L9.61145 29.7389C9.81512 30.2481 10.0124 30.7382 10.2097 31.2091C10.407 31.6801 10.6107 32.1575 10.8462 32.6475C11.0817 33.1376 11.3044 33.6849 11.5654 34.2896C11.6163 34.4041 11.6608 34.4614 11.699 34.4487C11.7372 34.4359 11.769 34.3914 11.8008 34.3087L13.0737 31.2473C13.0737 31.1646 13.1247 31.0882 13.1438 31.0309C13.1821 30.9174 13.1821 30.7944 13.1438 30.6809L13.0483 30.42L12.1318 28.1924C11.9971 27.8577 11.7778 27.5639 11.4954 27.3395C11.2389 27.1378 10.9477 26.9847 10.6361 26.8876C10.5019 26.8501 10.3718 26.7989 10.2479 26.7349C10.211 26.7174 10.1792 26.6906 10.1558 26.6571C10.1324 26.6236 10.1181 26.5847 10.1143 26.544C10.1143 26.4803 10.1588 26.4358 10.2415 26.4039C10.3495 26.3757 10.4609 26.3628 10.5725 26.3658C10.7443 26.3658 10.9035 26.3658 11.0562 26.3658C11.2089 26.3658 11.3681 26.3658 11.5335 26.3658H12.0618C12.3036 26.3658 12.5328 26.3658 12.7364 26.3658H13.2838C13.3954 26.3624 13.5069 26.3752 13.6147 26.4039C13.7038 26.4039 13.742 26.474 13.742 26.5376C13.7386 26.5842 13.7218 26.6289 13.6936 26.6662C13.6653 26.7035 13.6269 26.7317 13.5829 26.7476L13.2583 26.9195C13.2067 26.9469 13.1637 26.9883 13.1345 27.0389C13.1052 27.0896 13.0908 27.1474 13.0928 27.2059C13.0928 27.2059 13.0928 27.2441 13.0928 27.2695C13.0913 27.2907 13.0913 27.312 13.0928 27.3332C13.0928 27.3713 13.1565 27.4796 13.2138 27.6387C13.271 27.7978 13.3411 27.9887 13.4174 28.186L13.6466 28.7525L13.8057 29.1216C13.863 29.2489 13.9075 29.3125 13.9393 29.3189C13.9711 29.3252 14.0284 29.2616 14.0921 29.1216C14.1557 28.9816 14.2639 28.7143 14.353 28.4851C14.4421 28.256 14.5249 28.0142 14.5949 27.7978L14.7285 27.3459C14.7324 27.3078 14.7324 27.2694 14.7285 27.2313C14.7324 27.1755 14.7215 27.1196 14.697 27.0693C14.6724 27.019 14.635 26.9761 14.5885 26.9449L14.2957 26.7667C14.2529 26.7481 14.2159 26.7181 14.189 26.6799C14.1621 26.6418 14.1461 26.5969 14.143 26.5503C14.143 26.4867 14.1875 26.4421 14.2703 26.4167C14.3782 26.3884 14.4897 26.3755 14.6012 26.3785H15.0786C15.1951 26.3867 15.3121 26.3867 15.4286 26.3785C15.5813 26.3863 15.7342 26.3863 15.8869 26.3785C16.0458 26.3672 16.2053 26.3672 16.3642 26.3785C16.4758 26.3755 16.5872 26.3884 16.6952 26.4167C16.7779 26.4485 16.8224 26.493 16.8224 26.5567C16.8197 26.5952 16.8063 26.6322 16.7839 26.6637C16.7614 26.6951 16.7307 26.7198 16.6952 26.7349C16.5715 26.7999 16.4383 26.845 16.3006 26.8685C16.0519 26.9073 15.815 27.0007 15.6068 27.1422C15.4542 27.2857 15.3234 27.4509 15.2186 27.6323C15.1677 27.7256 15.0913 27.8848 14.9895 28.1096C14.8876 28.3324 14.7858 28.5742 14.6712 28.8352C14.5567 29.0961 14.4676 29.3507 14.3785 29.5798C14.3409 29.683 14.3132 29.7896 14.2957 29.8981C14.274 29.9923 14.274 30.0902 14.2957 30.1845L15.9314 34.385C15.9314 34.4359 15.976 34.455 16.0078 34.4296C16.0527 34.3933 16.0859 34.3446 16.1033 34.2896C16.3706 33.5895 16.6697 32.6984 17.0007 31.6101C17.3316 30.5218 17.6817 29.3698 18.0381 28.1542C18.0711 28.0592 18.0946 27.9611 18.1081 27.8614C18.1167 27.7704 18.1167 27.6788 18.1081 27.5877C18.1115 27.4372 18.0765 27.2882 18.0062 27.155C17.9658 27.0879 17.9113 27.0304 17.8465 26.9864C17.7816 26.9424 17.708 26.9131 17.6307 26.9004C17.5289 26.9004 17.4143 26.8304 17.2934 26.7795C17.1725 26.7285 17.1089 26.6585 17.1089 26.5885C17.1089 26.5185 17.1534 26.4803 17.2361 26.4485C17.3441 26.4202 17.4555 26.4074 17.5671 26.4103H18.1463H18.7127C18.9737 26.4103 19.2282 26.4103 19.4701 26.4103C19.7119 26.4103 19.9347 26.4103 20.1384 26.4103C20.2499 26.4069 20.3614 26.4198 20.4693 26.4485C20.5584 26.4803 20.5966 26.5249 20.5966 26.5885C20.5954 26.6275 20.5826 26.6652 20.56 26.6969C20.5373 26.7286 20.5058 26.7529 20.4693 26.7667C20.3456 26.8317 20.2124 26.8768 20.0747 26.9004C19.8367 26.9515 19.6168 27.0659 19.4383 27.2313C19.2717 27.3854 19.1319 27.5661 19.0246 27.7659C18.9291 27.9632 18.8464 28.1414 18.7827 28.3006L15.976 36.5744C15.9499 36.6489 15.9179 36.7213 15.8805 36.7908C15.8296 36.8926 15.7723 36.9372 15.7214 36.9372C15.6932 36.9326 15.6663 36.9224 15.6422 36.9071C15.6181 36.8918 15.5974 36.8717 15.5814 36.8481C15.5271 36.786 15.484 36.7149 15.4541 36.6381C15.1804 36.0016 14.9386 35.4352 14.7413 34.9324C14.544 34.4296 14.3467 33.9268 14.1621 33.424C13.9775 32.9212 13.7548 32.3548 13.5256 31.7438C13.5256 31.6674 13.4684 31.6356 13.4493 31.6547C13.4069 31.7102 13.3746 31.7726 13.3538 31.8392C13.0992 32.4375 12.8828 32.9721 12.7173 33.4367C12.5519 33.9013 12.3482 34.3723 12.17 34.856C11.9918 35.3397 11.7881 35.8871 11.5654 36.5108C11.5201 36.6226 11.4669 36.7311 11.4062 36.8354C11.3108 36.9181 11.2471 36.969 11.1835 36.969Z" fill="#F1F2F2"/>
<path d="M42.3125 21.4082L41.7651 27.4227C41.8094 27.8825 42.019 28.3106 42.3548 28.6278C42.6907 28.9449 43.1302 29.1296 43.5917 29.1475C45.2529 29.2302 49.4153 29.402 49.4153 29.402L42.3125 21.4082Z" fill="#939598"/>
<path d="M3.18649 56.3926C1.46578 57.0936 0.398311 58.8356 0 59.6587L3.18649 62.1283V56.3926Z" fill="#7E7E7E"/>
<path d="M47.877 56.4707C49.5977 57.1717 50.6652 58.9137 51.0635 59.7369L47.877 62.2064V56.4707Z" fill="#7E7E7E"/>
<path d="M0 98.6115V59.7363L20.5528 75.2705H30.2716L51.0635 59.7363V98.6115H0Z" fill="#C4C4C4"/>
<path d="M2.46953 92.8768L20.6325 75.2715H30.0326C35.37 80.3433 46.5546 90.9649 48.5939 92.8768C50.6333 94.7887 51.0369 97.5503 50.9838 98.6922H0C0.254919 94.9321 1.75257 93.2486 2.46953 92.8768Z" fill="#A8A8A8"/>
</g>
</svg>
</div>
<p>Need to change your request?</p>
<p>Please cancel this request and submit a new one.</p>`;
  } else if (requestDetail[i].requestStatus === "REJECTED") {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressRejected"></div>`;
  } else if (requestDetail[i].requestStatus === "MESSAGE") {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressMessage"></div>`;
    document.querySelector(
      ".tipsInfoSection"
    ).innerHTML = `<div class="illustration">
    <svg width="106" height="99" viewBox="0 0 106 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7">
<path d="M59.034 30.7489C59.038 30.7197 59.038 30.6902 59.034 30.661C58.9462 30.19 58.108 25.8711 57.3496 25.7593C56.9424 25.6795 56.8386 26.2223 56.8386 26.7572C56.8352 26.8334 56.8095 26.9068 56.7648 26.9686C56.7201 27.0304 56.6584 27.0778 56.5871 27.1049C56.5159 27.132 56.4383 27.1378 56.3638 27.1214C56.2894 27.105 56.2213 27.0672 56.168 27.0127L54.3558 25.2005C54.2825 25.1343 54.1872 25.0977 54.0884 25.0977C53.9896 25.0977 53.8943 25.1343 53.821 25.2005C53.4269 25.5816 53.1393 26.0591 52.9867 26.5856C52.834 27.1122 52.8217 27.6694 52.9508 28.2022C53.2861 30.693 56.0243 32.8485 56.6949 32.6569C57.3095 32.5331 57.9365 32.4822 58.563 32.5052C58.6595 32.5077 58.7533 32.4738 58.8258 32.4101C58.8983 32.3465 58.9442 32.2579 58.9542 32.1619L59.034 30.7489Z" fill="#E6E7E8"/>
<path d="M93.6099 30.4286C93.6059 30.4021 93.6059 30.3752 93.6099 30.3487C93.6977 29.8777 94.536 25.5588 95.2944 25.447C95.7095 25.3672 95.8053 25.9021 95.8133 26.4449C95.8161 26.5205 95.8413 26.5935 95.8856 26.6548C95.9298 26.7161 95.9913 26.763 96.0621 26.7894C96.133 26.8159 96.21 26.8208 96.2837 26.8035C96.3573 26.7863 96.4242 26.7476 96.4759 26.6924L98.2881 24.8802C98.3614 24.814 98.4567 24.7773 98.5555 24.7773C98.6543 24.7773 98.7496 24.814 98.823 24.8802C99.2184 25.2605 99.5075 25.7376 99.6616 26.2642C99.8156 26.7907 99.8293 27.3484 99.7011 27.8819C99.3578 30.3647 96.6196 32.5282 95.949 32.3286C95.3341 32.2075 94.7071 32.1593 94.0809 32.1849C93.9853 32.1873 93.8924 32.1531 93.8212 32.0893C93.75 32.0255 93.7058 31.9369 93.6977 31.8416L93.6099 30.4286Z" fill="#E6E7E8"/>
<path d="M70.0914 94.9707L70.4825 89.4941L74.0989 89.7416L73.8595 96.0724L69.5645 96.7829L70.0914 94.9707Z" fill="#E6E7E8"/>
<path d="M85.499 94.8791L85.1558 89.9375L88.4369 90.2329L88.7243 95.6136L85.499 94.8791Z" fill="#E6E7E8"/>
<path d="M79.1356 62.2025C81.5732 72.1018 83.2413 82.1748 84.1252 92.3314C84.1252 92.3314 88.3323 93.2175 89.7135 92.3314C89.7135 92.3314 89.6177 75.7981 88.6357 68.7568C88.6357 68.7568 85.9933 50.7545 86.1928 44.9826C86.3924 39.2107 71.6154 45.6692 71.6154 45.6692C71.6154 45.6692 70.3381 83.7254 69.8511 92.044C69.8511 92.044 74.1541 91.549 75.136 92.2356C75.128 92.2356 79.0398 65.6274 79.1356 62.2025Z" fill="#A7A9AC"/>
<path d="M70.1868 93.8457C70.1868 93.8457 64.6624 95.5142 64.2153 96.7835C63.7682 98.0529 64.2153 98.3004 64.2153 98.3004H74.881C74.881 98.3004 75.3759 95.8575 74.881 95.8575C74.7275 95.8539 74.5767 95.817 74.4389 95.7495C74.3011 95.6819 74.1795 95.5854 74.0826 95.4663C74.0826 95.4663 70.562 96.2008 70.4183 95.61C70.3051 95.0272 70.2278 94.438 70.1868 93.8457Z" fill="#808285"/>
<path d="M83.5112 98.6927H89.7062C89.7062 98.6927 89.5785 95.204 88.405 93.8469C87.2314 92.4897 85.4033 94.0624 85.4033 94.0624C85.4033 94.0624 83.9024 95.3318 83.5112 98.6927Z" fill="#808285"/>
<path d="M72.3807 12.7785C73.0273 11.8125 74.5511 6.8334 74.5511 6.8334C74.5511 6.8334 75.3952 5.98936 76.4202 5.62756C77.4451 5.26576 81.2434 5.38632 82.811 7.2554C84.3786 9.12449 82.4973 11.3574 82.4973 11.3574C82.0194 11.0994 81.4836 10.9675 80.9405 10.9742C79.9426 10.9663 79.9426 12.7785 79.9426 12.7785L79.7362 18.1272C79.7362 18.1272 75.4791 18.9042 74.2497 18.4092C73.0203 17.9143 73.2446 13.763 73.2446 13.763C73.2446 13.763 71.734 13.7444 72.3807 12.7785Z" fill="#E6E7E8"/>
<path d="M81.5468 14.3906C83.1435 12.1393 82.2494 10.5826 82.2494 10.5826L80.5569 9.96783L80.501 9.73633L77.1959 17.2486L75.272 20.6574L79.1199 26.3256L82.9998 20.8091L81.5468 14.3906Z" fill="#E6E7E8"/>
<path d="M72.2947 13.623C72.2947 13.5194 72.3664 13.3918 72.4222 13.2324C72.2947 13.4157 72.2628 13.5512 72.2947 13.623Z" fill="#BCBEC0"/>
<path d="M98.7512 30.0851C98.7512 30.0851 94.0411 34.3561 94.0411 29.9014C94.0411 27.1791 92.5242 31.2826 91.231 34.7553C90.7999 29.8136 89.8658 20.9442 89.8658 20.9442C87.6397 19.3264 84.9153 18.5436 82.1699 18.7328C80.9599 19.5532 79.5284 19.9848 78.0665 19.9702C75.8472 19.8425 76.0388 19.3156 76.0388 19.3156C76.0388 19.3156 72.1908 19.7707 71.3446 20.4892C70.4984 21.2076 66.9139 26.756 66.5546 34.3801C66.5546 34.3801 60.0323 31.1868 58.5714 29.8855C58.5714 29.8855 56.0247 29.3586 56.2882 32.5599L64.966 40.9024C64.966 40.9024 67.832 42.9302 69.269 40.3196C70.0325 39.0323 70.623 37.6499 71.0253 36.2082L70.8337 47.1054L71.2887 46.9058C72.7257 46.6424 78.2023 46.6424 80.1582 47.5604C82.1141 48.4785 86.0338 47.9516 86.5448 47.5604C87.0557 47.1693 86.5448 42.0759 86.5448 42.0759C86.5448 42.0759 89.7381 43.2016 90.0734 43.002C90.257 42.9541 98.7512 33.5658 98.7512 30.0851Z" fill="white"/>
<path d="M92.4469 32.9217L91.9089 31.5538C93.1641 33.6983 95.5435 32.974 96.9345 32.143C97.2407 31.9601 97.3807 31.6031 97.2085 31.2908C96.9885 30.8917 96.5674 30.3317 95.8243 29.6866C94.6259 28.6464 94.2277 27.2382 94.1784 26.6642L94.0128 24.8123C94.0028 24.7011 94.0157 24.5892 94.0183 24.4776C94.0277 24.062 93.7853 23.2936 92.7293 22.566C91.6023 21.7896 91.5046 20.9087 91.6111 20.482C91.6274 20.4167 91.6469 20.3523 91.6581 20.2859L91.8216 19.3196C91.8503 19.1499 91.8351 18.9765 91.7766 18.8146C90.9342 16.4819 89.1652 11.64 88.1551 9.07825C87.1079 6.42259 84.9248 4.21742 83.9641 3.4468C83.5878 3.17783 82.2871 2.63435 80.0944 2.61221C78.5162 2.59627 76.7665 4.11974 75.5415 5.52568C75.1902 5.92891 75.6153 6.44896 76.1005 6.22413C76.6746 5.95815 77.3523 6.25182 77.5507 6.85258L79.6753 13.2845C78.9518 19.7959 78.9045 25.1924 81.421 28.9132C82.7041 30.8105 82.6048 33.0011 82.1189 34.7229C81.8714 35.5999 82.6971 36.6448 83.5783 36.4127L91.771 34.2547C92.3498 34.1022 92.6659 33.4788 92.4469 32.9217Z" fill="#BCBEC0"/>
<path d="M3.91534 78.6177L1.51592 22.9791C1.51592 22.9791 1.36954 21.1016 3.57802 21.1016C5.78651 21.1016 42.3125 21.3752 42.3125 21.3752L49.4152 29.3691L47.1367 78.6177H3.91534Z" fill="#A7A9AC"/>
<path d="M42.0136 31.1641H21.6599C21.3119 31.1641 21.0298 31.4462 21.0298 31.7942V32.176C21.0298 32.524 21.3119 32.8061 21.6599 32.8061H42.0136C42.3616 32.8061 42.6437 32.524 42.6437 32.176V31.7942C42.6437 31.4462 42.3616 31.1641 42.0136 31.1641Z" fill="#F1F2F2"/>
<path d="M42.0136 35.0781H21.6599C21.3119 35.0781 21.0298 35.3602 21.0298 35.7082V36.0901C21.0298 36.4381 21.3119 36.7202 21.6599 36.7202H42.0136C42.3616 36.7202 42.6437 36.4381 42.6437 36.0901V35.7082C42.6437 35.3602 42.3616 35.0781 42.0136 35.0781Z" fill="#F1F2F2"/>
<path d="M41.3897 40.7109H9.19796C8.84997 40.7109 8.56787 40.9931 8.56787 41.341V41.7229C8.56787 42.0709 8.84997 42.353 9.19796 42.353H41.3897C41.7376 42.353 42.0198 42.0709 42.0198 41.7229V41.341C42.0198 40.9931 41.7376 40.7109 41.3897 40.7109Z" fill="#F1F2F2"/>
<path d="M41.3897 49.8633H9.19796C8.84997 49.8633 8.56787 50.1454 8.56787 50.4934V50.8752C8.56787 51.2232 8.84997 51.5053 9.19796 51.5053H41.3897C41.7376 51.5053 42.0198 51.2232 42.0198 50.8752V50.4934C42.0198 50.1454 41.7376 49.8633 41.3897 49.8633Z" fill="#F1F2F2"/>
<path d="M41.3897 54.1719H9.19796C8.84997 54.1719 8.56787 54.454 8.56787 54.802V55.1838C8.56787 55.5318 8.84997 55.8139 9.19796 55.8139H41.3897C41.7376 55.8139 42.0198 55.5318 42.0198 55.1838V54.802C42.0198 54.454 41.7376 54.1719 41.3897 54.1719Z" fill="#F1F2F2"/>
<path d="M41.3897 59.4668H9.19796C8.84997 59.4668 8.56787 59.7489 8.56787 60.0969V60.4787C8.56787 60.8267 8.84997 61.1088 9.19796 61.1088H41.3897C41.7376 61.1088 42.0198 60.8267 42.0198 60.4787V60.0969C42.0198 59.7489 41.7376 59.4668 41.3897 59.4668Z" fill="#F1F2F2"/>
<path d="M41.3897 68.8047H9.19796C8.84997 68.8047 8.56787 69.0868 8.56787 69.4348V69.8166C8.56787 70.1646 8.84997 70.4467 9.19796 70.4467H41.3897C41.7376 70.4467 42.0198 70.1646 42.0198 69.8166V69.4348C42.0198 69.0868 41.7376 68.8047 41.3897 68.8047Z" fill="#F1F2F2"/>
<path d="M33.7522 63.4453H9.19796C8.84997 63.4453 8.56787 63.7274 8.56787 64.0754V64.4572C8.56787 64.8052 8.84997 65.0873 9.19796 65.0873H33.7522C34.1002 65.0873 34.3823 64.8052 34.3823 64.4572V64.0754C34.3823 63.7274 34.1002 63.4453 33.7522 63.4453Z" fill="#F1F2F2"/>
<path d="M33.7522 73.5391H9.19796C8.84997 73.5391 8.56787 73.8212 8.56787 74.1691V74.551C8.56787 74.899 8.84997 75.1811 9.19796 75.1811H33.7522C34.1002 75.1811 34.3823 74.899 34.3823 74.551V74.1691C34.3823 73.8212 34.1002 73.5391 33.7522 73.5391Z" fill="#F1F2F2"/>
<path d="M33.7522 44.625H9.19796C8.84997 44.625 8.56787 44.9071 8.56787 45.2551V45.637C8.56787 45.985 8.84997 46.2671 9.19796 46.2671H33.7522C34.1002 46.2671 34.3823 45.985 34.3823 45.637V45.2551C34.3823 44.9071 34.1002 44.625 33.7522 44.625Z" fill="#F1F2F2"/>
<path d="M11.1835 36.969C11.1835 36.969 11.1326 36.9245 11.088 36.829L10.9607 36.5299L7.54299 27.9378C7.43052 27.6865 7.27306 27.4578 7.07838 27.2631C6.88625 27.0831 6.65214 26.954 6.39738 26.8876C6.26311 26.8501 6.13302 26.7989 6.00914 26.7349C5.97221 26.7174 5.94047 26.6906 5.91704 26.6571C5.89361 26.6236 5.87929 26.5847 5.87549 26.544C5.87549 26.4803 5.92004 26.4358 6.00278 26.4039C6.11075 26.3757 6.22217 26.3628 6.33373 26.3658C6.57559 26.3658 6.81107 26.3658 7.02747 26.3658C7.24386 26.3658 7.47935 26.3658 7.74666 26.3658C8.01397 26.3658 8.31946 26.3658 8.58677 26.3658H9.22322C9.33689 26.3628 9.45041 26.3757 9.56054 26.4039C9.64328 26.4039 9.68783 26.474 9.68783 26.5376C9.68579 26.5763 9.67272 26.6137 9.65017 26.6453C9.62762 26.6768 9.59653 26.7013 9.56054 26.7158C9.43222 26.7711 9.3004 26.8179 9.16594 26.8558C9.11022 26.8643 9.05759 26.8869 9.01303 26.9214C8.96848 26.9559 8.93348 27.0013 8.91136 27.0531C8.86764 27.1557 8.84595 27.2663 8.84771 27.3777C8.85652 27.6097 8.89941 27.8392 8.97501 28.0587L9.61145 29.7389C9.81512 30.2481 10.0124 30.7382 10.2097 31.2091C10.407 31.6801 10.6107 32.1575 10.8462 32.6475C11.0817 33.1376 11.3044 33.6849 11.5654 34.2896C11.6163 34.4041 11.6608 34.4614 11.699 34.4487C11.7372 34.4359 11.769 34.3914 11.8008 34.3087L13.0737 31.2473C13.0737 31.1646 13.1247 31.0882 13.1438 31.0309C13.1821 30.9174 13.1821 30.7944 13.1438 30.6809L13.0483 30.42L12.1318 28.1924C11.9971 27.8577 11.7778 27.5639 11.4954 27.3395C11.2389 27.1378 10.9477 26.9847 10.6361 26.8876C10.5019 26.8501 10.3718 26.7989 10.2479 26.7349C10.211 26.7174 10.1792 26.6906 10.1558 26.6571C10.1324 26.6236 10.1181 26.5847 10.1143 26.544C10.1143 26.4803 10.1588 26.4358 10.2415 26.4039C10.3495 26.3757 10.4609 26.3628 10.5725 26.3658C10.7443 26.3658 10.9035 26.3658 11.0562 26.3658C11.2089 26.3658 11.3681 26.3658 11.5335 26.3658H12.0618C12.3036 26.3658 12.5328 26.3658 12.7364 26.3658H13.2838C13.3954 26.3624 13.5069 26.3752 13.6147 26.4039C13.7038 26.4039 13.742 26.474 13.742 26.5376C13.7386 26.5842 13.7218 26.6289 13.6936 26.6662C13.6653 26.7035 13.6269 26.7317 13.5829 26.7476L13.2583 26.9195C13.2067 26.9469 13.1637 26.9883 13.1345 27.0389C13.1052 27.0896 13.0908 27.1474 13.0928 27.2059C13.0928 27.2059 13.0928 27.2441 13.0928 27.2695C13.0913 27.2907 13.0913 27.312 13.0928 27.3332C13.0928 27.3713 13.1565 27.4796 13.2138 27.6387C13.271 27.7978 13.3411 27.9887 13.4174 28.186L13.6466 28.7525L13.8057 29.1216C13.863 29.2489 13.9075 29.3125 13.9393 29.3189C13.9711 29.3252 14.0284 29.2616 14.0921 29.1216C14.1557 28.9816 14.2639 28.7143 14.353 28.4851C14.4421 28.256 14.5249 28.0142 14.5949 27.7978L14.7285 27.3459C14.7324 27.3078 14.7324 27.2694 14.7285 27.2313C14.7324 27.1755 14.7215 27.1196 14.697 27.0693C14.6724 27.019 14.635 26.9761 14.5885 26.9449L14.2957 26.7667C14.2529 26.7481 14.2159 26.7181 14.189 26.6799C14.1621 26.6418 14.1461 26.5969 14.143 26.5503C14.143 26.4867 14.1875 26.4421 14.2703 26.4167C14.3782 26.3884 14.4897 26.3755 14.6012 26.3785H15.0786C15.1951 26.3867 15.3121 26.3867 15.4286 26.3785C15.5813 26.3863 15.7342 26.3863 15.8869 26.3785C16.0458 26.3672 16.2053 26.3672 16.3642 26.3785C16.4758 26.3755 16.5872 26.3884 16.6952 26.4167C16.7779 26.4485 16.8224 26.493 16.8224 26.5567C16.8197 26.5952 16.8063 26.6322 16.7839 26.6637C16.7614 26.6951 16.7307 26.7198 16.6952 26.7349C16.5715 26.7999 16.4383 26.845 16.3006 26.8685C16.0519 26.9073 15.815 27.0007 15.6068 27.1422C15.4542 27.2857 15.3234 27.4509 15.2186 27.6323C15.1677 27.7256 15.0913 27.8848 14.9895 28.1096C14.8876 28.3324 14.7858 28.5742 14.6712 28.8352C14.5567 29.0961 14.4676 29.3507 14.3785 29.5798C14.3409 29.683 14.3132 29.7896 14.2957 29.8981C14.274 29.9923 14.274 30.0902 14.2957 30.1845L15.9314 34.385C15.9314 34.4359 15.976 34.455 16.0078 34.4296C16.0527 34.3933 16.0859 34.3446 16.1033 34.2896C16.3706 33.5895 16.6697 32.6984 17.0007 31.6101C17.3316 30.5218 17.6817 29.3698 18.0381 28.1542C18.0711 28.0592 18.0946 27.9611 18.1081 27.8614C18.1167 27.7704 18.1167 27.6788 18.1081 27.5877C18.1115 27.4372 18.0765 27.2882 18.0062 27.155C17.9658 27.0879 17.9113 27.0304 17.8465 26.9864C17.7816 26.9424 17.708 26.9131 17.6307 26.9004C17.5289 26.9004 17.4143 26.8304 17.2934 26.7795C17.1725 26.7285 17.1089 26.6585 17.1089 26.5885C17.1089 26.5185 17.1534 26.4803 17.2361 26.4485C17.3441 26.4202 17.4555 26.4074 17.5671 26.4103H18.1463H18.7127C18.9737 26.4103 19.2282 26.4103 19.4701 26.4103C19.7119 26.4103 19.9347 26.4103 20.1384 26.4103C20.2499 26.4069 20.3614 26.4198 20.4693 26.4485C20.5584 26.4803 20.5966 26.5249 20.5966 26.5885C20.5954 26.6275 20.5826 26.6652 20.56 26.6969C20.5373 26.7286 20.5058 26.7529 20.4693 26.7667C20.3456 26.8317 20.2124 26.8768 20.0747 26.9004C19.8367 26.9515 19.6168 27.0659 19.4383 27.2313C19.2717 27.3854 19.1319 27.5661 19.0246 27.7659C18.9291 27.9632 18.8464 28.1414 18.7827 28.3006L15.976 36.5744C15.9499 36.6489 15.9179 36.7213 15.8805 36.7908C15.8296 36.8926 15.7723 36.9372 15.7214 36.9372C15.6932 36.9326 15.6663 36.9224 15.6422 36.9071C15.6181 36.8918 15.5974 36.8717 15.5814 36.8481C15.5271 36.786 15.484 36.7149 15.4541 36.6381C15.1804 36.0016 14.9386 35.4352 14.7413 34.9324C14.544 34.4296 14.3467 33.9268 14.1621 33.424C13.9775 32.9212 13.7548 32.3548 13.5256 31.7438C13.5256 31.6674 13.4684 31.6356 13.4493 31.6547C13.4069 31.7102 13.3746 31.7726 13.3538 31.8392C13.0992 32.4375 12.8828 32.9721 12.7173 33.4367C12.5519 33.9013 12.3482 34.3723 12.17 34.856C11.9918 35.3397 11.7881 35.8871 11.5654 36.5108C11.5201 36.6226 11.4669 36.7311 11.4062 36.8354C11.3108 36.9181 11.2471 36.969 11.1835 36.969Z" fill="#F1F2F2"/>
<path d="M42.3125 21.4082L41.7651 27.4227C41.8094 27.8825 42.019 28.3106 42.3548 28.6278C42.6907 28.9449 43.1302 29.1296 43.5917 29.1475C45.2529 29.2302 49.4153 29.402 49.4153 29.402L42.3125 21.4082Z" fill="#939598"/>
<path d="M3.18649 56.3926C1.46578 57.0936 0.398311 58.8356 0 59.6587L3.18649 62.1283V56.3926Z" fill="#7E7E7E"/>
<path d="M47.877 56.4707C49.5977 57.1717 50.6652 58.9137 51.0635 59.7369L47.877 62.2064V56.4707Z" fill="#7E7E7E"/>
<path d="M0 98.6115V59.7363L20.5528 75.2705H30.2716L51.0635 59.7363V98.6115H0Z" fill="#C4C4C4"/>
<path d="M2.46953 92.8768L20.6325 75.2715H30.0326C35.37 80.3433 46.5546 90.9649 48.5939 92.8768C50.6333 94.7887 51.0369 97.5503 50.9838 98.6922H0C0.254919 94.9321 1.75257 93.2486 2.46953 92.8768Z" fill="#A8A8A8"/>
</g>
</svg>
</div>
<p>Need to change your request?</p>
<p>Please cancel this request and submit a new one.</p>`;
  } else if (requestDetail[i].requestStatus === "BOOKED") {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressBooked"></div>`;
  } else {
    document.querySelector(
      ".requestStatusBar"
    ).innerHTML = `<div class="statusProgressOngoing"></div>`;
    document.querySelector(
      ".tipsInfoSection"
    ).innerHTML = `<div class="illustration">
    <svg width="106" height="99" viewBox="0 0 106 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7">
<path d="M59.034 30.7489C59.038 30.7197 59.038 30.6902 59.034 30.661C58.9462 30.19 58.108 25.8711 57.3496 25.7593C56.9424 25.6795 56.8386 26.2223 56.8386 26.7572C56.8352 26.8334 56.8095 26.9068 56.7648 26.9686C56.7201 27.0304 56.6584 27.0778 56.5871 27.1049C56.5159 27.132 56.4383 27.1378 56.3638 27.1214C56.2894 27.105 56.2213 27.0672 56.168 27.0127L54.3558 25.2005C54.2825 25.1343 54.1872 25.0977 54.0884 25.0977C53.9896 25.0977 53.8943 25.1343 53.821 25.2005C53.4269 25.5816 53.1393 26.0591 52.9867 26.5856C52.834 27.1122 52.8217 27.6694 52.9508 28.2022C53.2861 30.693 56.0243 32.8485 56.6949 32.6569C57.3095 32.5331 57.9365 32.4822 58.563 32.5052C58.6595 32.5077 58.7533 32.4738 58.8258 32.4101C58.8983 32.3465 58.9442 32.2579 58.9542 32.1619L59.034 30.7489Z" fill="#E6E7E8"/>
<path d="M93.6099 30.4286C93.6059 30.4021 93.6059 30.3752 93.6099 30.3487C93.6977 29.8777 94.536 25.5588 95.2944 25.447C95.7095 25.3672 95.8053 25.9021 95.8133 26.4449C95.8161 26.5205 95.8413 26.5935 95.8856 26.6548C95.9298 26.7161 95.9913 26.763 96.0621 26.7894C96.133 26.8159 96.21 26.8208 96.2837 26.8035C96.3573 26.7863 96.4242 26.7476 96.4759 26.6924L98.2881 24.8802C98.3614 24.814 98.4567 24.7773 98.5555 24.7773C98.6543 24.7773 98.7496 24.814 98.823 24.8802C99.2184 25.2605 99.5075 25.7376 99.6616 26.2642C99.8156 26.7907 99.8293 27.3484 99.7011 27.8819C99.3578 30.3647 96.6196 32.5282 95.949 32.3286C95.3341 32.2075 94.7071 32.1593 94.0809 32.1849C93.9853 32.1873 93.8924 32.1531 93.8212 32.0893C93.75 32.0255 93.7058 31.9369 93.6977 31.8416L93.6099 30.4286Z" fill="#E6E7E8"/>
<path d="M70.0914 94.9707L70.4825 89.4941L74.0989 89.7416L73.8595 96.0724L69.5645 96.7829L70.0914 94.9707Z" fill="#E6E7E8"/>
<path d="M85.499 94.8791L85.1558 89.9375L88.4369 90.2329L88.7243 95.6136L85.499 94.8791Z" fill="#E6E7E8"/>
<path d="M79.1356 62.2025C81.5732 72.1018 83.2413 82.1748 84.1252 92.3314C84.1252 92.3314 88.3323 93.2175 89.7135 92.3314C89.7135 92.3314 89.6177 75.7981 88.6357 68.7568C88.6357 68.7568 85.9933 50.7545 86.1928 44.9826C86.3924 39.2107 71.6154 45.6692 71.6154 45.6692C71.6154 45.6692 70.3381 83.7254 69.8511 92.044C69.8511 92.044 74.1541 91.549 75.136 92.2356C75.128 92.2356 79.0398 65.6274 79.1356 62.2025Z" fill="#A7A9AC"/>
<path d="M70.1868 93.8457C70.1868 93.8457 64.6624 95.5142 64.2153 96.7835C63.7682 98.0529 64.2153 98.3004 64.2153 98.3004H74.881C74.881 98.3004 75.3759 95.8575 74.881 95.8575C74.7275 95.8539 74.5767 95.817 74.4389 95.7495C74.3011 95.6819 74.1795 95.5854 74.0826 95.4663C74.0826 95.4663 70.562 96.2008 70.4183 95.61C70.3051 95.0272 70.2278 94.438 70.1868 93.8457Z" fill="#808285"/>
<path d="M83.5112 98.6927H89.7062C89.7062 98.6927 89.5785 95.204 88.405 93.8469C87.2314 92.4897 85.4033 94.0624 85.4033 94.0624C85.4033 94.0624 83.9024 95.3318 83.5112 98.6927Z" fill="#808285"/>
<path d="M72.3807 12.7785C73.0273 11.8125 74.5511 6.8334 74.5511 6.8334C74.5511 6.8334 75.3952 5.98936 76.4202 5.62756C77.4451 5.26576 81.2434 5.38632 82.811 7.2554C84.3786 9.12449 82.4973 11.3574 82.4973 11.3574C82.0194 11.0994 81.4836 10.9675 80.9405 10.9742C79.9426 10.9663 79.9426 12.7785 79.9426 12.7785L79.7362 18.1272C79.7362 18.1272 75.4791 18.9042 74.2497 18.4092C73.0203 17.9143 73.2446 13.763 73.2446 13.763C73.2446 13.763 71.734 13.7444 72.3807 12.7785Z" fill="#E6E7E8"/>
<path d="M81.5468 14.3906C83.1435 12.1393 82.2494 10.5826 82.2494 10.5826L80.5569 9.96783L80.501 9.73633L77.1959 17.2486L75.272 20.6574L79.1199 26.3256L82.9998 20.8091L81.5468 14.3906Z" fill="#E6E7E8"/>
<path d="M72.2947 13.623C72.2947 13.5194 72.3664 13.3918 72.4222 13.2324C72.2947 13.4157 72.2628 13.5512 72.2947 13.623Z" fill="#BCBEC0"/>
<path d="M98.7512 30.0851C98.7512 30.0851 94.0411 34.3561 94.0411 29.9014C94.0411 27.1791 92.5242 31.2826 91.231 34.7553C90.7999 29.8136 89.8658 20.9442 89.8658 20.9442C87.6397 19.3264 84.9153 18.5436 82.1699 18.7328C80.9599 19.5532 79.5284 19.9848 78.0665 19.9702C75.8472 19.8425 76.0388 19.3156 76.0388 19.3156C76.0388 19.3156 72.1908 19.7707 71.3446 20.4892C70.4984 21.2076 66.9139 26.756 66.5546 34.3801C66.5546 34.3801 60.0323 31.1868 58.5714 29.8855C58.5714 29.8855 56.0247 29.3586 56.2882 32.5599L64.966 40.9024C64.966 40.9024 67.832 42.9302 69.269 40.3196C70.0325 39.0323 70.623 37.6499 71.0253 36.2082L70.8337 47.1054L71.2887 46.9058C72.7257 46.6424 78.2023 46.6424 80.1582 47.5604C82.1141 48.4785 86.0338 47.9516 86.5448 47.5604C87.0557 47.1693 86.5448 42.0759 86.5448 42.0759C86.5448 42.0759 89.7381 43.2016 90.0734 43.002C90.257 42.9541 98.7512 33.5658 98.7512 30.0851Z" fill="white"/>
<path d="M92.4469 32.9217L91.9089 31.5538C93.1641 33.6983 95.5435 32.974 96.9345 32.143C97.2407 31.9601 97.3807 31.6031 97.2085 31.2908C96.9885 30.8917 96.5674 30.3317 95.8243 29.6866C94.6259 28.6464 94.2277 27.2382 94.1784 26.6642L94.0128 24.8123C94.0028 24.7011 94.0157 24.5892 94.0183 24.4776C94.0277 24.062 93.7853 23.2936 92.7293 22.566C91.6023 21.7896 91.5046 20.9087 91.6111 20.482C91.6274 20.4167 91.6469 20.3523 91.6581 20.2859L91.8216 19.3196C91.8503 19.1499 91.8351 18.9765 91.7766 18.8146C90.9342 16.4819 89.1652 11.64 88.1551 9.07825C87.1079 6.42259 84.9248 4.21742 83.9641 3.4468C83.5878 3.17783 82.2871 2.63435 80.0944 2.61221C78.5162 2.59627 76.7665 4.11974 75.5415 5.52568C75.1902 5.92891 75.6153 6.44896 76.1005 6.22413C76.6746 5.95815 77.3523 6.25182 77.5507 6.85258L79.6753 13.2845C78.9518 19.7959 78.9045 25.1924 81.421 28.9132C82.7041 30.8105 82.6048 33.0011 82.1189 34.7229C81.8714 35.5999 82.6971 36.6448 83.5783 36.4127L91.771 34.2547C92.3498 34.1022 92.6659 33.4788 92.4469 32.9217Z" fill="#BCBEC0"/>
<path d="M3.91534 78.6177L1.51592 22.9791C1.51592 22.9791 1.36954 21.1016 3.57802 21.1016C5.78651 21.1016 42.3125 21.3752 42.3125 21.3752L49.4152 29.3691L47.1367 78.6177H3.91534Z" fill="#A7A9AC"/>
<path d="M42.0136 31.1641H21.6599C21.3119 31.1641 21.0298 31.4462 21.0298 31.7942V32.176C21.0298 32.524 21.3119 32.8061 21.6599 32.8061H42.0136C42.3616 32.8061 42.6437 32.524 42.6437 32.176V31.7942C42.6437 31.4462 42.3616 31.1641 42.0136 31.1641Z" fill="#F1F2F2"/>
<path d="M42.0136 35.0781H21.6599C21.3119 35.0781 21.0298 35.3602 21.0298 35.7082V36.0901C21.0298 36.4381 21.3119 36.7202 21.6599 36.7202H42.0136C42.3616 36.7202 42.6437 36.4381 42.6437 36.0901V35.7082C42.6437 35.3602 42.3616 35.0781 42.0136 35.0781Z" fill="#F1F2F2"/>
<path d="M41.3897 40.7109H9.19796C8.84997 40.7109 8.56787 40.9931 8.56787 41.341V41.7229C8.56787 42.0709 8.84997 42.353 9.19796 42.353H41.3897C41.7376 42.353 42.0198 42.0709 42.0198 41.7229V41.341C42.0198 40.9931 41.7376 40.7109 41.3897 40.7109Z" fill="#F1F2F2"/>
<path d="M41.3897 49.8633H9.19796C8.84997 49.8633 8.56787 50.1454 8.56787 50.4934V50.8752C8.56787 51.2232 8.84997 51.5053 9.19796 51.5053H41.3897C41.7376 51.5053 42.0198 51.2232 42.0198 50.8752V50.4934C42.0198 50.1454 41.7376 49.8633 41.3897 49.8633Z" fill="#F1F2F2"/>
<path d="M41.3897 54.1719H9.19796C8.84997 54.1719 8.56787 54.454 8.56787 54.802V55.1838C8.56787 55.5318 8.84997 55.8139 9.19796 55.8139H41.3897C41.7376 55.8139 42.0198 55.5318 42.0198 55.1838V54.802C42.0198 54.454 41.7376 54.1719 41.3897 54.1719Z" fill="#F1F2F2"/>
<path d="M41.3897 59.4668H9.19796C8.84997 59.4668 8.56787 59.7489 8.56787 60.0969V60.4787C8.56787 60.8267 8.84997 61.1088 9.19796 61.1088H41.3897C41.7376 61.1088 42.0198 60.8267 42.0198 60.4787V60.0969C42.0198 59.7489 41.7376 59.4668 41.3897 59.4668Z" fill="#F1F2F2"/>
<path d="M41.3897 68.8047H9.19796C8.84997 68.8047 8.56787 69.0868 8.56787 69.4348V69.8166C8.56787 70.1646 8.84997 70.4467 9.19796 70.4467H41.3897C41.7376 70.4467 42.0198 70.1646 42.0198 69.8166V69.4348C42.0198 69.0868 41.7376 68.8047 41.3897 68.8047Z" fill="#F1F2F2"/>
<path d="M33.7522 63.4453H9.19796C8.84997 63.4453 8.56787 63.7274 8.56787 64.0754V64.4572C8.56787 64.8052 8.84997 65.0873 9.19796 65.0873H33.7522C34.1002 65.0873 34.3823 64.8052 34.3823 64.4572V64.0754C34.3823 63.7274 34.1002 63.4453 33.7522 63.4453Z" fill="#F1F2F2"/>
<path d="M33.7522 73.5391H9.19796C8.84997 73.5391 8.56787 73.8212 8.56787 74.1691V74.551C8.56787 74.899 8.84997 75.1811 9.19796 75.1811H33.7522C34.1002 75.1811 34.3823 74.899 34.3823 74.551V74.1691C34.3823 73.8212 34.1002 73.5391 33.7522 73.5391Z" fill="#F1F2F2"/>
<path d="M33.7522 44.625H9.19796C8.84997 44.625 8.56787 44.9071 8.56787 45.2551V45.637C8.56787 45.985 8.84997 46.2671 9.19796 46.2671H33.7522C34.1002 46.2671 34.3823 45.985 34.3823 45.637V45.2551C34.3823 44.9071 34.1002 44.625 33.7522 44.625Z" fill="#F1F2F2"/>
<path d="M11.1835 36.969C11.1835 36.969 11.1326 36.9245 11.088 36.829L10.9607 36.5299L7.54299 27.9378C7.43052 27.6865 7.27306 27.4578 7.07838 27.2631C6.88625 27.0831 6.65214 26.954 6.39738 26.8876C6.26311 26.8501 6.13302 26.7989 6.00914 26.7349C5.97221 26.7174 5.94047 26.6906 5.91704 26.6571C5.89361 26.6236 5.87929 26.5847 5.87549 26.544C5.87549 26.4803 5.92004 26.4358 6.00278 26.4039C6.11075 26.3757 6.22217 26.3628 6.33373 26.3658C6.57559 26.3658 6.81107 26.3658 7.02747 26.3658C7.24386 26.3658 7.47935 26.3658 7.74666 26.3658C8.01397 26.3658 8.31946 26.3658 8.58677 26.3658H9.22322C9.33689 26.3628 9.45041 26.3757 9.56054 26.4039C9.64328 26.4039 9.68783 26.474 9.68783 26.5376C9.68579 26.5763 9.67272 26.6137 9.65017 26.6453C9.62762 26.6768 9.59653 26.7013 9.56054 26.7158C9.43222 26.7711 9.3004 26.8179 9.16594 26.8558C9.11022 26.8643 9.05759 26.8869 9.01303 26.9214C8.96848 26.9559 8.93348 27.0013 8.91136 27.0531C8.86764 27.1557 8.84595 27.2663 8.84771 27.3777C8.85652 27.6097 8.89941 27.8392 8.97501 28.0587L9.61145 29.7389C9.81512 30.2481 10.0124 30.7382 10.2097 31.2091C10.407 31.6801 10.6107 32.1575 10.8462 32.6475C11.0817 33.1376 11.3044 33.6849 11.5654 34.2896C11.6163 34.4041 11.6608 34.4614 11.699 34.4487C11.7372 34.4359 11.769 34.3914 11.8008 34.3087L13.0737 31.2473C13.0737 31.1646 13.1247 31.0882 13.1438 31.0309C13.1821 30.9174 13.1821 30.7944 13.1438 30.6809L13.0483 30.42L12.1318 28.1924C11.9971 27.8577 11.7778 27.5639 11.4954 27.3395C11.2389 27.1378 10.9477 26.9847 10.6361 26.8876C10.5019 26.8501 10.3718 26.7989 10.2479 26.7349C10.211 26.7174 10.1792 26.6906 10.1558 26.6571C10.1324 26.6236 10.1181 26.5847 10.1143 26.544C10.1143 26.4803 10.1588 26.4358 10.2415 26.4039C10.3495 26.3757 10.4609 26.3628 10.5725 26.3658C10.7443 26.3658 10.9035 26.3658 11.0562 26.3658C11.2089 26.3658 11.3681 26.3658 11.5335 26.3658H12.0618C12.3036 26.3658 12.5328 26.3658 12.7364 26.3658H13.2838C13.3954 26.3624 13.5069 26.3752 13.6147 26.4039C13.7038 26.4039 13.742 26.474 13.742 26.5376C13.7386 26.5842 13.7218 26.6289 13.6936 26.6662C13.6653 26.7035 13.6269 26.7317 13.5829 26.7476L13.2583 26.9195C13.2067 26.9469 13.1637 26.9883 13.1345 27.0389C13.1052 27.0896 13.0908 27.1474 13.0928 27.2059C13.0928 27.2059 13.0928 27.2441 13.0928 27.2695C13.0913 27.2907 13.0913 27.312 13.0928 27.3332C13.0928 27.3713 13.1565 27.4796 13.2138 27.6387C13.271 27.7978 13.3411 27.9887 13.4174 28.186L13.6466 28.7525L13.8057 29.1216C13.863 29.2489 13.9075 29.3125 13.9393 29.3189C13.9711 29.3252 14.0284 29.2616 14.0921 29.1216C14.1557 28.9816 14.2639 28.7143 14.353 28.4851C14.4421 28.256 14.5249 28.0142 14.5949 27.7978L14.7285 27.3459C14.7324 27.3078 14.7324 27.2694 14.7285 27.2313C14.7324 27.1755 14.7215 27.1196 14.697 27.0693C14.6724 27.019 14.635 26.9761 14.5885 26.9449L14.2957 26.7667C14.2529 26.7481 14.2159 26.7181 14.189 26.6799C14.1621 26.6418 14.1461 26.5969 14.143 26.5503C14.143 26.4867 14.1875 26.4421 14.2703 26.4167C14.3782 26.3884 14.4897 26.3755 14.6012 26.3785H15.0786C15.1951 26.3867 15.3121 26.3867 15.4286 26.3785C15.5813 26.3863 15.7342 26.3863 15.8869 26.3785C16.0458 26.3672 16.2053 26.3672 16.3642 26.3785C16.4758 26.3755 16.5872 26.3884 16.6952 26.4167C16.7779 26.4485 16.8224 26.493 16.8224 26.5567C16.8197 26.5952 16.8063 26.6322 16.7839 26.6637C16.7614 26.6951 16.7307 26.7198 16.6952 26.7349C16.5715 26.7999 16.4383 26.845 16.3006 26.8685C16.0519 26.9073 15.815 27.0007 15.6068 27.1422C15.4542 27.2857 15.3234 27.4509 15.2186 27.6323C15.1677 27.7256 15.0913 27.8848 14.9895 28.1096C14.8876 28.3324 14.7858 28.5742 14.6712 28.8352C14.5567 29.0961 14.4676 29.3507 14.3785 29.5798C14.3409 29.683 14.3132 29.7896 14.2957 29.8981C14.274 29.9923 14.274 30.0902 14.2957 30.1845L15.9314 34.385C15.9314 34.4359 15.976 34.455 16.0078 34.4296C16.0527 34.3933 16.0859 34.3446 16.1033 34.2896C16.3706 33.5895 16.6697 32.6984 17.0007 31.6101C17.3316 30.5218 17.6817 29.3698 18.0381 28.1542C18.0711 28.0592 18.0946 27.9611 18.1081 27.8614C18.1167 27.7704 18.1167 27.6788 18.1081 27.5877C18.1115 27.4372 18.0765 27.2882 18.0062 27.155C17.9658 27.0879 17.9113 27.0304 17.8465 26.9864C17.7816 26.9424 17.708 26.9131 17.6307 26.9004C17.5289 26.9004 17.4143 26.8304 17.2934 26.7795C17.1725 26.7285 17.1089 26.6585 17.1089 26.5885C17.1089 26.5185 17.1534 26.4803 17.2361 26.4485C17.3441 26.4202 17.4555 26.4074 17.5671 26.4103H18.1463H18.7127C18.9737 26.4103 19.2282 26.4103 19.4701 26.4103C19.7119 26.4103 19.9347 26.4103 20.1384 26.4103C20.2499 26.4069 20.3614 26.4198 20.4693 26.4485C20.5584 26.4803 20.5966 26.5249 20.5966 26.5885C20.5954 26.6275 20.5826 26.6652 20.56 26.6969C20.5373 26.7286 20.5058 26.7529 20.4693 26.7667C20.3456 26.8317 20.2124 26.8768 20.0747 26.9004C19.8367 26.9515 19.6168 27.0659 19.4383 27.2313C19.2717 27.3854 19.1319 27.5661 19.0246 27.7659C18.9291 27.9632 18.8464 28.1414 18.7827 28.3006L15.976 36.5744C15.9499 36.6489 15.9179 36.7213 15.8805 36.7908C15.8296 36.8926 15.7723 36.9372 15.7214 36.9372C15.6932 36.9326 15.6663 36.9224 15.6422 36.9071C15.6181 36.8918 15.5974 36.8717 15.5814 36.8481C15.5271 36.786 15.484 36.7149 15.4541 36.6381C15.1804 36.0016 14.9386 35.4352 14.7413 34.9324C14.544 34.4296 14.3467 33.9268 14.1621 33.424C13.9775 32.9212 13.7548 32.3548 13.5256 31.7438C13.5256 31.6674 13.4684 31.6356 13.4493 31.6547C13.4069 31.7102 13.3746 31.7726 13.3538 31.8392C13.0992 32.4375 12.8828 32.9721 12.7173 33.4367C12.5519 33.9013 12.3482 34.3723 12.17 34.856C11.9918 35.3397 11.7881 35.8871 11.5654 36.5108C11.5201 36.6226 11.4669 36.7311 11.4062 36.8354C11.3108 36.9181 11.2471 36.969 11.1835 36.969Z" fill="#F1F2F2"/>
<path d="M42.3125 21.4082L41.7651 27.4227C41.8094 27.8825 42.019 28.3106 42.3548 28.6278C42.6907 28.9449 43.1302 29.1296 43.5917 29.1475C45.2529 29.2302 49.4153 29.402 49.4153 29.402L42.3125 21.4082Z" fill="#939598"/>
<path d="M3.18649 56.3926C1.46578 57.0936 0.398311 58.8356 0 59.6587L3.18649 62.1283V56.3926Z" fill="#7E7E7E"/>
<path d="M47.877 56.4707C49.5977 57.1717 50.6652 58.9137 51.0635 59.7369L47.877 62.2064V56.4707Z" fill="#7E7E7E"/>
<path d="M0 98.6115V59.7363L20.5528 75.2705H30.2716L51.0635 59.7363V98.6115H0Z" fill="#C4C4C4"/>
<path d="M2.46953 92.8768L20.6325 75.2715H30.0326C35.37 80.3433 46.5546 90.9649 48.5939 92.8768C50.6333 94.7887 51.0369 97.5503 50.9838 98.6922H0C0.254919 94.9321 1.75257 93.2486 2.46953 92.8768Z" fill="#A8A8A8"/>
</g>
</svg>
</div>
<p>Need to change your request?</p>
<p>Please cancel this request and submit a new one.</p>`;
  }

  if (requestDetail[i].reqImageURL.length > 0) {
    requestDetail[i].reqImageURL.forEach((image) => {
      let showImgRef = storageRef.ref().child(image);
      showImgRef.getMetadata().then((metadata) => {
        document.querySelector(
          ".attachmentSection"
        ).innerHTML += `<div class="attachment">
        <div class="tag">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.13369 9.00928L8.67805 3.46492C9.74353 2.39944 11.4695 2.39944 12.535 3.46492C13.6005 4.5304 13.6005 6.25639 12.535 7.32187L6.50852 13.3483C5.84319 14.0137 4.76325 14.0137 4.09793 13.3483C3.4326 12.683 3.4326 11.6031 4.09793 10.9378L9.16017 5.87551C9.42533 5.61035 9.85924 5.61035 10.1244 5.87551C10.3896 6.14068 10.3896 6.57459 10.1244 6.83975L5.54428 11.4199L6.26746 12.1431L10.8476 7.56293C11.5129 6.89761 11.5129 5.81766 10.8476 5.15234C10.1823 4.48701 9.10231 4.48701 8.43699 5.15234L3.37475 10.2146C2.30927 11.2801 2.30927 13.006 3.37475 14.0715C4.44023 15.137 6.16621 15.137 7.2317 14.0715L13.2582 8.04505C14.7238 6.57941 14.7238 4.20739 13.2582 2.74175C11.7925 1.27611 9.42051 1.27611 7.95487 2.74175L2.41051 8.28611L3.13369 9.00928Z" fill="#4F4F4F"/>
                </svg>
            <p class="attachmentTitle">${metadata.name}</p>
        </div>
    </div>`;
      });
    });
  }
};

/******************************************************************************
      Request Detail view JS ends here
******************************************************************************/

/******************************************************************************
      Booking Detail view JS starts here
******************************************************************************/

//Function to display Booking detail card
displayBookingDetailUI = (i) => {
  const postDate = bookingDetail[i].onDate.toDate();
  const bookDate = bookingDetail[i].bookedFor.toDate();
  document.getElementById(
    "bookingDetail"
  ).innerHTML = `<div class="RequestDetailCard">
  <h3 class="requestTitle">
  ${bookingDetail[i].title}
  </h3>
  <div class="requestDetail">
      <div class="bookingStatusBar"></div>
      <div class="requestInfoMain">
          <p class="booking_date">Booking Date:</p>
          <div class="newBookingCard_time_wrapper">
          <p class="description"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M15.1895 13.916C15.1895 14.6924 14.4696 15.3223 13.5823 15.3223H1.7966C0.90932 15.3223 0.189453 14.6924 0.189453 13.916V5.94727H15.1895V13.916ZM13.0466 8.29102C13.0466 8.0332 12.8055 7.82227 12.5109 7.82227H9.2966C9.00195 7.82227 8.76088 8.0332 8.76088 8.29102V11.1035C8.76088 11.3613 9.00195 11.5723 9.2966 11.5723H12.5109C12.8055 11.5723 13.0466 11.3613 13.0466 11.1035V8.29102ZM1.7966 2.19727H3.40374V0.791016C3.40374 0.533203 3.64481 0.322266 3.93945 0.322266H5.01088C5.30552 0.322266 5.5466 0.533203 5.5466 0.791016V2.19727H9.83231V0.791016C9.83231 0.533203 10.0734 0.322266 10.368 0.322266H11.4395C11.7341 0.322266 11.9752 0.533203 11.9752 0.791016V2.19727H13.5823C14.4696 2.19727 15.1895 2.82715 15.1895 3.60352V5.00977H0.189453V3.60352C0.189453 2.82715 0.90932 2.19727 1.7966 2.19727Z" fill="#4F4F4F"/>
          </svg>&nbsp;${
            months[bookDate.getMonth()]
          } ${bookDate.getDate()}, ${bookDate.getFullYear()}</p>
          </div>
          <br>
          <p class="booking_date">Booking Time:</p>
          <div class="newBookingCard_time_wrapper">
          <p class="description"><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z" fill="#4F4F4F"/>
          </svg>&nbsp;${bookingDetail[i].timeSlot}</p>
          </div>
      </div>
  </div>
  <div class="requestDetailSub">
      <p class="newRequestStatus">${bookingDetail[i].requestStatus}</p>
      <p class="newRequestDate">${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}</p>
  </div>
</div>`;
  document.querySelector(
    ".tipsInfoSectionBooking"
  ).innerHTML = `<div class="illustration">
    <svg width="106" height="99" viewBox="0 0 106 99" fill="none" xmlns="http://www.w3.org/2000/svg">
<g opacity="0.7">
<path d="M59.034 30.7489C59.038 30.7197 59.038 30.6902 59.034 30.661C58.9462 30.19 58.108 25.8711 57.3496 25.7593C56.9424 25.6795 56.8386 26.2223 56.8386 26.7572C56.8352 26.8334 56.8095 26.9068 56.7648 26.9686C56.7201 27.0304 56.6584 27.0778 56.5871 27.1049C56.5159 27.132 56.4383 27.1378 56.3638 27.1214C56.2894 27.105 56.2213 27.0672 56.168 27.0127L54.3558 25.2005C54.2825 25.1343 54.1872 25.0977 54.0884 25.0977C53.9896 25.0977 53.8943 25.1343 53.821 25.2005C53.4269 25.5816 53.1393 26.0591 52.9867 26.5856C52.834 27.1122 52.8217 27.6694 52.9508 28.2022C53.2861 30.693 56.0243 32.8485 56.6949 32.6569C57.3095 32.5331 57.9365 32.4822 58.563 32.5052C58.6595 32.5077 58.7533 32.4738 58.8258 32.4101C58.8983 32.3465 58.9442 32.2579 58.9542 32.1619L59.034 30.7489Z" fill="#E6E7E8"/>
<path d="M93.6099 30.4286C93.6059 30.4021 93.6059 30.3752 93.6099 30.3487C93.6977 29.8777 94.536 25.5588 95.2944 25.447C95.7095 25.3672 95.8053 25.9021 95.8133 26.4449C95.8161 26.5205 95.8413 26.5935 95.8856 26.6548C95.9298 26.7161 95.9913 26.763 96.0621 26.7894C96.133 26.8159 96.21 26.8208 96.2837 26.8035C96.3573 26.7863 96.4242 26.7476 96.4759 26.6924L98.2881 24.8802C98.3614 24.814 98.4567 24.7773 98.5555 24.7773C98.6543 24.7773 98.7496 24.814 98.823 24.8802C99.2184 25.2605 99.5075 25.7376 99.6616 26.2642C99.8156 26.7907 99.8293 27.3484 99.7011 27.8819C99.3578 30.3647 96.6196 32.5282 95.949 32.3286C95.3341 32.2075 94.7071 32.1593 94.0809 32.1849C93.9853 32.1873 93.8924 32.1531 93.8212 32.0893C93.75 32.0255 93.7058 31.9369 93.6977 31.8416L93.6099 30.4286Z" fill="#E6E7E8"/>
<path d="M70.0914 94.9707L70.4825 89.4941L74.0989 89.7416L73.8595 96.0724L69.5645 96.7829L70.0914 94.9707Z" fill="#E6E7E8"/>
<path d="M85.499 94.8791L85.1558 89.9375L88.4369 90.2329L88.7243 95.6136L85.499 94.8791Z" fill="#E6E7E8"/>
<path d="M79.1356 62.2025C81.5732 72.1018 83.2413 82.1748 84.1252 92.3314C84.1252 92.3314 88.3323 93.2175 89.7135 92.3314C89.7135 92.3314 89.6177 75.7981 88.6357 68.7568C88.6357 68.7568 85.9933 50.7545 86.1928 44.9826C86.3924 39.2107 71.6154 45.6692 71.6154 45.6692C71.6154 45.6692 70.3381 83.7254 69.8511 92.044C69.8511 92.044 74.1541 91.549 75.136 92.2356C75.128 92.2356 79.0398 65.6274 79.1356 62.2025Z" fill="#A7A9AC"/>
<path d="M70.1868 93.8457C70.1868 93.8457 64.6624 95.5142 64.2153 96.7835C63.7682 98.0529 64.2153 98.3004 64.2153 98.3004H74.881C74.881 98.3004 75.3759 95.8575 74.881 95.8575C74.7275 95.8539 74.5767 95.817 74.4389 95.7495C74.3011 95.6819 74.1795 95.5854 74.0826 95.4663C74.0826 95.4663 70.562 96.2008 70.4183 95.61C70.3051 95.0272 70.2278 94.438 70.1868 93.8457Z" fill="#808285"/>
<path d="M83.5112 98.6927H89.7062C89.7062 98.6927 89.5785 95.204 88.405 93.8469C87.2314 92.4897 85.4033 94.0624 85.4033 94.0624C85.4033 94.0624 83.9024 95.3318 83.5112 98.6927Z" fill="#808285"/>
<path d="M72.3807 12.7785C73.0273 11.8125 74.5511 6.8334 74.5511 6.8334C74.5511 6.8334 75.3952 5.98936 76.4202 5.62756C77.4451 5.26576 81.2434 5.38632 82.811 7.2554C84.3786 9.12449 82.4973 11.3574 82.4973 11.3574C82.0194 11.0994 81.4836 10.9675 80.9405 10.9742C79.9426 10.9663 79.9426 12.7785 79.9426 12.7785L79.7362 18.1272C79.7362 18.1272 75.4791 18.9042 74.2497 18.4092C73.0203 17.9143 73.2446 13.763 73.2446 13.763C73.2446 13.763 71.734 13.7444 72.3807 12.7785Z" fill="#E6E7E8"/>
<path d="M81.5468 14.3906C83.1435 12.1393 82.2494 10.5826 82.2494 10.5826L80.5569 9.96783L80.501 9.73633L77.1959 17.2486L75.272 20.6574L79.1199 26.3256L82.9998 20.8091L81.5468 14.3906Z" fill="#E6E7E8"/>
<path d="M72.2947 13.623C72.2947 13.5194 72.3664 13.3918 72.4222 13.2324C72.2947 13.4157 72.2628 13.5512 72.2947 13.623Z" fill="#BCBEC0"/>
<path d="M98.7512 30.0851C98.7512 30.0851 94.0411 34.3561 94.0411 29.9014C94.0411 27.1791 92.5242 31.2826 91.231 34.7553C90.7999 29.8136 89.8658 20.9442 89.8658 20.9442C87.6397 19.3264 84.9153 18.5436 82.1699 18.7328C80.9599 19.5532 79.5284 19.9848 78.0665 19.9702C75.8472 19.8425 76.0388 19.3156 76.0388 19.3156C76.0388 19.3156 72.1908 19.7707 71.3446 20.4892C70.4984 21.2076 66.9139 26.756 66.5546 34.3801C66.5546 34.3801 60.0323 31.1868 58.5714 29.8855C58.5714 29.8855 56.0247 29.3586 56.2882 32.5599L64.966 40.9024C64.966 40.9024 67.832 42.9302 69.269 40.3196C70.0325 39.0323 70.623 37.6499 71.0253 36.2082L70.8337 47.1054L71.2887 46.9058C72.7257 46.6424 78.2023 46.6424 80.1582 47.5604C82.1141 48.4785 86.0338 47.9516 86.5448 47.5604C87.0557 47.1693 86.5448 42.0759 86.5448 42.0759C86.5448 42.0759 89.7381 43.2016 90.0734 43.002C90.257 42.9541 98.7512 33.5658 98.7512 30.0851Z" fill="white"/>
<path d="M92.4469 32.9217L91.9089 31.5538C93.1641 33.6983 95.5435 32.974 96.9345 32.143C97.2407 31.9601 97.3807 31.6031 97.2085 31.2908C96.9885 30.8917 96.5674 30.3317 95.8243 29.6866C94.6259 28.6464 94.2277 27.2382 94.1784 26.6642L94.0128 24.8123C94.0028 24.7011 94.0157 24.5892 94.0183 24.4776C94.0277 24.062 93.7853 23.2936 92.7293 22.566C91.6023 21.7896 91.5046 20.9087 91.6111 20.482C91.6274 20.4167 91.6469 20.3523 91.6581 20.2859L91.8216 19.3196C91.8503 19.1499 91.8351 18.9765 91.7766 18.8146C90.9342 16.4819 89.1652 11.64 88.1551 9.07825C87.1079 6.42259 84.9248 4.21742 83.9641 3.4468C83.5878 3.17783 82.2871 2.63435 80.0944 2.61221C78.5162 2.59627 76.7665 4.11974 75.5415 5.52568C75.1902 5.92891 75.6153 6.44896 76.1005 6.22413C76.6746 5.95815 77.3523 6.25182 77.5507 6.85258L79.6753 13.2845C78.9518 19.7959 78.9045 25.1924 81.421 28.9132C82.7041 30.8105 82.6048 33.0011 82.1189 34.7229C81.8714 35.5999 82.6971 36.6448 83.5783 36.4127L91.771 34.2547C92.3498 34.1022 92.6659 33.4788 92.4469 32.9217Z" fill="#BCBEC0"/>
<path d="M3.91534 78.6177L1.51592 22.9791C1.51592 22.9791 1.36954 21.1016 3.57802 21.1016C5.78651 21.1016 42.3125 21.3752 42.3125 21.3752L49.4152 29.3691L47.1367 78.6177H3.91534Z" fill="#A7A9AC"/>
<path d="M42.0136 31.1641H21.6599C21.3119 31.1641 21.0298 31.4462 21.0298 31.7942V32.176C21.0298 32.524 21.3119 32.8061 21.6599 32.8061H42.0136C42.3616 32.8061 42.6437 32.524 42.6437 32.176V31.7942C42.6437 31.4462 42.3616 31.1641 42.0136 31.1641Z" fill="#F1F2F2"/>
<path d="M42.0136 35.0781H21.6599C21.3119 35.0781 21.0298 35.3602 21.0298 35.7082V36.0901C21.0298 36.4381 21.3119 36.7202 21.6599 36.7202H42.0136C42.3616 36.7202 42.6437 36.4381 42.6437 36.0901V35.7082C42.6437 35.3602 42.3616 35.0781 42.0136 35.0781Z" fill="#F1F2F2"/>
<path d="M41.3897 40.7109H9.19796C8.84997 40.7109 8.56787 40.9931 8.56787 41.341V41.7229C8.56787 42.0709 8.84997 42.353 9.19796 42.353H41.3897C41.7376 42.353 42.0198 42.0709 42.0198 41.7229V41.341C42.0198 40.9931 41.7376 40.7109 41.3897 40.7109Z" fill="#F1F2F2"/>
<path d="M41.3897 49.8633H9.19796C8.84997 49.8633 8.56787 50.1454 8.56787 50.4934V50.8752C8.56787 51.2232 8.84997 51.5053 9.19796 51.5053H41.3897C41.7376 51.5053 42.0198 51.2232 42.0198 50.8752V50.4934C42.0198 50.1454 41.7376 49.8633 41.3897 49.8633Z" fill="#F1F2F2"/>
<path d="M41.3897 54.1719H9.19796C8.84997 54.1719 8.56787 54.454 8.56787 54.802V55.1838C8.56787 55.5318 8.84997 55.8139 9.19796 55.8139H41.3897C41.7376 55.8139 42.0198 55.5318 42.0198 55.1838V54.802C42.0198 54.454 41.7376 54.1719 41.3897 54.1719Z" fill="#F1F2F2"/>
<path d="M41.3897 59.4668H9.19796C8.84997 59.4668 8.56787 59.7489 8.56787 60.0969V60.4787C8.56787 60.8267 8.84997 61.1088 9.19796 61.1088H41.3897C41.7376 61.1088 42.0198 60.8267 42.0198 60.4787V60.0969C42.0198 59.7489 41.7376 59.4668 41.3897 59.4668Z" fill="#F1F2F2"/>
<path d="M41.3897 68.8047H9.19796C8.84997 68.8047 8.56787 69.0868 8.56787 69.4348V69.8166C8.56787 70.1646 8.84997 70.4467 9.19796 70.4467H41.3897C41.7376 70.4467 42.0198 70.1646 42.0198 69.8166V69.4348C42.0198 69.0868 41.7376 68.8047 41.3897 68.8047Z" fill="#F1F2F2"/>
<path d="M33.7522 63.4453H9.19796C8.84997 63.4453 8.56787 63.7274 8.56787 64.0754V64.4572C8.56787 64.8052 8.84997 65.0873 9.19796 65.0873H33.7522C34.1002 65.0873 34.3823 64.8052 34.3823 64.4572V64.0754C34.3823 63.7274 34.1002 63.4453 33.7522 63.4453Z" fill="#F1F2F2"/>
<path d="M33.7522 73.5391H9.19796C8.84997 73.5391 8.56787 73.8212 8.56787 74.1691V74.551C8.56787 74.899 8.84997 75.1811 9.19796 75.1811H33.7522C34.1002 75.1811 34.3823 74.899 34.3823 74.551V74.1691C34.3823 73.8212 34.1002 73.5391 33.7522 73.5391Z" fill="#F1F2F2"/>
<path d="M33.7522 44.625H9.19796C8.84997 44.625 8.56787 44.9071 8.56787 45.2551V45.637C8.56787 45.985 8.84997 46.2671 9.19796 46.2671H33.7522C34.1002 46.2671 34.3823 45.985 34.3823 45.637V45.2551C34.3823 44.9071 34.1002 44.625 33.7522 44.625Z" fill="#F1F2F2"/>
<path d="M11.1835 36.969C11.1835 36.969 11.1326 36.9245 11.088 36.829L10.9607 36.5299L7.54299 27.9378C7.43052 27.6865 7.27306 27.4578 7.07838 27.2631C6.88625 27.0831 6.65214 26.954 6.39738 26.8876C6.26311 26.8501 6.13302 26.7989 6.00914 26.7349C5.97221 26.7174 5.94047 26.6906 5.91704 26.6571C5.89361 26.6236 5.87929 26.5847 5.87549 26.544C5.87549 26.4803 5.92004 26.4358 6.00278 26.4039C6.11075 26.3757 6.22217 26.3628 6.33373 26.3658C6.57559 26.3658 6.81107 26.3658 7.02747 26.3658C7.24386 26.3658 7.47935 26.3658 7.74666 26.3658C8.01397 26.3658 8.31946 26.3658 8.58677 26.3658H9.22322C9.33689 26.3628 9.45041 26.3757 9.56054 26.4039C9.64328 26.4039 9.68783 26.474 9.68783 26.5376C9.68579 26.5763 9.67272 26.6137 9.65017 26.6453C9.62762 26.6768 9.59653 26.7013 9.56054 26.7158C9.43222 26.7711 9.3004 26.8179 9.16594 26.8558C9.11022 26.8643 9.05759 26.8869 9.01303 26.9214C8.96848 26.9559 8.93348 27.0013 8.91136 27.0531C8.86764 27.1557 8.84595 27.2663 8.84771 27.3777C8.85652 27.6097 8.89941 27.8392 8.97501 28.0587L9.61145 29.7389C9.81512 30.2481 10.0124 30.7382 10.2097 31.2091C10.407 31.6801 10.6107 32.1575 10.8462 32.6475C11.0817 33.1376 11.3044 33.6849 11.5654 34.2896C11.6163 34.4041 11.6608 34.4614 11.699 34.4487C11.7372 34.4359 11.769 34.3914 11.8008 34.3087L13.0737 31.2473C13.0737 31.1646 13.1247 31.0882 13.1438 31.0309C13.1821 30.9174 13.1821 30.7944 13.1438 30.6809L13.0483 30.42L12.1318 28.1924C11.9971 27.8577 11.7778 27.5639 11.4954 27.3395C11.2389 27.1378 10.9477 26.9847 10.6361 26.8876C10.5019 26.8501 10.3718 26.7989 10.2479 26.7349C10.211 26.7174 10.1792 26.6906 10.1558 26.6571C10.1324 26.6236 10.1181 26.5847 10.1143 26.544C10.1143 26.4803 10.1588 26.4358 10.2415 26.4039C10.3495 26.3757 10.4609 26.3628 10.5725 26.3658C10.7443 26.3658 10.9035 26.3658 11.0562 26.3658C11.2089 26.3658 11.3681 26.3658 11.5335 26.3658H12.0618C12.3036 26.3658 12.5328 26.3658 12.7364 26.3658H13.2838C13.3954 26.3624 13.5069 26.3752 13.6147 26.4039C13.7038 26.4039 13.742 26.474 13.742 26.5376C13.7386 26.5842 13.7218 26.6289 13.6936 26.6662C13.6653 26.7035 13.6269 26.7317 13.5829 26.7476L13.2583 26.9195C13.2067 26.9469 13.1637 26.9883 13.1345 27.0389C13.1052 27.0896 13.0908 27.1474 13.0928 27.2059C13.0928 27.2059 13.0928 27.2441 13.0928 27.2695C13.0913 27.2907 13.0913 27.312 13.0928 27.3332C13.0928 27.3713 13.1565 27.4796 13.2138 27.6387C13.271 27.7978 13.3411 27.9887 13.4174 28.186L13.6466 28.7525L13.8057 29.1216C13.863 29.2489 13.9075 29.3125 13.9393 29.3189C13.9711 29.3252 14.0284 29.2616 14.0921 29.1216C14.1557 28.9816 14.2639 28.7143 14.353 28.4851C14.4421 28.256 14.5249 28.0142 14.5949 27.7978L14.7285 27.3459C14.7324 27.3078 14.7324 27.2694 14.7285 27.2313C14.7324 27.1755 14.7215 27.1196 14.697 27.0693C14.6724 27.019 14.635 26.9761 14.5885 26.9449L14.2957 26.7667C14.2529 26.7481 14.2159 26.7181 14.189 26.6799C14.1621 26.6418 14.1461 26.5969 14.143 26.5503C14.143 26.4867 14.1875 26.4421 14.2703 26.4167C14.3782 26.3884 14.4897 26.3755 14.6012 26.3785H15.0786C15.1951 26.3867 15.3121 26.3867 15.4286 26.3785C15.5813 26.3863 15.7342 26.3863 15.8869 26.3785C16.0458 26.3672 16.2053 26.3672 16.3642 26.3785C16.4758 26.3755 16.5872 26.3884 16.6952 26.4167C16.7779 26.4485 16.8224 26.493 16.8224 26.5567C16.8197 26.5952 16.8063 26.6322 16.7839 26.6637C16.7614 26.6951 16.7307 26.7198 16.6952 26.7349C16.5715 26.7999 16.4383 26.845 16.3006 26.8685C16.0519 26.9073 15.815 27.0007 15.6068 27.1422C15.4542 27.2857 15.3234 27.4509 15.2186 27.6323C15.1677 27.7256 15.0913 27.8848 14.9895 28.1096C14.8876 28.3324 14.7858 28.5742 14.6712 28.8352C14.5567 29.0961 14.4676 29.3507 14.3785 29.5798C14.3409 29.683 14.3132 29.7896 14.2957 29.8981C14.274 29.9923 14.274 30.0902 14.2957 30.1845L15.9314 34.385C15.9314 34.4359 15.976 34.455 16.0078 34.4296C16.0527 34.3933 16.0859 34.3446 16.1033 34.2896C16.3706 33.5895 16.6697 32.6984 17.0007 31.6101C17.3316 30.5218 17.6817 29.3698 18.0381 28.1542C18.0711 28.0592 18.0946 27.9611 18.1081 27.8614C18.1167 27.7704 18.1167 27.6788 18.1081 27.5877C18.1115 27.4372 18.0765 27.2882 18.0062 27.155C17.9658 27.0879 17.9113 27.0304 17.8465 26.9864C17.7816 26.9424 17.708 26.9131 17.6307 26.9004C17.5289 26.9004 17.4143 26.8304 17.2934 26.7795C17.1725 26.7285 17.1089 26.6585 17.1089 26.5885C17.1089 26.5185 17.1534 26.4803 17.2361 26.4485C17.3441 26.4202 17.4555 26.4074 17.5671 26.4103H18.1463H18.7127C18.9737 26.4103 19.2282 26.4103 19.4701 26.4103C19.7119 26.4103 19.9347 26.4103 20.1384 26.4103C20.2499 26.4069 20.3614 26.4198 20.4693 26.4485C20.5584 26.4803 20.5966 26.5249 20.5966 26.5885C20.5954 26.6275 20.5826 26.6652 20.56 26.6969C20.5373 26.7286 20.5058 26.7529 20.4693 26.7667C20.3456 26.8317 20.2124 26.8768 20.0747 26.9004C19.8367 26.9515 19.6168 27.0659 19.4383 27.2313C19.2717 27.3854 19.1319 27.5661 19.0246 27.7659C18.9291 27.9632 18.8464 28.1414 18.7827 28.3006L15.976 36.5744C15.9499 36.6489 15.9179 36.7213 15.8805 36.7908C15.8296 36.8926 15.7723 36.9372 15.7214 36.9372C15.6932 36.9326 15.6663 36.9224 15.6422 36.9071C15.6181 36.8918 15.5974 36.8717 15.5814 36.8481C15.5271 36.786 15.484 36.7149 15.4541 36.6381C15.1804 36.0016 14.9386 35.4352 14.7413 34.9324C14.544 34.4296 14.3467 33.9268 14.1621 33.424C13.9775 32.9212 13.7548 32.3548 13.5256 31.7438C13.5256 31.6674 13.4684 31.6356 13.4493 31.6547C13.4069 31.7102 13.3746 31.7726 13.3538 31.8392C13.0992 32.4375 12.8828 32.9721 12.7173 33.4367C12.5519 33.9013 12.3482 34.3723 12.17 34.856C11.9918 35.3397 11.7881 35.8871 11.5654 36.5108C11.5201 36.6226 11.4669 36.7311 11.4062 36.8354C11.3108 36.9181 11.2471 36.969 11.1835 36.969Z" fill="#F1F2F2"/>
<path d="M42.3125 21.4082L41.7651 27.4227C41.8094 27.8825 42.019 28.3106 42.3548 28.6278C42.6907 28.9449 43.1302 29.1296 43.5917 29.1475C45.2529 29.2302 49.4153 29.402 49.4153 29.402L42.3125 21.4082Z" fill="#939598"/>
<path d="M3.18649 56.3926C1.46578 57.0936 0.398311 58.8356 0 59.6587L3.18649 62.1283V56.3926Z" fill="#7E7E7E"/>
<path d="M47.877 56.4707C49.5977 57.1717 50.6652 58.9137 51.0635 59.7369L47.877 62.2064V56.4707Z" fill="#7E7E7E"/>
<path d="M0 98.6115V59.7363L20.5528 75.2705H30.2716L51.0635 59.7363V98.6115H0Z" fill="#C4C4C4"/>
<path d="M2.46953 92.8768L20.6325 75.2715H30.0326C35.37 80.3433 46.5546 90.9649 48.5939 92.8768C50.6333 94.7887 51.0369 97.5503 50.9838 98.6922H0C0.254919 94.9321 1.75257 93.2486 2.46953 92.8768Z" fill="#A8A8A8"/>
</g>
</svg>
</div>
<p>Need to change your booking?</p>
<p>Please cancel this booking and submit a new one.</p>`;
};

/******************************************************************************
        Booking Detail view JS ends here
******************************************************************************/
