// Nofitication object
let notifArray = [
  {
    infoType: "Notification",
    title: "Elevator Under Maintenance",
    durationDate: "FEB 21, 2021 - FEB 22, 2021",
    durationTime: "14:00 - 15:00",
    description:
      "Dear Owners/Residents, Elevator A will be out of service on February 21st (Sunday) and 22nd (Monday) due to maintenance from 14:00 to 15:00. Please plan your day accordingly. Apologies in advance for any inconveniences this will be causing. Regards, Dwight",
  },
];

//Function to display notification detail card
displayNotifDetailUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("notificationCard");
  document.getElementById("notifDetailCard").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("notificationCardTitle");
  temp.innerText = `${notifArray[i].title}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationDuration");
  temp.innerText = `${notifArray[i].durationDate}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("notificationDuration");
  temp.innerText = `${notifArray[i].durationTime}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("description");
  temp.innerText = `${notifArray[i].description}`;
  document.getElementById("notifDetailCard").children[i].appendChild(temp);
};

// Display notification object information on card
displayNotifDetailUI(0);
