// Check if the user is logged in or not
const auth = firebase.auth();
let currUid;

// Variable to store requests from db
let notifications = [];
let bookings = [];
let requests = [];
let recentUpdates = [];

// Notification Detail array
let notifDetail = [];
// Request detail array
let requestDetail = [];
// Booking detail array
let bookingDetail = [];

// Accessing cloud firestore db
const db = firebase.firestore();

// Accessing the firebase storage
let storageRef = firebase.storage();

// To hold selected date
let selected;
let currentSelect;

// Array to store all cards for a date
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

$("#chat_btn").click(function () {
  window.location.pathname = "/chat_with_manager.html";
});

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is logged in");
    currUid = user.uid;
    console.log(currUid);
    sortDisplay(currentSelect);
  } else {
    // No user is signed in.
    console.log("user is not logged in");
    window.location.pathname = "/index.html";
  }
});

document.addEventListener("DOMContentLoaded", function () {
  $("#nav_cal").css("color", "#81B7AE");
  $("#nav_cal > svg").children().css("fill", "#81B7AE");
  $(".body_wrapper_book").addClass("hidden");
  $(".body_wrapper_req").addClass("hidden");
  $(".body_wrapper_notif").addClass("hidden");
  selected = document.getElementById("calendarDate");
  selected.value = new Date().toDateInputValue();
  currentSelect = `${selected.value}`;
  // sortDisplay(currentSelect);

  isOnline();
});

// date picker current date auto fill
Date.prototype.toDateInputValue = function () {
  var local = new Date(this);
  local.setMinutes(this.getMinutes() - this.getTimezoneOffset());
  return local.toJSON().slice(0, 10);
};

$("input[type=date]").change(function () {
  currentDateCards = [];
  document.getElementById("allCards").innerHTML = "";
  currentSelect = `${selected.value}`;
  // loadDB(currentSelect);
  sortDisplay(currentSelect);
});

clearAllUI = () => {
  document.getElementById("allCards").innerHTML = "";
};

// Select the request cards container
let recentCards = document.getElementById("allCards");

// Access all data from db for current user and store objects in array
async function loadDB() {
  // return new Promise(async (resolve) => {
  // On Request status change in db update front end
  await db
    .collection("newRequests")
    .where("ReqUid", "==", currUid)
    .get()
    .then((doc) => {
      requests = [];

      doc.forEach((fields) => {
        requests.push(fields.data());
      });
      // mergeRecentCards();
    });
  console.log(requests);

  // Retreive bookings
  await db
    .collection("bookings")
    .where("BookingUid", "==", currUid)
    .get()
    .then((doc) => {
      bookings = [];

      doc.forEach((fields) => {
        bookings.push(fields.data());
      });
      // mergeRecentCards();
    });
  await db
    .collection("notifications")
    .get()
    .then((doc) => {
      notifications = [];

      doc.forEach((fields) => {
        notifications.push(fields.data());
      });
      // mergeRecentCards();
    });
  mergeRecentCards();
  //   setTimeout(() => {
  //     resolve("resolved");
  //   }, 100);
  // });
}

// Function to display recent cards
function mergeRecentCards() {
  clearAllUI();

  recentUpdates = [];
  requests.forEach((card) => {
    recentUpdates.push(card);
  });
  bookings.forEach((card) => {
    recentUpdates.push(card);
  });
  notifications.forEach((card) => {
    recentUpdates.push(card);
  });
  console.log(recentUpdates);
}
// Sort in reverse chronological order of date and display cards
async function sortDisplay(currentSelect) {
  await loadDB();
  recentUpdates.forEach(function (items) {
    obj = items.onDate;
    // console.log(items.cardType + obj.toDate().getUTCDate());
    if (
      obj.toDate().getFullYear() === new Date(currentSelect).getUTCFullYear() &&
      obj.toDate().getMonth() === new Date(currentSelect).getUTCMonth() &&
      obj.toDate().getDate() === new Date(currentSelect).getUTCDate()
    ) {
      currentDateCards.push(items);
    }
  });

  if (currentDateCards.length > 0) {
    document.querySelector(".no_events").classList.add("hidden");

    currentDateCards.sort(function (a, b) {
      if (a.onDate < b.onDate) return 1;
      if (a.onDate > b.onDate) return -1;
      return 0;
    });
    for (i = 0; i < currentDateCards.length; i++) {
      displayRecenttUI(i);
    }
  } else {
    document.querySelector(".no_events").classList.remove("hidden");
  }
}

