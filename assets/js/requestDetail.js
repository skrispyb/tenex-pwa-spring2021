// Check if the user is logged in or not
const auth = firebase.auth();

window.addEventListener("load", function () {

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

// request object
let requestArray = [
    {
        infoType: "Request",
        title: "Key Fob Price?",
        submittedDate: "FEB 10, 2021",
        requestStatus: "PENDING",
        description:
          "Hi Dwight, I remember you mentioned that I can find the key fob price in the Tenex app. Where can I find that information in the app? Thanks, Michael"
    }
  ];
  
  //Function to display request detail card
  displayRequestDetailUI = (i) => {
    temp = document.createElement("div");
    temp.classList.add("newRequestCard");
    document.getElementById("requestDetailCard").appendChild(temp);
  
    temp = document.createElement("h2");
    temp.classList.add("requestTitle");
    temp.innerText = `${requestArray[i].title}`;
    document.getElementById("requestDetailCard").children[i].appendChild(temp);
  
    temp = document.createElement("p");
    temp.classList.add("newRequestDate");
    temp.innerText = `${requestArray[i].submittedDate}`;
    document.getElementById("requestDetailCard").children[i].appendChild(temp);
  
    temp = document.createElement("p");
    temp.classList.add("newRequestStatus");
    temp.innerText = `${requestArray[i].requestStatus}`;
    document.getElementById("requestDetailCard").children[i].appendChild(temp);
  
    temp = document.createElement("p");
    temp.classList.add("description");
    temp.innerText = `${requestArray[i].description}`;
    document.getElementById("requestDetailCard").children[i].appendChild(temp);
  };
  
  // Display request object information on card
  displayRequestDetailUI(0);