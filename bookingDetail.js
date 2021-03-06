// booking object
let bookingArray = [
  {
    infoType: "Booking",
    title: "Meeting Room Booking",
    submittedDate: "FEB 12, 2021",
    status: "BOOKED",
    bookingDate: "FEB 21, 2021",
    bookingTime: "14:00 - 15:00",
  },
];

//Function to display booking detail card
displayBookingDetailUI = (i) => {
  temp = document.createElement("div");
  temp.classList.add("newRequestCard");
  document.getElementById("bookingDetailCard").appendChild(temp);

  temp = document.createElement("h2");
  temp.classList.add("requestTitle");
  temp.innerText = `${bookingArray[i].title}`;
  document.getElementById("bookingDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestDate");
  temp.innerText = `${bookingArray[i].submittedDate}`;
  document.getElementById("bookingDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("newRequestStatus");
  temp.innerText = `${bookingArray[i].status}`;
  document.getElementById("bookingDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingDate");
  temp.innerText = `${bookingArray[i].bookingDate}`;
  document.getElementById("bookingDetailCard").children[i].appendChild(temp);

  temp = document.createElement("p");
  temp.classList.add("bookingTime");
  temp.innerText = `${bookingArray[i].bookingTime}`;
  document.getElementById("bookingDetailCard").children[i].appendChild(temp);
};

// Display booking object information on card
displayBookingDetailUI(0);