function isOnline() {
  if (navigator.onLine) {
    document.getElementById("onlineStatus").classList.add("hidden");
    clearRecentsUI();
  } else {
    document.querySelector(".no_events").classList.add("hidden");
    document.getElementById("onlineStatus").classList.remove("hidden");
    document.getElementById(
      "onlineStatus"
    ).innerHTML = `<div class="offline_events">
          <div class="offline_illustration">
            <svg width="134" height="100" viewBox="0 0 134 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <g opacity="0.7">
              <path d="M76.4675 25.2229H6.64373C2.9745 25.2229 0 28.1974 0 31.8666V92.5769C0 96.2461 2.9745 99.2206 6.64373 99.2206H76.4675C80.1368 99.2206 83.1112 96.2461 83.1112 92.5769V31.8666C83.1112 28.1974 80.1368 25.2229 76.4675 25.2229Z" fill="#A7A9AC"/>
              <path d="M6.99964 25.2229H76.1116C77.968 25.2229 79.7484 25.9604 81.0611 27.273C82.3738 28.5857 83.1112 30.3661 83.1112 32.2226V37.3671H0V32.2226C0 30.3661 0.737462 28.5857 2.05015 27.273C3.36283 25.9604 5.14322 25.2229 6.99964 25.2229Z" fill="#B9B9B9"/>
              <path d="M10.2243 21.3613H10.2135C9.25448 21.3613 8.47705 22.1387 8.47705 23.0977V30.3131C8.47705 31.2721 9.25448 32.0495 10.2135 32.0495H10.2243C11.1833 32.0495 11.9607 31.2721 11.9607 30.3131V23.0977C11.9607 22.1387 11.1833 21.3613 10.2243 21.3613Z" fill="#D1D3D4"/>
              <path d="M17.1813 21.3613H17.1705C16.2115 21.3613 15.4341 22.1387 15.4341 23.0977V30.3131C15.4341 31.2721 16.2115 32.0495 17.1705 32.0495H17.1813C18.1403 32.0495 18.9177 31.2721 18.9177 30.3131V23.0977C18.9177 22.1387 18.1403 21.3613 17.1813 21.3613Z" fill="#D1D3D4"/>
              <path d="M66.5773 21.3613H66.5665C65.6075 21.3613 64.8301 22.1387 64.8301 23.0977V30.3131C64.8301 31.2721 65.6075 32.0495 66.5665 32.0495H66.5773C67.5363 32.0495 68.3137 31.2721 68.3137 30.3131V23.0977C68.3137 22.1387 67.5363 21.3613 66.5773 21.3613Z" fill="#D1D3D4"/>
              <path d="M73.5338 21.3613H73.523C72.564 21.3613 71.7866 22.1387 71.7866 23.0977V30.3131C71.7866 31.2721 72.564 32.0495 73.523 32.0495H73.5338C74.4928 32.0495 75.2703 31.2721 75.2703 30.3131V23.0977C75.2703 22.1387 74.4928 21.3613 73.5338 21.3613Z" fill="#D1D3D4"/>
              <path d="M71.4632 65.7212C69.4002 67.1705 67.9025 69.2894 67.2246 71.7178" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M67.0082 66.5627L70.6428 71.2867C69.7369 71.8044 69.8447 72.4946 68.8417 72.7858C67.8368 73.1056 66.7489 73.0402 65.7895 72.6025C65.2954 72.3315 64.8732 71.9465 64.558 71.4793C64.2428 71.0122 64.0438 70.4766 63.9775 69.917C63.8418 68.7727 64.1379 67.6189 64.808 66.6814C65.249 66.0414 65.8295 65.5098 66.5058 65.1268C67.1821 64.7438 67.9366 64.5193 68.7123 64.4704C69.4904 64.4393 70.2633 64.6109 70.9552 64.9682C71.6472 65.3255 72.2345 65.8564 72.6597 66.5088C73.0617 67.1748 73.2615 67.9432 73.2347 68.7206C73.2079 69.4981 72.9556 70.2509 72.5087 70.8876" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M53.6781 65.7212C51.615 67.1705 50.1173 69.2894 49.4395 71.7178" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M49.2563 66.5627L52.891 71.2867C51.985 71.8044 52.0821 72.4946 51.079 72.7858C50.0741 73.1056 48.9862 73.0402 48.0268 72.6025C47.5355 72.3281 47.1156 71.9421 46.8008 71.4756C46.4861 71.0091 46.2854 70.4753 46.2149 69.917C46.0833 68.7714 46.3832 67.6178 47.0561 66.6814C47.4965 66.0408 48.0769 65.5088 48.7533 65.1258C49.4298 64.7427 50.1845 64.5185 50.9604 64.4704C51.7385 64.4393 52.5114 64.6109 53.2034 64.9682C53.8953 65.3255 54.4826 65.8564 54.9078 66.5088C55.3098 67.1748 55.5096 67.9432 55.4828 68.7206C55.456 69.4981 55.2038 70.2509 54.7568 70.8876" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M35.494 65.7212C33.4309 67.1705 31.9332 69.2894 31.2554 71.7178" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M31.0297 66.5627L34.6644 71.2867C33.7584 71.8044 33.8663 72.4946 32.8632 72.7858C31.8583 73.1056 30.7704 73.0402 29.811 72.6025C29.3171 72.3301 28.8946 71.9448 28.5779 71.4781C28.2612 71.0114 28.0591 70.4765 27.9883 69.917C27.8619 68.7718 28.1613 67.62 28.8296 66.6814C29.2705 66.0414 29.851 65.5098 30.5274 65.1268C31.2037 64.7438 31.9581 64.5193 32.7338 64.4704C33.512 64.4393 34.2848 64.6109 34.9768 64.9682C35.6687 65.3255 36.256 65.8564 36.6812 66.5088C37.0833 67.1748 37.283 67.9432 37.2562 68.7206C37.2294 69.4981 36.9772 70.2509 36.5302 70.8876" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M17.7421 65.7212C15.6794 67.1732 14.179 69.2905 13.4927 71.7178" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M13.2873 66.5628L16.922 71.2867C16.016 71.8044 16.1131 72.4947 15.11 72.7859C14.1051 73.1056 13.0172 73.0403 12.0578 72.6026C11.5665 72.3282 11.1466 71.9421 10.8319 71.4756C10.5171 71.0092 10.3164 70.4753 10.2459 69.917C10.1143 68.7714 10.4142 67.6179 11.0871 66.6815C11.5263 66.0397 12.1065 65.5068 12.7831 65.1236C13.4598 64.7404 14.2152 64.517 14.9914 64.4704C15.7681 64.4391 16.5395 64.6107 17.2298 64.9681C17.9201 65.3255 18.5053 65.8565 18.928 66.5089C19.3343 67.1729 19.5375 67.9412 19.5126 68.7192C19.4876 69.4973 19.2357 70.251 18.7878 70.8877" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M71.4632 82.1584C69.3976 83.6052 67.8992 85.7251 67.2246 88.1551" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M67.0082 83.0105L70.6428 87.7236C69.7369 88.2521 69.8447 88.9424 68.8417 89.2228C67.8388 89.5512 66.749 89.4896 65.7895 89.0503C65.2954 88.7793 64.8732 88.3942 64.558 87.9271C64.2428 87.46 64.0438 86.9243 63.9775 86.3647C63.8418 85.2204 64.1379 84.0666 64.808 83.1292C65.249 82.4891 65.8295 81.9576 66.5058 81.5746C67.1821 81.1916 67.9366 80.9671 68.7123 80.9181C69.4904 80.8871 70.2633 81.0586 70.9552 81.4159C71.6472 81.7732 72.2345 82.3041 72.6597 82.9566C73.0617 83.6225 73.2615 84.391 73.2347 85.1684C73.2079 85.9458 72.9556 86.6987 72.5087 87.3354" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M53.6781 82.1584C51.6124 83.6052 50.114 85.7251 49.4395 88.1551" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M49.2563 83.0105L52.891 87.7236C51.985 88.2521 52.0821 88.9424 51.079 89.2228C50.0761 89.5512 48.9863 89.4896 48.0268 89.0503C47.5355 88.7759 47.1156 88.3898 46.8008 87.9234C46.4861 87.4569 46.2854 86.923 46.2149 86.3647C46.0833 85.2191 46.3832 84.0656 47.0561 83.1292C47.4965 82.4886 48.0769 81.9566 48.7533 81.5735C49.4298 81.1904 50.1845 80.9663 50.9604 80.9181C51.7385 80.8871 52.5114 81.0586 53.2034 81.4159C53.8953 81.7732 54.4826 82.3041 54.9078 82.9566C55.3098 83.6225 55.5096 84.391 55.4828 85.1684C55.456 85.9458 55.2038 86.6987 54.7568 87.3354" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M35.494 82.1584C33.4283 83.6052 31.93 85.7251 31.2554 88.1551" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M31.0297 83.0105L34.6644 87.7236C33.7584 88.2521 33.8663 88.9424 32.8632 89.2228C31.8603 89.5512 30.7705 89.4896 29.811 89.0503C29.3171 88.7778 28.8946 88.3925 28.5779 87.9259C28.2612 87.4592 28.0591 86.9243 27.9883 86.3647C27.8619 85.2195 28.1613 84.0678 28.8296 83.1292C29.2705 82.4891 29.851 81.9576 30.5274 81.5746C31.2037 81.1916 31.9581 80.9671 32.7338 80.9181C33.512 80.8871 34.2848 81.0586 34.9768 81.4159C35.6687 81.7732 36.256 82.3041 36.6812 82.9566C37.0833 83.6225 37.283 84.391 37.2562 85.1684C37.2294 85.9458 36.9772 86.6987 36.5302 87.3354" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M71.4632 49.4463C69.3976 50.893 67.8992 53.0129 67.2246 55.4429" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M67.009 50.2771L70.6436 55.0011C69.7376 55.5295 69.8455 56.2198 68.8424 56.5002C67.8389 56.8234 66.751 56.7618 65.7902 56.3276C65.2948 56.0556 64.8717 55.6689 64.5564 55.1998C64.2412 54.7307 64.043 54.1928 63.9783 53.6313C63.8531 52.5046 64.1489 51.3715 64.8088 50.4497C65.248 49.808 65.8281 49.2751 66.5048 48.8919C67.1814 48.5087 67.9368 48.2853 68.713 48.2387C69.4915 48.2055 70.2652 48.3761 70.9575 48.7336C71.6498 49.0911 72.2368 49.6231 72.6604 50.2771C73.0625 50.9431 73.2622 51.7115 73.2354 52.4889C73.2086 53.2664 72.9564 54.0193 72.5094 54.6559" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M53.6781 49.4463C51.6124 50.893 50.114 53.0129 49.4395 55.4429" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M49.2562 50.2771L52.8908 55.0011C51.9849 55.5295 52.0819 56.2198 51.0789 56.5002C50.0753 56.8234 48.9875 56.7618 48.0267 56.3276C47.534 56.0522 47.1133 55.6645 46.7985 55.1961C46.4836 54.7276 46.2837 54.1915 46.2148 53.6313C46.0937 52.5034 46.3933 51.3704 47.056 50.4497C47.4946 49.8074 48.0746 49.2741 48.7514 48.8908C49.4282 48.5076 50.1838 48.2845 50.9603 48.2387C51.7388 48.2055 52.5124 48.3761 53.2048 48.7336C53.8971 49.0911 54.4841 49.6231 54.9077 50.2771C55.3097 50.9431 55.5095 51.7115 55.4827 52.4889C55.4559 53.2664 55.2037 54.0193 54.7567 54.6559" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M35.494 49.4463C33.4283 50.893 31.93 53.0129 31.2554 55.4429" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M31.0293 50.2771L34.6639 55.0011C33.7579 55.5295 33.8658 56.2198 32.8628 56.5002C31.8592 56.8234 30.7713 56.7618 29.8105 56.3276C29.3153 56.0541 28.892 55.6672 28.5751 55.1986C28.2583 54.7299 28.057 54.1928 27.9878 53.6313C27.8719 52.5037 28.171 51.3726 28.8291 50.4497C29.2683 49.808 29.8484 49.2751 30.5251 48.8919C31.2018 48.5087 31.9571 48.2853 32.7333 48.2387C33.5118 48.2055 34.2855 48.3761 34.9778 48.7336C35.6701 49.0911 36.2571 49.6231 36.6808 50.2771C37.0828 50.9431 37.2826 51.7115 37.2558 52.4889C37.2289 53.2664 36.9767 54.0193 36.5298 54.6559" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M17.7421 82.1584C15.6769 83.6079 14.1758 85.7262 13.4927 88.1551" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M13.2873 83.0105L16.922 87.7237C16.016 88.2522 16.1131 88.9424 15.11 89.2228C14.1071 89.5512 13.0173 89.4897 12.0578 89.0503C11.5665 88.7759 11.1466 88.3899 10.8319 87.9234C10.5171 87.4569 10.3164 86.9231 10.2459 86.3648C10.1143 85.2192 10.4142 84.0656 11.0871 83.1292C11.5263 82.4875 12.1065 81.9546 12.7831 81.5714C13.4598 81.1882 14.2152 80.9648 14.9914 80.9182C15.7681 80.8869 16.5395 81.0584 17.2298 81.4158C17.9201 81.7733 18.5053 82.3043 18.928 82.9566C19.3343 83.6206 19.5375 84.389 19.5126 85.167C19.4876 85.945 19.2357 86.6988 18.7878 87.3354" stroke="#F1F2F2" stroke-miterlimit="10" stroke-linecap="round"/>
              <path d="M91.9183 29.1479C91.9224 29.1179 91.9224 29.0875 91.9183 29.0575C91.8279 28.5727 90.9651 24.1269 90.1844 24.0119C89.7653 23.9297 89.6585 24.4885 89.6585 25.0391C89.6549 25.1175 89.6285 25.1931 89.5825 25.2567C89.5365 25.3203 89.4729 25.369 89.3996 25.397C89.3263 25.4249 89.2464 25.4308 89.1697 25.4139C89.0931 25.3971 89.023 25.3582 88.9682 25.3021L87.1028 23.4367C87.0273 23.3685 86.9292 23.3308 86.8275 23.3308C86.7258 23.3308 86.6277 23.3685 86.5522 23.4367C86.1466 23.829 85.8506 24.3205 85.6935 24.8625C85.5363 25.4044 85.5236 25.9781 85.6565 26.5265C86.0016 29.0904 88.8203 31.3092 89.5106 31.1119C90.1432 30.9846 90.7886 30.9322 91.4335 30.9558C91.5328 30.9584 91.6294 30.9235 91.704 30.858C91.7787 30.7925 91.8258 30.7012 91.8362 30.6024L91.9183 29.1479Z" fill="#E6E7E8"/>
              <path d="M127.509 28.8188C127.505 28.7916 127.505 28.7639 127.509 28.7366C127.6 28.2518 128.463 23.8061 129.243 23.691C129.671 23.6089 129.769 24.1594 129.777 24.7182C129.78 24.796 129.806 24.8712 129.852 24.9343C129.897 24.9974 129.961 25.0456 130.034 25.0729C130.107 25.1001 130.186 25.1051 130.262 25.0874C130.337 25.0696 130.406 25.0298 130.46 24.973L132.325 23.1076C132.4 23.0394 132.499 23.0017 132.6 23.0017C132.702 23.0017 132.8 23.0394 132.875 23.1076C133.283 23.499 133.58 23.9902 133.739 24.5322C133.897 25.0742 133.911 25.6483 133.779 26.1974C133.426 28.7531 130.607 30.9801 129.917 30.7746C129.284 30.65 128.639 30.6004 127.994 30.6267C127.896 30.6292 127.8 30.594 127.727 30.5283C127.654 30.4626 127.608 30.3714 127.6 30.2733L127.509 28.8188Z" fill="#E6E7E8"/>
              <path d="M103.3 95.2586L103.703 89.6213L107.425 89.8761L107.179 96.3927L102.758 97.124L103.3 95.2586Z" fill="#E6E7E8"/>
              <path d="M119.16 95.16L118.807 90.0732L122.184 90.3773L122.48 95.916L119.16 95.16Z" fill="#E6E7E8"/>
              <path d="M112.61 61.5255C115.119 71.7154 116.836 82.0841 117.746 92.5388C117.746 92.5388 122.077 93.451 123.498 92.5388C123.498 92.5388 123.4 75.5202 122.389 68.2722C122.389 68.2722 119.669 49.7415 119.874 43.8001C120.08 37.8588 104.869 44.5068 104.869 44.5068C104.869 44.5068 103.554 83.6802 103.053 92.243C103.053 92.243 107.482 91.7335 108.493 92.4402C108.485 92.4402 112.511 65.0509 112.61 61.5255Z" fill="#A7A9AC"/>
              <path d="M103.399 94.0996C103.399 94.0996 97.7121 95.8171 97.2519 97.1237C96.7917 98.4303 97.2519 98.6851 97.2519 98.6851H108.231C108.231 98.6851 108.74 96.1705 108.231 96.1705C108.073 96.1667 107.917 96.1288 107.776 96.0593C107.634 95.9898 107.509 95.8903 107.409 95.7678C107.409 95.7678 103.785 96.5238 103.637 95.9157C103.521 95.3158 103.441 94.7093 103.399 94.0996Z" fill="#808285"/>
              <path d="M117.114 99.088H123.491C123.491 99.088 123.36 95.4969 122.152 94.0999C120.944 92.7029 119.062 94.3218 119.062 94.3218C119.062 94.3218 117.517 95.6284 117.114 99.088Z" fill="#808285"/>
              <path d="M107.861 5.19331C107.861 5.19331 106.39 10.0828 105.724 11.0771C105.059 12.0715 106.546 11.373 106.546 11.373C106.546 11.373 104.902 15.4818 106.168 15.9913C107.433 16.5008 111.797 16.1556 111.797 16.1556L113.441 10.6498C113.441 10.6498 113.441 8.78442 114.468 8.79263C115.027 8.78571 115.578 8.92148 116.07 9.18709C116.07 9.18709 118.075 7.58464 115.692 6.06438C115.692 6.06438 117.401 4.10858 115.569 2.85128C115.121 2.48902 114.563 2.29138 113.987 2.29138C113.411 2.29138 112.853 2.48902 112.405 2.85128L111.008 2.16923C111.008 2.16923 110.047 -1.64374 106.998 0.94481C103.949 3.53336 107.861 5.19331 107.861 5.19331Z" fill="#E6E7E8"/>
              <path d="M115.092 12.3102C116.735 9.99278 115.815 8.39035 115.815 8.39035L114.073 7.75758L114.015 7.51929L110.613 15.2521L108.633 18.761L112.594 24.5955L116.587 18.9171L115.092 12.3102Z" fill="#E6E7E8"/>
              <path d="M105.568 11.5204C105.568 11.4138 105.642 11.2825 105.7 11.1184C105.568 11.3071 105.536 11.4466 105.568 11.5204Z" fill="#BCBEC0"/>
              <path d="M116.029 6.31117C115.945 6.24592 115.888 6.15162 115.87 6.04675C115.852 5.94187 115.874 5.83397 115.931 5.74415C116.325 5.13605 116.941 3.79656 115.569 2.85153C115.153 2.51643 114.643 2.31966 114.109 2.28873C113.576 2.25779 113.046 2.39422 112.594 2.67897C112.531 2.71744 112.459 2.7378 112.385 2.7378C112.311 2.7378 112.238 2.71744 112.175 2.67897L111.181 2.19413C111.077 2.14443 110.998 2.05581 110.959 1.94759C110.729 1.24087 109.652 -1.33945 106.998 0.887531C103.941 3.47608 107.861 5.16891 107.861 5.16891C108.263 5.41437 108.72 5.5557 109.191 5.58009C109.662 5.60448 110.131 5.51118 110.556 5.30862C110.611 5.28655 110.669 5.27588 110.728 5.2773C110.786 5.27871 110.844 5.29215 110.897 5.31682C110.95 5.34149 110.998 5.37684 111.037 5.42067C111.076 5.4645 111.105 5.51585 111.123 5.57156C111.33 5.96546 111.654 6.28457 112.052 6.48373C112.136 6.54076 112.196 6.62692 112.22 6.72556C112.245 6.82421 112.231 6.92834 112.183 7.01788C112.113 7.21643 112.086 7.42776 112.105 7.63758C112.123 7.84741 112.186 8.05084 112.29 8.23409C112.313 8.28744 112.324 8.3447 112.324 8.40254C112.324 8.46039 112.313 8.51767 112.29 8.57102L111.082 11.8581C111.049 11.9552 110.981 12.0368 110.892 12.0882C110.803 12.1395 110.698 12.157 110.597 12.1375L106.489 11.3157C106.489 11.3157 104.845 15.4245 106.111 15.934C107.138 16.3531 110.433 16.1805 111.444 16.123C111.531 16.1138 111.613 16.0794 111.68 16.0238C111.747 15.9683 111.797 15.8942 111.822 15.8107L113.375 10.6419C113.379 10.6091 113.379 10.576 113.375 10.5432C113.375 10.2392 113.506 8.72714 114.402 8.73536C114.912 8.757 115.406 8.91601 115.832 9.19554C115.879 9.2263 115.932 9.24753 115.987 9.25799C116.042 9.26844 116.099 9.26793 116.153 9.25648C116.208 9.24504 116.261 9.22286 116.307 9.19125C116.353 9.15965 116.393 9.11923 116.424 9.07228C116.583 8.86677 116.7 8.63123 116.767 8.37967C116.834 8.12812 116.849 7.86569 116.812 7.60804C116.775 7.3504 116.687 7.1028 116.553 6.88C116.418 6.65719 116.24 6.46375 116.029 6.31117Z" fill="#BCBEC0"/>
              <path d="M132.801 28.4655C132.801 28.4655 127.953 32.8619 127.953 28.2765C127.953 25.4743 126.391 29.6982 125.06 33.2728C124.616 28.1861 123.655 19.0563 123.655 19.0563C121.363 17.391 118.559 16.5852 115.733 16.7801C114.487 17.6245 113.014 18.0688 111.509 18.0538C109.225 17.9223 109.422 17.3799 109.422 17.3799C109.422 17.3799 105.461 17.8483 104.59 18.5879C103.719 19.3275 100.029 25.0388 99.6593 32.8866C99.6593 32.8866 92.9455 29.5996 91.4417 28.2601C91.4417 28.2601 88.8203 27.7177 89.0915 31.013L98.024 39.6004C98.024 39.6004 100.974 41.6877 102.453 39.0005C103.239 37.6754 103.847 36.2524 104.261 34.7684L104.064 45.9855L104.532 45.7801C106.012 45.5089 111.649 45.5089 113.662 46.4539C115.675 47.3989 119.71 46.8566 120.236 46.4539C120.762 46.0512 120.236 40.8084 120.236 40.8084C120.236 40.8084 123.523 41.9671 123.868 41.7616C124.057 41.7123 132.801 32.0484 132.801 28.4655Z" fill="white"/>
              </g>
              </svg>
          </div>
          <p>Sorry!! You are offline </p>
        </div>`;
  }
}

