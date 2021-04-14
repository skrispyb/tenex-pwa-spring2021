// Back button
$("#back_btn").click(function goBack() {
  window.history.back();
});

// Access firestore db
const db = firebase.firestore();

// Check if the user is logged in or not
const auth = firebase.auth();

window.addEventListener("load", function () {
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

// Alerts
let alerts = [];
// Nofitications
let notifications = [];
// Array to store both arrays
let allCards = [];

// Detail view array
let alertDetail = [];
let notifDetail = [];

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

// On status change in db update front end for notifications
db.collection("notifications").onSnapshot((doc) => {
  notifications = [];
  doc.forEach((fields) => {
    notifications.push(fields.data());
  });
  mergeNotifAlertCards();
});

db.collection("alerts").onSnapshot((doc) => {
  alerts = [];
  doc.forEach((fields) => {
    alerts.push(fields.data());
  });
  mergeNotifAlertCards();
});

// Function to display recent cards
function mergeNotifAlertCards() {
  clearAllUI();

  allCards = [];
  notifications.forEach((card) => {
    allCards.push(card);
  });
  alerts.forEach((card) => {
    allCards.push(card);
  });
  // Sorting array latest posted first
  allCards.sort(function (a, b) {
    if (a.statusChangeTime < b.statusChangeTime) return 1;
    if (a.statusChangeTime > b.statusChangeTime) return -1;
    return 0;
  });
  for (i = 0; i < allCards.length; i++) {
    displayAllUI(i);
  }
}

notifAlertCards = document.getElementById("notifAlertCards");

clearAllUI = () => {
  notifAlertCards.innerHTML = "";
};

clearAlertDetailUI = () => {
  document.getElementById("alertDetail").innerHTML = "";
};

clearNotifDetailUI = () => {
  document.getElementById("notifDetail").innerHTML = "";
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
  document.getElementById("back_btn").classList.toggle("hidden");
});

//Function to display notifcation cards
displayAllUI = (i) => {
  if (allCards[i].cardType === "Notification") {
    if (allCards[i].endDate) {
      const postDurationStartDate = allCards[i].startDate.toDate();
      const postDurationEndDate = allCards[i].endDate.toDate();
      const postDate = allCards[i].onDate.toDate();
      notifAlertCards.innerHTML += `<div class="notifCardArchive" data-number="${
        allCards[i].notifID
      }">
    <div class="notifCard_wrapper">
      <div class="notifCard_content_wrapper">
        <h3 class="notifCard_title">${allCards[i].notifHead}</h3>
        <p class="notif_excerpt">${allCards[i].description}</p>
        <div class="notifCard_duration_date_wrapper">
          <p class="notifCard_duration_date">
            <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 13.5938C15 14.3701 14.2801 15 13.3929 15H1.60714C0.719867 15 0 14.3701 0 13.5938V5.625H15V13.5938ZM12.8571 7.96875C12.8571 7.71094 12.6161 7.5 12.3214 7.5H9.10714C8.8125 7.5 8.57143 7.71094 8.57143 7.96875V10.7812C8.57143 11.0391 8.8125 11.25 9.10714 11.25H12.3214C12.6161 11.25 12.8571 11.0391 12.8571 10.7812V7.96875ZM1.60714 1.875H3.21429V0.46875C3.21429 0.210938 3.45536 0 3.75 0H4.82143C5.11607 0 5.35714 0.210938 5.35714 0.46875V1.875H9.64286V0.46875C9.64286 0.210938 9.88393 0 10.1786 0H11.25C11.5446 0 11.7857 0.210938 11.7857 0.46875V1.875H13.3929C14.2801 1.875 15 2.50488 15 3.28125V4.6875H0V3.28125C0 2.50488 0.719867 1.875 1.60714 1.875Z" fill="#4F4F4F"></path>
              </svg> ${
                months[postDurationStartDate.getMonth()]
              } ${postDurationStartDate.getDate()}, ${postDurationStartDate.getFullYear()} - ${
        months[postDurationEndDate.getMonth()]
      } ${postDurationEndDate.getDate()}, ${postDurationEndDate.getFullYear()}</p>
        </div>
        <div class="notifCard_duration_time_wrapper">
          <p class="notifCard_duration_time">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z" fill="#4F4F4F"></path>
              </svg>
              ${allCards[i].timeSlot}
          </p>
        </div>
      </div>
      <div class="notifCard_date_wrapper">
        <div class="notif_icon">
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.8" d="M27.67 27.4179C26.7596 26.4842 26.25 25.2316 26.25 23.9274V16.3462C26.25 10.9174 23.65 6.3017 19.0623 4.57725C18.3438 4.30718 17.8125 3.65218 17.8125 2.88462C17.8125 1.28846 16.5562 0 15 0C13.4438 0 12.1875 1.28846 12.1875 2.88462C12.1875 3.65205 11.656 4.30685 10.9372 4.57567C6.33537 6.29666 3.75 10.8984 3.75 16.3462V23.9274C3.75 25.2316 3.24044 26.4842 2.33 27.4179L0.388219 29.4095C0.139311 29.6648 0 30.0072 0 30.3638C0 31.1188 0.612013 31.7308 1.36697 31.7308H28.633C29.388 31.7308 30 31.1188 30 30.3638C30 30.0072 29.8607 29.6648 29.6118 29.4095L27.67 27.4179ZM16.875 24.0865C16.875 25.1221 16.0355 25.9615 15 25.9615C13.9645 25.9615 13.125 25.1221 13.125 24.0865V23.9904C13.125 22.9549 13.9645 22.1154 15 22.1154C16.0355 22.1154 16.875 22.9549 16.875 23.9904V24.0865ZM16.875 16.3942C16.875 17.4298 16.0355 18.2692 15 18.2692C13.9645 18.2692 13.125 17.4298 13.125 16.3942V12.4519C13.125 11.4164 13.9645 10.5769 15 10.5769C16.0355 10.5769 16.875 11.4164 16.875 12.4519V16.3942ZM15 37.5C15.7679 37.5 16.4839 37.2601 17.0801 36.8497C18.7861 35.6754 17.0711 33.6538 15 33.6538C12.9289 33.6538 11.2082 35.6787 12.9149 36.8519C13.51 37.2609 14.2265 37.5 15 37.5Z" fill="#81B7AE"></path>
          </svg>
        </div>
        <p>${
          months[postDate.getMonth()]
        } ${postDate.getDate()}, ${postDate.getFullYear()}</p>
      </div>
    </div>
  </div>`;
    } else {
      const postDate = allCards[i].onDate.toDate();
      notifAlertCards.innerHTML += `<div class="notifCardArchive" data-number="${
        allCards[i].notifID
      }">
  <div class="notifCard_wrapper">
    <div class="notifCard_content_wrapper">
      <h3 class="notifCard_title">${allCards[i].notifHead}</h3>
      <p class="notif_excerpt_long">${allCards[i].description}</p>
    </div>
    <div class="notifCard_date_wrapper">
      <div class="notif_icon">
        <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path opacity="0.8" d="M27.67 27.4179C26.7596 26.4842 26.25 25.2316 26.25 23.9274V16.3462C26.25 10.9174 23.65 6.3017 19.0623 4.57725C18.3438 4.30718 17.8125 3.65218 17.8125 2.88462C17.8125 1.28846 16.5562 0 15 0C13.4438 0 12.1875 1.28846 12.1875 2.88462C12.1875 3.65205 11.656 4.30685 10.9372 4.57567C6.33537 6.29666 3.75 10.8984 3.75 16.3462V23.9274C3.75 25.2316 3.24044 26.4842 2.33 27.4179L0.388219 29.4095C0.139311 29.6648 0 30.0072 0 30.3638C0 31.1188 0.612013 31.7308 1.36697 31.7308H28.633C29.388 31.7308 30 31.1188 30 30.3638C30 30.0072 29.8607 29.6648 29.6118 29.4095L27.67 27.4179ZM16.875 24.0865C16.875 25.1221 16.0355 25.9615 15 25.9615C13.9645 25.9615 13.125 25.1221 13.125 24.0865V23.9904C13.125 22.9549 13.9645 22.1154 15 22.1154C16.0355 22.1154 16.875 22.9549 16.875 23.9904V24.0865ZM16.875 16.3942C16.875 17.4298 16.0355 18.2692 15 18.2692C13.9645 18.2692 13.125 17.4298 13.125 16.3942V12.4519C13.125 11.4164 13.9645 10.5769 15 10.5769C16.0355 10.5769 16.875 11.4164 16.875 12.4519V16.3942ZM15 37.5C15.7679 37.5 16.4839 37.2601 17.0801 36.8497C18.7861 35.6754 17.0711 33.6538 15 33.6538C12.9289 33.6538 11.2082 35.6787 12.9149 36.8519C13.51 37.2609 14.2265 37.5 15 37.5Z" fill="#81B7AE"></path>
        </svg>
      </div>
      <p>${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}</p>
    </div>
  </div>
</div>`;
    }
  } else {
    const postDate = allCards[i].onDate.toDate();
    notifAlertCards.innerHTML += `<div class="alertCardArchive" data-number="${
      allCards[i].alertID
    }">
  <div class="notifCard_wrapper">
    <div class="notifCard_content_wrapper">
      <h3 class="notifCard_title">${allCards[i].alertHead}</h3>
      <p class="alert_excerpt">${allCards[i].description}</p>
    </div>
    <div class="alertCard_date_wrapper">
                    <div class="alert_icon">
                      <svg width="35" height="30" viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0.877258 28.4961C0.488375 29.1628 0.969246 30 1.74104 30H33.259C34.0308 30 34.5116 29.1628 34.1227 28.4961L18.3638 1.48077C17.9779 0.81926 17.0221 0.819258 16.6362 1.48076L0.877258 28.4961ZM19.0909 24.2632C19.0909 24.8154 18.6432 25.2632 18.0909 25.2632H16.9091C16.3568 25.2632 15.9091 24.8154 15.9091 24.2632V23.1053C15.9091 22.553 16.3568 22.1053 16.9091 22.1053H18.0909C18.6432 22.1053 19.0909 22.553 19.0909 23.1053V24.2632ZM19.0909 17.9474C19.0909 18.4997 18.6432 18.9474 18.0909 18.9474H16.9091C16.3568 18.9474 15.9091 18.4997 15.9091 17.9474V13.6316C15.9091 13.0793 16.3568 12.6316 16.9091 12.6316H18.0909C18.6432 12.6316 19.0909 13.0793 19.0909 13.6316V17.9474Z" fill="#BE0707"></path>
                      </svg>
                    </div>
      <p>${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}</p>
    </div>
  </div>
</div>`;
  }
};

// Tag filtering
document.getElementById("alert_btn").addEventListener("click", function () {
  clearAllUI();
  if (
    !document
      .getElementById("alert_btn")
      .classList.contains("activeFilterAlert")
  ) {
    document
      .getElementById("alert_btn")
      .classList.add("activeFilterAlert");
    document
      .getElementById("notif_btn")
      .classList.remove("activeFilterNotif");
    allCards = [];
    alerts.forEach((card) => {
      allCards.push(card);
    });
    allCards.sort(function (a, b) {
      if (a.statusChangeTime < b.statusChangeTime) return 1;
      if (a.statusChangeTime > b.statusChangeTime) return -1;
      return 0;
    });
    let recentsLength = allCards.length;
    for (i = 0; i < recentsLength; i++) {
      displayAllUI(i);
    }
  } else {
    document
      .getElementById("alert_btn")
      .classList.remove("activeFilterAlert");
      mergeNotifAlertCards();
  }
});

document.getElementById("notif_btn").addEventListener("click", function () {
  clearAllUI();
  if (
    !document
      .getElementById("notif_btn")
      .classList.contains("activeFilterNotif")
  ) {
    document
      .getElementById("notif_btn")
      .classList.add("activeFilterNotif");
    document
      .getElementById("alert_btn")
      .classList.remove("activeFilterAlert");
    allCards = [];
    notifications.forEach((card) => {
      allCards.push(card);
    });
    allCards.sort(function (a, b) {
      if (a.statusChangeTime < b.statusChangeTime) return 1;
      if (a.statusChangeTime > b.statusChangeTime) return -1;
      return 0;
    });
    let recentsLength = allCards.length;
    for (i = 0; i < recentsLength; i++) {
      displayAllUI(i);
    }
  } else {
    document
      .getElementById("notif_btn")
      .classList.remove("activeFilterNotif");
      mergeNotifAlertCards();
  }
});


/******************************************************************************
        Different Cards Detail view JS starts here
******************************************************************************/
// Back button
$(".back_btn").click(function () {
  $(".body_wrapper_alert").addClass("hidden");
  $(".body_wrapper_notif").addClass("hidden");
  $(".body_wrapper_archive").removeClass("hidden");
  clearAlertDetailUI();
  clearNotifDetailUI();
});

// Navigating to card details page
let cardID;

document.onclick = function (e) {
  alertDetail = [];
  notifDetail = [];
  cardID = undefined;
  if (e.target.closest(".alertCardArchive") != undefined) {
    cardID = e.target.closest(".alertCardArchive").getAttribute("data-number");
  } else if (e.target.closest(".notifCardArchive") != undefined) {
    cardID = e.target.closest(".notifCardArchive").getAttribute("data-number");
  } else {
    cardID = undefined;
  }

  if (cardID) {
    if (cardID.includes("alert")) {
      $(".body_wrapper_archive").addClass("hidden");
      $(".body_wrapper_notif").addClass("hidden");
      $(".body_wrapper_alert").removeClass("hidden");
      alertDetail.push(alerts.find((element) => element.alertID === cardID));
      displayAlertDetailUI(0);
    } else if (cardID.includes("notif")) {
      $(".body_wrapper_archive").addClass("hidden");
      $(".body_wrapper_alert").addClass("hidden");
      $(".body_wrapper_notif").removeClass("hidden");
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
  const postDate = alerts[i].onDate.toDate();
  document.getElementById(
    "alertDetail"
  ).innerHTML = `<div class="detailCard">            
  <div class="alertHeader">
      <h3 class="alertDetailCardTitle">
      ${alertDetail[0].alertHead}
      </h3>
      <div class="alertIcon">
          <svg width="35" height="30" viewBox="0 0 35 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M0.877258 28.4961C0.488375 29.1628 0.969246 30 1.74104 30H33.259C34.0308 30 34.5116 29.1628 34.1227 28.4961L18.3638 1.48077C17.9779 0.81926 17.0221 0.819258 16.6362 1.48076L0.877258 28.4961ZM19.0909 24.2632C19.0909 24.8154 18.6432 25.2632 18.0909 25.2632H16.9091C16.3568 25.2632 15.9091 24.8154 15.9091 24.2632V23.1053C15.9091 22.553 16.3568 22.1053 16.9091 22.1053H18.0909C18.6432 22.1053 19.0909 22.553 19.0909 23.1053V24.2632ZM19.0909 17.9474C19.0909 18.4997 18.6432 18.9474 18.0909 18.9474H16.9091C16.3568 18.9474 15.9091 18.4997 15.9091 17.9474V13.6316C15.9091 13.0793 16.3568 12.6316 16.9091 12.6316H18.0909C18.6432 12.6316 19.0909 13.0793 19.0909 13.6316V17.9474Z"
                  fill="#BE0707" />
          </svg>
      </div>
  </div>
  <div class="alertDetail_wrapper">
      <div class="alertStatusBar">
      </div>
      <div class="requestInfoMain">
          <p class="alertDetailDescription">${alertDetail[i].description}</p>
      </div>
  </div>
  <div class="alertDetailSub">
      <p class="alertDetailPostedDate">${months[postDate.getMonth()]} ${postDate.getDate()}, ${postDate.getFullYear()}</p>
  </div>
</div>`;
};

/******************************************************************************
      Alert Detail view JS ends here
******************************************************************************/

/******************************************************************************
      Notification Detail view JS starts here
******************************************************************************/

//Function to display notification detail card
displayNotifDetailUI = (i) => {
  const postDurationStartDate = notifications[i].startDate.toDate();
  const postDurationEndDate = notifications[i].endDate.toDate();
  const postDate = notifications[i].onDate.toDate();

  document.getElementById(
    "notifDetail"
  ).innerHTML = `<div class="notifDetailCard">
  <div class="notificationHeader">
      <h3 class="notifDetailCardTitle">
      ${notifDetail[i].notifHead}
      </h3>
      <div class="notificationIcon">
          <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path opacity="0.8"
                  d="M27.67 27.4179C26.7596 26.4842 26.25 25.2316 26.25 23.9274V16.3462C26.25 10.9174 23.65 6.3017 19.0623 4.57725C18.3438 4.30718 17.8125 3.65218 17.8125 2.88462C17.8125 1.28846 16.5562 0 15 0C13.4438 0 12.1875 1.28846 12.1875 2.88462C12.1875 3.65205 11.656 4.30685 10.9372 4.57567C6.33537 6.29666 3.75 10.8984 3.75 16.3462V23.9274C3.75 25.2316 3.24044 26.4842 2.33 27.4179L0.388219 29.4095C0.139311 29.6648 0 30.0072 0 30.3638C0 31.1188 0.612013 31.7308 1.36697 31.7308H28.633C29.388 31.7308 30 31.1188 30 30.3638C30 30.0072 29.8607 29.6648 29.6118 29.4095L27.67 27.4179ZM16.875 24.0865C16.875 25.1221 16.0355 25.9615 15 25.9615C13.9645 25.9615 13.125 25.1221 13.125 24.0865V23.9904C13.125 22.9549 13.9645 22.1154 15 22.1154C16.0355 22.1154 16.875 22.9549 16.875 23.9904V24.0865ZM16.875 16.3942C16.875 17.4298 16.0355 18.2692 15 18.2692C13.9645 18.2692 13.125 17.4298 13.125 16.3942V12.4519C13.125 11.4164 13.9645 10.5769 15 10.5769C16.0355 10.5769 16.875 11.4164 16.875 12.4519V16.3942ZM15 37.5C15.7679 37.5 16.4839 37.2601 17.0801 36.8497C18.7861 35.6754 17.0711 33.6538 15 33.6538C12.9289 33.6538 11.2082 35.6787 12.9149 36.8519C13.51 37.2609 14.2265 37.5 15 37.5Z"
                  fill="#81B7AE" />
          </svg>
      </div>
  </div>
  <div class="notificationDetail">
      <div class="notificationStatusBar">
      </div>
      <div class="requestInfoMain">
          <p class="notifDetaildescription">${notifDetail[i].description}</p>
          <div class="notificationDuration">
              <div class="tag">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.1895 13.916C15.1895 14.6924 14.4696 15.3223 13.5823 15.3223H1.7966C0.90932 15.3223 0.189453 14.6924 0.189453 13.916V5.94727H15.1895V13.916ZM13.0466 8.29102C13.0466 8.0332 12.8055 7.82227 12.5109 7.82227H9.2966C9.00195 7.82227 8.76088 8.0332 8.76088 8.29102V11.1035C8.76088 11.3613 9.00195 11.5723 9.2966 11.5723H12.5109C12.8055 11.5723 13.0466 11.3613 13.0466 11.1035V8.29102ZM1.7966 2.19727H3.40374V0.791016C3.40374 0.533203 3.64481 0.322266 3.93945 0.322266H5.01088C5.30552 0.322266 5.5466 0.533203 5.5466 0.791016V2.19727H9.83231V0.791016C9.83231 0.533203 10.0734 0.322266 10.368 0.322266H11.4395C11.7341 0.322266 11.9752 0.533203 11.9752 0.791016V2.19727H13.5823C14.4696 2.19727 15.1895 2.82715 15.1895 3.60352V5.00977H0.189453V3.60352C0.189453 2.82715 0.90932 2.19727 1.7966 2.19727Z" fill="#4F4F4F"/>
                    </svg>
                    <p class="notificationDate">${
                      months[postDurationStartDate.getMonth()]
                    } ${postDurationStartDate.getDate()}, ${postDurationStartDate.getFullYear()} - ${
    months[postDurationEndDate.getMonth()]
  } ${postDurationEndDate.getDate()}, ${postDurationEndDate.getFullYear()}</p>
                </div>
              <div class="tag">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                          d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z"
                          fill="#4F4F4F" />
                  </svg>
                  <p class="notificationTime">14:00 - 15:00</p>
              </div>
          </div>
      </div>
  </div>
  <div class="notificationDetailSub">
      <p class="notifDetailPostedDate">${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}</p>
  </div>
</div>`;
};

/******************************************************************************
      Notification Detail view JS ends here
******************************************************************************/
