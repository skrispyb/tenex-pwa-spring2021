// Back button
$("#back_btn").click(function goBack() {
  window.history.back();
});

// Nofitication objects
let notifArray = [
  {
    infoType: "Notification",
    title: "Elevator Under Maintenance",
    durationDate: "FEB 21, 2021 - FEB 22, 2021",
    durationTime: "14:00 - 15:00",
    description:
      "Dear Owners/Residents, Elevator A will be out of service on February 21st (Sunday) and 22nd (Monday) due to maintenance from 14:00 to 15:00. Please plan your day accordingly. Apologies in advance for any inconveniences this will be causing. Regards, Dwight",
  },
  {
    infoType: "Notification",
    title: "Building Exterior Cleaning",
    durationDate: "FEB 22, 2021 - FEB 25, 2021",
    durationTime: "10:00 - 16:00",
    description:
      "Dear Owners/Residents, We will be cleaning the exterior of the building from February 22nd (Monday) to 25th (Thursday) from 10:00 to 16:00 on each day. Please ensure that all your windows are closed during those times. Feel free to reach out to me if you have any questions or concerns. Regards, Dwight",
  },
  {
    infoType: "Alert",
    title: "Two COVID-19 Cases In Our Building",
    durationDate: "",
    durationTime: "",
    onDate: "FEB 15, 2021",
    description:
      "Dear Owners/Residents, We were recently notified that there were two new COVID-19 cases in our building. Please continue to wear masks in public areas of the building, follow the social distancing protocols, and protect yourselves from COVID-19. The gym, sauna room, and swimming pool will be temporary closed due to the new COVID-19 outbreak. Should you have any questions, feel free to contact me. Thank you for your attention. Stay safe! Dwight",
  },
  {
    infoType: "Alert",
    title: "One COVID-19 Case In Our Building",
    durationDate: "",
    durationTime: "",
    onDate: "JAN 02, 2021",
    description:
      "Dear Owners/Residents, We were recently notified that there was one new COVID-19 cases in our building. Please continue to wear masks in public areas of the building, follow the social distancing protocols, and protect yourselves from COVID-19. The gym, sauna room, and swimming pool will be temporary closed due to the new COVID-19 outbreak. Should you have any questions, feel free to contact me. Thank you for your attention. Stay safe! Dwight",
  },
];

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
  document.getElementById("back_btn").classList.toggle("hidden");
});

//Variable Declarations
let temp;
let alertChildNum = 0;
let i = 0;

//Function to display notifcation cards
displayNotifUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("notificationCard");
  document.getElementById("notifCard").appendChild(temp);

  temp = document.createElement("h2");
  temp.innerText = `${notifArray[i].title}`;
  document.getElementById("notifCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationDuration");
  temp.innerText = `${notifArray[i].durationDate}`;
  document.getElementById("notifCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationDuration");
  temp.innerText = `${notifArray[i].durationTime}`;
  document.getElementById("notifCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationExerpt");
  temp.innerText = `${notifArray[i].description}`;
  document.getElementById("notifCard").children[i].appendChild(temp);
};

//Function to display alert cards
displayAlertUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("alertCard");
  document.getElementById("notifCard").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("alertCardTitle");
  temp.innerText = `${notifArray[i].title}`;
  document.getElementById("notifCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alertonDate");
  temp.innerText = `${notifArray[i].onDate}`;
  document.getElementById("notifCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("alertExerpt");
  temp.innerText = `${notifArray[i].description}`;
  document.getElementById("notifCard").children[i].appendChild(temp);

  // alertChildNum++;
  // console.log(alertChildNum);
};

//Function to clear notification archive cards
clearArchiveUI = () => {
  document.getElementById("notifCard").innerHTML = "";
};

// Display notification object information on cards
for (i = 0; i < notifArray.length; i++) {
  if (notifArray[i].infoType === "Notification") {
    displayNotifUI(i);
  } else {
    displayAlertUI(i);
  }
}

//Toggle to show only alert cards
// document.getElementById("alert_btn").addEventListener("click", function () {
//   document
//     .getElementById("alert_btn")
//     .classList.toggle("activeFilterBackground");
//   document
//     .getElementById("alert_btn")
//     .children[0].children[0].classList.toggle("activeFilterIcon");

//   clearArchiveUI();

//   alertChildNum = 0;

//   for (i = 0; i < notifArray.length; i++) {
//     if (notifArray[i].infoType === "Alert") {
//       displayAlertUI(alertChildNum, i);
//       console.log("i inside for loop is : " + i);
//     }
//   }
// });