clearNotifDetailUI = () => {
  document.getElementById("notifDetail").innerHTML = "";
};

//Function to display recent cards - notifications and bookings
displayRecenttUI = (i) => {
  if (currentDateCards[i].cardType === "Notification") {
    temp = document.createElement("div");
    temp.setAttribute("data-number", `${currentDateCards[i].notifID}`);
    temp.classList.add("notifCard");
    recentCards.appendChild(temp);

    temp = document.createElement("div");
    temp.classList.add("notifCard_wrapper");
    recentCards.children[i].appendChild(temp);

    temp = document.createElement("div");
    temp.classList.add("notifCard_content_wrapper");
    recentCards.children[i].children[0].appendChild(temp);

    temp = document.createElement("h3");
    temp.classList.add("notifCard_title");
    temp.innerText = `${currentDateCards[i].notifHead}`;
    recentCards.children[i].children[0].children[0].appendChild(temp);

    temp = document.createElement("p");
    temp.classList.add("notif_excerpt");
    temp.innerText = `${currentDateCards[i].description}`;
    recentCards.children[i].children[0].children[0].appendChild(temp);

    temp = document.createElement("div");
    temp.classList.add("notifCard_duration_date_wrapper");
    recentCards.children[i].children[0].children[0].appendChild(temp);

    temp = document.createElement("p");
    temp.classList.add("notifCard_duration_date");
    const postDurationStartDate = currentDateCards[i].startDate.toDate();
    const postDurationEndDate = currentDateCards[i].endDate.toDate();
    temp.innerHTML = `<svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M15 13.5938C15 14.3701 14.2801 15 13.3929 15H1.60714C0.719867 15 0 14.3701 0 13.5938V5.625H15V13.5938ZM12.8571 7.96875C12.8571 7.71094 12.6161 7.5 12.3214 7.5H9.10714C8.8125 7.5 8.57143 7.71094 8.57143 7.96875V10.7812C8.57143 11.0391 8.8125 11.25 9.10714 11.25H12.3214C12.6161 11.25 12.8571 11.0391 12.8571 10.7812V7.96875ZM1.60714 1.875H3.21429V0.46875C3.21429 0.210938 3.45536 0 3.75 0H4.82143C5.11607 0 5.35714 0.210938 5.35714 0.46875V1.875H9.64286V0.46875C9.64286 0.210938 9.88393 0 10.1786 0H11.25C11.5446 0 11.7857 0.210938 11.7857 0.46875V1.875H13.3929C14.2801 1.875 15 2.50488 15 3.28125V4.6875H0V3.28125C0 2.50488 0.719867 1.875 1.60714 1.875Z" fill="#4F4F4F"/>
  </svg> ${
    months[postDurationStartDate.getMonth()]
  } ${postDurationStartDate.getDay()}, ${postDurationStartDate.getFullYear()} - ${
      months[postDurationEndDate.getMonth()]
    } ${postDurationEndDate.getDay()}, ${postDurationEndDate.getFullYear()}`;
    recentCards.children[i].children[0].children[0].children[2].appendChild(
      temp
    );

    temp = document.createElement("div");
    temp.classList.add("notifCard_duration_time_wrapper");
    recentCards.children[i].children[0].children[0].appendChild(temp);

    temp = document.createElement("p");
    temp.classList.add("notifCard_duration_time");
    temp.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z" fill="#4F4F4F"/>
  </svg> 14:00 - 15:00`;
    recentCards.children[i].children[0].children[0].children[3].appendChild(
      temp
    );

    temp = document.createElement("div");
    temp.classList.add("notifCard_date_wrapper");
    recentCards.children[i].children[0].appendChild(temp);

    temp = document.createElement("div");
    temp.classList.add("notif_icon");
    temp.innerHTML = `<svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path opacity="0.8" d="M27.67 27.4179C26.7596 26.4842 26.25 25.2316 26.25 23.9274V16.3462C26.25 10.9174 23.65 6.3017 19.0623 4.57725C18.3438 4.30718 17.8125 3.65218 17.8125 2.88462C17.8125 1.28846 16.5562 0 15 0C13.4438 0 12.1875 1.28846 12.1875 2.88462C12.1875 3.65205 11.656 4.30685 10.9372 4.57567C6.33537 6.29666 3.75 10.8984 3.75 16.3462V23.9274C3.75 25.2316 3.24044 26.4842 2.33 27.4179L0.388219 29.4095C0.139311 29.6648 0 30.0072 0 30.3638C0 31.1188 0.612013 31.7308 1.36697 31.7308H28.633C29.388 31.7308 30 31.1188 30 30.3638C30 30.0072 29.8607 29.6648 29.6118 29.4095L27.67 27.4179ZM16.875 24.0865C16.875 25.1221 16.0355 25.9615 15 25.9615C13.9645 25.9615 13.125 25.1221 13.125 24.0865V23.9904C13.125 22.9549 13.9645 22.1154 15 22.1154C16.0355 22.1154 16.875 22.9549 16.875 23.9904V24.0865ZM16.875 16.3942C16.875 17.4298 16.0355 18.2692 15 18.2692C13.9645 18.2692 13.125 17.4298 13.125 16.3942V12.4519C13.125 11.4164 13.9645 10.5769 15 10.5769C16.0355 10.5769 16.875 11.4164 16.875 12.4519V16.3942ZM15 37.5C15.7679 37.5 16.4839 37.2601 17.0801 36.8497C18.7861 35.6754 17.0711 33.6538 15 33.6538C12.9289 33.6538 11.2082 35.6787 12.9149 36.8519C13.51 37.2609 14.2265 37.5 15 37.5Z" fill="#81B7AE"/>
</svg>`;
    recentCards.children[i].children[0].children[1].appendChild(temp);

    temp = document.createElement("p");
    const postDate = currentDateCards[i].onDate.toDate();
    temp.innerHTML = `${
      months[postDate.getMonth()]
    } ${postDate.getDate()}, ${postDate.getFullYear()}`;
    recentCards.children[i].children[0].children[1].appendChild(temp);
  } else {
    temp = document.createElement("div");
    if (currentDateCards[i].cardType === "Booking") {
      temp.setAttribute("data-number", `${currentDateCards[i].bookingID}`);
    } else {
      temp.setAttribute("data-number", `${currentDateCards[i].requestID}`);
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
    if (currentDateCards[i].requestStatus === "SENT") {
      temp.classList.add("requestStatusBar");
      temp.innerHTML = `<div class="statusProgressSent"></div>`;
    } else if (currentDateCards[i].requestStatus === "READ") {
      temp.classList.add("requestStatusBar");
      temp.innerHTML = `<div class="statusProgressRead"></div>`;
    } else if (currentDateCards[i].requestStatus === "REJECTED") {
      temp.classList.add("requestStatusBar");
      temp.innerHTML = `<div class="statusProgressRejected"></div>`;
    } else if (currentDateCards[i].requestStatus === "MESSAGE") {
      temp.classList.add("requestStatusBar");
      temp.innerHTML = `<div class="statusProgressMessage"></div>`;
    } else if (currentDateCards[i].requestStatus === "COMPLETED") {
      temp.classList.add("requestStatusBar");
      temp.innerHTML = `<div class="statusProgressCompleted"></div>`;
    } else if (currentDateCards[i].requestStatus === "BOOKED") {
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
    temp.innerText = `${currentDateCards[i].title}`;
    recentCards.children[i].children[0].children[0].children[1].appendChild(
      temp
    );

    if (currentDateCards[i].cardType === "Booking") {
      temp = document.createElement("div");
      temp.classList.add("newBookingCard_time_wrapper");
      recentCards.children[i].children[0].children[0].children[1].appendChild(
        temp
      );

      temp = document.createElement("p");
      temp.classList.add("newBookingCard_time");
      temp.innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.38672 0.921875C12.5299 0.921875 15.8867 4.27873 15.8867 8.42188C15.8867 12.565 12.5299 15.9219 8.38672 15.9219C4.24357 15.9219 0.886719 12.565 0.886719 8.42188C0.886719 4.27873 4.24357 0.921875 8.38672 0.921875ZM5.58964 10.3876L6.19448 11.1436C6.23417 11.1933 6.28325 11.2346 6.33891 11.2653C6.39458 11.2959 6.45573 11.3153 6.51889 11.3223C6.58205 11.3293 6.64597 11.3239 6.70701 11.3062C6.76804 11.2885 6.825 11.259 6.87462 11.2193L8.90083 9.71562C9.04241 9.60227 9.15668 9.45854 9.2352 9.29506C9.31373 9.13158 9.35448 8.95253 9.35446 8.77117V4.06704C9.35446 3.93871 9.30348 3.81563 9.21274 3.72489C9.12199 3.63414 8.99892 3.58317 8.87059 3.58317H7.90285C7.77452 3.58317 7.65144 3.63414 7.5607 3.72489C7.46996 3.81563 7.41898 3.93871 7.41898 4.06704V8.42188L5.66494 9.70716C5.6153 9.74687 5.57397 9.79599 5.54331 9.85169C5.51265 9.90738 5.49327 9.96858 5.48628 10.0318C5.47929 10.095 5.48482 10.1589 5.50255 10.22C5.52029 10.281 5.54988 10.338 5.58964 10.3876Z" fill="#4F4F4F"/>
    </svg> ${currentDateCards[i].timeSlot}`;
      recentCards.children[
        i
      ].children[0].children[0].children[1].children[1].appendChild(temp);
    } else {
      temp = document.createElement("p");
      temp.classList.add("newRequestCard_excerpt");
      temp.innerText = `${currentDateCards[i].description}`;
      recentCards.children[i].children[0].children[0].children[1].appendChild(
        temp
      );
    }

    temp = document.createElement("p");
    temp.classList.add("newRequestCard_status");
    temp.innerText = `${currentDateCards[i].requestStatus}`;
    recentCards.children[i].children[0].children[0].appendChild(temp);

    temp = document.createElement("div");
    temp.classList.add("newRequestCard_date_wrapper");
    recentCards.children[i].children[0].appendChild(temp);

    temp = document.createElement("div");
    temp.classList.add("newRequest_logo");
    recentCards.children[i].children[0].children[1].appendChild(temp);
    if (currentDateCards[i].requestStatus !== "REJECTED") {
      if (currentDateCards[i].ReqCategory === "Service") {
        temp.innerHTML = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27.5" cy="27.5" r="27.5" fill="#FDAE46"/>
      <path d="M11.8844 21.9399C11.8844 21.9399 1.98501 23.7841 5.92781 33.5606C5.92781 33.5606 7.3947 38.3004 14.4875 38.4276C14.4875 38.4276 16.6158 37.639 16.6497 36.1849C16.6794 34.7265 16.7133 24.6066 16.7133 24.6066C16.7133 24.6066 17.7732 16.2801 25.7351 15.305C25.7351 15.305 32.5439 14.1815 36.0245 19.8583C36.0245 19.8583 37.8815 22.2621 37.7331 26.5059L37.7628 36.1976C37.7628 36.1976 37.8772 37.8765 35.749 38.7159C35.749 38.7159 34.9307 39.161 33.7649 39.1738C33.7649 39.1738 32.7262 37.1981 29.8856 37.5585C27.0451 37.9188 26.3965 40.7424 26.3965 40.7424C26.3965 40.7424 25.8496 44.3503 28.6011 45.2575C28.6011 45.2575 30.2842 46.5676 32.8703 44.8929L33.5359 44.3672C33.5359 44.3672 38.4538 44.257 40.7983 41.408C40.7983 41.408 42.35 39.7715 42.6637 38.0376C42.6637 38.0376 47.0178 37.3041 48.6712 33.1832C48.6712 33.1832 50.791 29.126 47.8614 25.2552C47.8614 25.2552 45.3431 21.8297 42.35 21.8381C42.35 21.8381 41.8879 18.8365 39.7893 16.2504C39.7893 16.2504 36.7326 11.8327 31.0218 10.4337C25.3111 9.03463 20.3593 11.4681 20.3593 11.4681C20.3593 11.4681 16.6878 13.4395 14.8267 15.9918C12.9655 18.544 12.6518 19.6166 11.8844 21.9399Z" fill="white"/>
      </svg>`;
      } else if (currentDateCards[i].ReqCategory === "Complaint") {
        temp.innerHTML = `<svg width="55" height="55" viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="27.5" cy="27.5" r="27.5" fill="#FDAE46"/>
      <path d="M11.8844 21.9399C11.8844 21.9399 1.98501 23.7841 5.92781 33.5606C5.92781 33.5606 7.3947 38.3004 14.4875 38.4276C14.4875 38.4276 16.6158 37.639 16.6497 36.1849C16.6794 34.7265 16.7133 24.6066 16.7133 24.6066C16.7133 24.6066 17.7732 16.2801 25.7351 15.305C25.7351 15.305 32.5439 14.1815 36.0245 19.8583C36.0245 19.8583 37.8815 22.2621 37.7331 26.5059L37.7628 36.1976C37.7628 36.1976 37.8772 37.8765 35.749 38.7159C35.749 38.7159 34.9307 39.161 33.7649 39.1738C33.7649 39.1738 32.7262 37.1981 29.8856 37.5585C27.0451 37.9188 26.3965 40.7424 26.3965 40.7424C26.3965 40.7424 25.8496 44.3503 28.6011 45.2575C28.6011 45.2575 30.2842 46.5676 32.8703 44.8929L33.5359 44.3672C33.5359 44.3672 38.4538 44.257 40.7983 41.408C40.7983 41.408 42.35 39.7715 42.6637 38.0376C42.6637 38.0376 47.0178 37.3041 48.6712 33.1832C48.6712 33.1832 50.791 29.126 47.8614 25.2552C47.8614 25.2552 45.3431 21.8297 42.35 21.8381C42.35 21.8381 41.8879 18.8365 39.7893 16.2504C39.7893 16.2504 36.7326 11.8327 31.0218 10.4337C25.3111 9.03463 20.3593 11.4681 20.3593 11.4681C20.3593 11.4681 16.6878 13.4395 14.8267 15.9918C12.9655 18.544 12.6518 19.6166 11.8844 21.9399Z" fill="white"/>
      </svg>`;
      } else if (currentDateCards[i].requestStatus === "BOOKED") {
        temp.innerHTML = `<svg width="56" height="60" viewBox="0 0 56 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M49.6904 5.45455H48.9404C47.8359 5.45455 46.9404 4.55911 46.9404 3.45455V2C46.9404 0.895431 46.045 0 44.9404 0H43.4404C42.3359 0 41.4404 0.895431 41.4404 2V3.45455C41.4404 4.55911 40.545 5.45455 39.4404 5.45455H15.9404C14.8359 5.45455 13.9404 4.55911 13.9404 3.45455V2C13.9404 0.895431 13.045 0 11.9404 0H10.4404C9.33586 0 8.44043 0.895431 8.44043 2V3.45455C8.44043 4.55911 7.545 5.45455 6.44043 5.45455H5.69043C2.66543 5.45455 0.19043 7.90909 0.19043 10.9091V54.5455C0.19043 57.5455 2.66543 60 5.69043 60H49.6904C52.7154 60 55.1904 57.5455 55.1904 54.5455V10.9091C55.1904 7.90909 52.7154 5.45455 49.6904 5.45455ZM49.6904 52.5455C49.6904 53.65 48.795 54.5455 47.6904 54.5455H7.69043C6.58586 54.5455 5.69043 53.65 5.69043 52.5455V17.2747C5.69043 16.1702 6.58586 15.2747 7.69043 15.2747H47.6904C48.795 15.2747 49.6904 16.1702 49.6904 17.2747V52.5455Z" fill="#4980C1"/>
      </svg>`;

        temp = document.createElement("div");
        temp.classList.add("newBookingCard_date_for");
        const bookedFor = currentDateCards[i].bookedFor.toDate();
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
    const postDate = currentDateCards[i].onDate.toDate();
    if (currentDateCards[i].requestStatus === "BOOKED") {
      temp.innerText = `${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}`;
    } else {
      temp.innerText = `${
        months[postDate.getMonth()]
      } ${postDate.getDate()}, ${postDate.getFullYear()}`;
    }
    recentCards.children[i].children[0].children[1].appendChild(temp);
  }
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

/******************************************************************************
        Different Cards Detail view JS starts here
******************************************************************************/
// Back button
$(".back_btn").click(function () {
  $(".body_wrapper_notif").addClass("hidden");
  $(".body_wrapper_req").addClass("hidden");
  $(".body_wrapper_book").addClass("hidden");
  $(".body_wrapper_calendar").removeClass("hidden");
  clearNotifDetailUI();
});

// Navigating to card details page

document.onclick = function (e) {
  notifDetail = [];
  requestDetail = [];
  bookingDetail = [];
  cardID = undefined;
  if (e.target.closest(".notifCard") != undefined) {
    cardID = e.target.closest(".notifCard").getAttribute("data-number");
  } else if (e.target.closest(".newRequestCard") != undefined) {
    cardID = e.target.closest(".newRequestCard").getAttribute("data-number");
  } else {
    cardID = undefined;
  }

  if (cardID) {
    if (cardID.includes("notif")) {
      $(".body_wrapper_calendar").addClass("hidden");
      $(".body_wrapper_req").addClass("hidden");
      $(".body_wrapper_book").addClass("hidden");
      $(".body_wrapper_notif").removeClass("hidden");
      notifDetail.push(
        notifications.find((element) => element.notifID === cardID)
      );
      displayNotifDetailUI(0);
    } else if (cardID.includes("book")) {
      $(".body_wrapper_calendar").addClass("hidden");
      $(".body_wrapper_req").addClass("hidden");
      $(".body_wrapper_notif").addClass("hidden");
      $(".body_wrapper_book").removeClass("hidden");
      bookingDetail.push(
        recentUpdates.find((element) => element.bookingID === cardID)
      );
      displayBookingDetailUI(0);
    } else if (cardID.includes("request")) {
      $(".body_wrapper_calendar").addClass("hidden");
      $(".body_wrapper_notif").addClass("hidden");
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
                    } ${postDurationStartDate.getDay()}, ${postDurationStartDate.getFullYear()} - ${
    months[postDurationEndDate.getMonth()]
  } ${postDurationEndDate.getDay()}, ${postDurationEndDate.getFullYear()}</p>
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
      } ${postDate.getDay()}, ${postDate.getFullYear()}</p>
  </div>
</div>`;
};

/******************************************************************************
      Notification Detail view JS ends here
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
      "#requestDetail .requestStatusBar"
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
      "#requestDetail .requestStatusBar"
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
      "#requestDetail .requestStatusBar"
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
      "#requestDetail .requestStatusBar"
    ).innerHTML = `<div class="statusProgressRejected"></div>`;
  } else if (requestDetail[i].requestStatus === "MESSAGE") {
    document.querySelector(
      "#requestDetail .requestStatusBar"
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
      "#requestDetail .requestStatusBar"
    ).innerHTML = `<div class="statusProgressBooked"></div>`;
  } else {
    document.querySelector(
      "#requestDetail .requestStatusBar"
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
