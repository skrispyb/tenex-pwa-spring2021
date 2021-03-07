//Request objects
let tenexboxArray = [
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
  {
    infoType: "Request",
    title: "Key Fob Price?",
    submittedDate: "FEB 10, 2021",
    requestStatus: "PENDING",
    description:
      "Hi Dwight, I remember you mentioned that I can find the key fob price in the Tenex app. Where can I find that information in the app? Thanks, Michael",
  },
  {
    infoType: "Request",
    title: "Noise Complaint",
    submittedDate: "FEB 05, 2021",
    requestStatus: "REJECTED",
    description:
      "Hi Dwight, My neighbor has been playing the drums non-stop during the day. It's too loud. I can't focus on my work. Please ask him/her to stop. Thanks, Michael",
  },
  {
    infoType: "Request",
    title: "Building Corridor Maintenance",
    submittedDate: "FEB 01, 2021",
    requestStatus: "MESSAGE",
    description:
      "Hi Dwight, The building corridor, especially on my floor, is getting a little too dirty. Please ask the cleaning crew to clean the building corridor more often. Thanks, Michael",
  },
];

//Variable Declarations
let temp;
let i = 0;

//Function to display booking cards
displayBookingUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("requestCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${tenexboxArray[i].title}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  temp.innerText = `${tenexboxArray[i].submittedDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  temp.innerText = `${tenexboxArray[i].bookingStatus}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDate");
  temp.innerText = `${tenexboxArray[i].bookingDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingTime");
  temp.innerText = `${tenexboxArray[i].bookingTime}`;
  document.getElementById("requestCards").children[i].appendChild(temp);
};

//Function to display request cards
displayRequestUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("requestCards").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${tenexboxArray[i].title}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  temp.innerText = `${tenexboxArray[i].submittedDate}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  temp.innerText = `${tenexboxArray[i].requestStatus}`;
  document.getElementById("requestCards").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestExerpt");
  temp.innerText = `${tenexboxArray[i].description}`;
  document.getElementById("requestCards").children[i].appendChild(temp);
};

// Display notification object information on cards
for (i = 0; i < tenexboxArray.length; i++) {
  if (tenexboxArray[i].infoType === "Booking") {
    displayBookingUI(i);
  } else {
    displayRequestUI(i);
  }
}

//Function to clear notification archive cards
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
  document
    .getElementById("searchBarInput")
    .classList.toggle("searchBarExpand");
  document.getElementById("searchBar").classList.toggle("searchBarExpand");
  document.getElementById("headerTitle").classList.toggle("hidden");
});

// Function to filter cards with search input
displaySearchResultUI = () => {
  clearRequestsUI();

  for (i = 0; i < tenexboxArray.length; i++) {
      for (let property in tenexboxArray[i]) {
          console.log(tenexboxArray[i][property]);
      }
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
  }
};


// Navigating through pages

$("#nav_home").click(function() {
  window.location.pathname = "/notificationHome.html";
});
$("#nav_cal").click(function() {
  window.location.pathname = "/calendar.html";
});
// $("#nav_more").click(function() {
//   window.location.pathname = "/more.html";
// });
