// Alert object
let alertArray = [
    {
      infoType: "Alert",
      title: "Two COVID-19 Cases In Our Building",
      durationDate: "",
      durationTime: "",
      postedDate: "FEB 15, 2021",
      description:
        "Dear Owners/Residents, We were recently notified that there were two new COVID-19 cases in our building. Please continue to wear masks in public areas of the building, follow the social distancing protocols, and protect yourselves from COVID-19. The gym, sauna room, and swimming pool will be temporary closed due to the new COVID-19 outbreak. Should you have any questions, feel free to contact me. Thank you for your attention. Stay safe! Dwight",
    }
  ];

  //Function to display alert detail card
  displayAlertUI = (i) => {
    temp = document.createElement("div");
    temp.classList.add("alertCard");
    document.getElementById("alertDetailCard").appendChild(temp);
  
    temp = document.createElement("h2");
    temp.classList.add("alertCardTitle");
    temp.innerText = `${alertArray[i].title}`;
    document.getElementById("alertDetailCard").children[i].appendChild(temp);
  
    temp = document.createElement("p");
    temp.classList.add("alertPostedDate");
    temp.innerText = `${alertArray[i].postedDate}`;
    document.getElementById("alertDetailCard").children[i].appendChild(temp);
  
    temp = document.createElement("p");
    temp.classList.add("alertDescription");
    temp.innerText = `${alertArray[i].description}`;
    document.getElementById("alertDetailCard").children[i].appendChild(temp);
  };

// Display alert object information on card
displayAlertUI(0);