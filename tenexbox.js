//Booking objects
let bookingArray = [
  {
    infoType: "Booking",
    title: "Meeting Room Booking",
    submittedDate: "MAR 20, 2021",
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
    infoType: "Booking",
    title: "Gym Booking",
    submittedDate: "FEB 09, 2021",
    bookingStatus: "BOOKED",
    bookingDate: "FEB 16, 2021",
    bookingTime: "10:00 - 10:30",
  },
  {
    infoType: "Booking",
    title: "Swimming Pool Booking",
    submittedDate: "FEB 08, 2021",
    bookingStatus: "BOOKED",
    bookingDate: "FEB 23, 2021",
    bookingTime: "10:00 - 10:30",
  },
  {
    infoType: "Booking",
    title: "Gym Booking",
    submittedDate: "JAN 30, 2021",
    bookingStatus: "BOOKED",
    bookingDate: "FEB 16, 2021",
    bookingTime: "10:00 - 10:30",
  },
];

//Request objects
let requestArray = [
  {
    infoType: "Request",
    title: "Roof Garden Re-Open?",
    submittedDate: "MAR 14, 2021",
    requestStatus: "PENDING",
    description:
      "Hi Dwight, Is the roof garden re-opend now? People are now allowed to gather outdoors, so I was wondering if that also applies to the roof garden in our building. Thanks, Michael",
  },
  {
    infoType: "Request",
    title: "Key Fob Price?",
    submittedDate: "FEB 13, 2021",
    requestStatus: "PENDING",
    description:
      "Hi Dwight, I remember you mentioned that I can find the key fob price in the Tenex app. Where can I find that information in the app? Thanks, Michael",
  },
  {
    infoType: "Request",
    title: "Noise Complaint",
    submittedDate: "FEB 10, 2021",
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
  {
    infoType: "Request",
    title: "Corridor Light Bulb Broken",
    submittedDate: "JAN 12, 2021",
    requestStatus: "MESSAGE",
    description:
      "Hi Dwight, One of the light bulb in the corridor on the 11th floor is broken. Please get someon here to replace it. Thanks, Michael",
  },
];

//Variable Declarations
let temp;
let i = 0;
let allArray = bookingArray.concat(requestArray);

//Sort booking and alert cards by submitted date
  allArray.sort((a, b) => {
    return (new Date(b.submittedDate) - new Date(a.submittedDate));
  });

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
  temp.innerText = `SUBMITTED: ${array[i].submittedDate}`;
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
  temp.innerText = `SUBMITTED: ${array[i].submittedDate}`;
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

//Display booking and alert information on cards
for (i = 0; i < allArray.length; i++) {
  if (allArray[i].infoType === "Booking") {
    displayBookingUI(i, allArray);
  } else {
    displayRequestUI(i, allArray);
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
  document.getElementById("searchBarInput").classList.toggle("searchBarExpand");
  document.getElementById("searchBar").classList.toggle("searchBarExpand");
  document.getElementById("headerTitle").classList.toggle("hidden");
});

// Function to filter cards with search input
// displaySearchResultUI = () => {
//   clearRequestsUI();

//   for (i = 0; i < tenexboxArray.length; i++) {
//     for (let property in tenexboxArray[i]) {
//       console.log(tenexboxArray[i][property]);
//     }
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
    document
      .getElementById("bookings_btn")
      .classList.add("activeFilterText");
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
    document.getElementById("bookings_btn").classList.remove("activeFilterText");
    for (i = 0; i < allArray.length; i++) {
      if (allArray[i].infoType === "Booking") {
        displayBookingUI(i, allArray);
      } else {
        displayRequestUI(i, allArray);
      }
    }
  }
});
