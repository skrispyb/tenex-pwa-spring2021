// Back button
$("#back_btn").click(function goBack() {
  window.history.back();
});

// Check if the user is logged in or not
const auth = firebase.auth();

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is logged in");
  } else {
    // No user is signed in.
    console.log("user is not logged in");
    window.location.pathname = "/index.html";
  }
});

window.addEventListener("DOMContentLoaded", function () {
  $("#nav_home").css("color", "white");
  $("#nav_home > svg").children().css("fill", "white");
  $(".acknowledgement_container").addClass("hidden");
  $(".body_wrapper_alert").addClass("hidden");
  $(".body_wrapper_notif").addClass("hidden");
});

class NewReq {
  constructor(category, subCategory, description, date, userID, Rid, RimgURL) {
    this.ReqCategory = category;
    this.title = subCategory;
    this.description = description;
    this.onDate = date;
    this.ReqUid = userID;
    this.cardType = "Request";
    this.requestStatus = "SENT";
    this.requestID = Rid;
    this.statusChangeTime = date;
    this.reqImageURL = RimgURL;
  }
}

// Accessing cloud firestore db to find request number
const db = firebase.firestore();

let len;
function DBCall() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(
        db
          .collection("newRequests")
          .get()
          .then((doc) => {
            len = doc.docs.length;
            len++;
          })
      );
    }, 300);
  });
}

let reqCat;
let reqSub;
let reqDesc;
let reqImage;
let reqImgURL = [];

document
  .getElementById("option_service")
  .addEventListener("click", function () {
    document.getElementById("option_service").style.backgroundColor = "#DCEBE9";
    reqCat = "Service";
    document.querySelector(".options_content_wrapper").classList.add("hidden");
    document.querySelector(".options_subject").classList.remove("hidden");
    document.querySelector(
      ".progress_content"
    ).children[0].children[0].innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.58203" cy="8.14453" r="7.5" fill="#6FCF97"/>
    </svg>`;
    document.querySelector(
      ".progress_content"
    ).children[1].children[0].innerHTML = `<svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7.58203"
      cy="8.14453"
      r="6"
      fill="#F4F4F4"
      stroke="#333333"
      stroke-width="3"
    />
  </svg>`;
    document.querySelector(
      ".step1"
    ).innerHTML = `<svg width="3" height="33" viewBox="0 0 3 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.83521 1.29297V31.3335" stroke="#6FCF97" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
    document
      .querySelector(".progress_content")
      .children[1].classList.add("reqForm_current");
  });

document
  .getElementById("option_complaint")
  .addEventListener("click", function () {
    document.getElementById("option_complaint").style.backgroundColor =
      "#DCEBE9";
    reqCat = "Complaint";
    document.querySelector(".options_content_wrapper").classList.add("hidden");
    document.querySelector(".options_subject").classList.remove("hidden");
    document.querySelector(
      ".progress_content"
    ).children[0].children[0].innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.58203" cy="8.14453" r="7.5" fill="#6FCF97"/>
    </svg>`;
    document.querySelector(
      ".progress_content"
    ).children[1].children[0].innerHTML = `<svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7.58203"
      cy="8.14453"
      r="6"
      fill="#F4F4F4"
      stroke="#333333"
      stroke-width="3"
    />
  </svg>`;
    document.querySelector(
      ".step1"
    ).innerHTML = `<svg width="3" height="33" viewBox="0 0 3 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.83521 1.29297V31.3335" stroke="#6FCF97" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
    document
      .querySelector(".progress_content")
      .children[1].classList.add("reqForm_current");
  });

document
  .getElementById("option_general")
  .addEventListener("click", function () {
    document.getElementById("option_general").style.backgroundColor = "#DCEBE9";
    reqCat = "General";
    document.querySelector(".options_content_wrapper").classList.add("hidden");
    document.querySelector(".options_subject").classList.remove("hidden");
    document.querySelector(
      ".progress_content"
    ).children[0].children[0].innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.58203" cy="8.14453" r="7.5" fill="#6FCF97"/>
    </svg>`;
    document.querySelector(
      ".progress_content"
    ).children[1].children[0].innerHTML = `<svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7.58203"
      cy="8.14453"
      r="6"
      fill="#F4F4F4"
      stroke="#333333"
      stroke-width="3"
    />
  </svg>`;
    document.querySelector(
      ".step1"
    ).innerHTML = `<svg width="3" height="33" viewBox="0 0 3 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.83521 1.29297V31.3335" stroke="#6FCF97" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
    document
      .querySelector(".progress_content")
      .children[1].classList.add("reqForm_current");
  });

document
  .querySelector(".newReq_subject_input")
  .addEventListener("keyup", function () {
    if (document.querySelector(".newReq_subject_input").value !== "") {
      document
        .querySelector(".newReq_subject_submit")
        .classList.remove("hidden");
    } else {
      document.querySelector(".newReq_subject_submit").classList.add("hidden");
    }
  });

document
  .querySelector(".newReq_subject_submit")
  .addEventListener("click", function () {
    reqSub = document.querySelector(".newReq_subject_input").value;
    document.querySelector(".options_subject").classList.add("hidden");
    document.querySelector(".options_desciption").classList.remove("hidden");
    document.querySelector(
      ".progress_content"
    ).children[1].children[0].innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7.58203" cy="8.14453" r="7.5" fill="#6FCF97"/>
    </svg>`;
    document.querySelector(
      ".progress_content"
    ).children[2].children[0].innerHTML = `<svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="7.58203"
      cy="8.14453"
      r="6"
      fill="#F4F4F4"
      stroke="#333333"
      stroke-width="3"
    />
  </svg>`;
    document.querySelector(
      ".step2"
    ).innerHTML = `<svg width="3" height="33" viewBox="0 0 3 33" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M1.83521 1.29297V31.3335" stroke="#6FCF97" stroke-width="2" stroke-linecap="round"/>
  </svg>`;
    document
      .querySelector(".progress_content")
      .children[2].classList.add("reqForm_current");
  });

document
  .querySelector(".newReq_description_input")
  .addEventListener("keyup", function () {
    if (document.querySelector(".newReq_description_input").textLength > 0) {
      document.querySelector(".options_attachment").classList.remove("hidden");
      document.querySelector(
        ".sendRequest_btn"
      ).innerHTML = `<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d)">
      <path d="M5.67063 26.0078L27.6602 15.0078L5.67063 4.00781L5.66016 12.5634L21.3744 15.0078L5.66016 17.4523L5.67063 26.0078Z" fill="#6FCF97"/>
      <path d="M4.67063 26.009L4.67261 27.6252L6.11802 26.9022L28.1075 15.9022L29.8954 15.0078L28.1075 14.1135L6.11802 3.11347L4.67261 2.39042L4.67063 4.00659L4.66016 12.5621L4.65911 13.4197L5.50645 13.5515L14.8686 15.0078L5.50645 16.4641L4.65911 16.5959L4.66016 17.4535L4.67063 26.009Z" stroke="white" stroke-width="2"/>
      </g>
      <defs>
      <filter id="filter0_d" x="0.658203" y="0.773438" width="34.4725" height="34.4696" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
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
      document.querySelector(".sendRequest_btn").removeAttribute("disabled");
    } else {
      document.querySelector(".options_attachment").classList.add("hidden");
    }
  });

document
  .querySelector(".attachment_btn")
  .addEventListener("click", function () {
    reqDesc = document.querySelector(".newReq_description_input").value;
    document.querySelector(".options_desciption").classList.add("hidden");
    document.querySelector(".options_attachment").classList.add("hidden");
    document
      .querySelector(".attachment_options_wrapper")
      .classList.remove("hidden");
    document.querySelector(
      ".progress_content"
    ).children[2].children[0].innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.58203" cy="8.14453" r="7.5" fill="#6FCF97"/>
      </svg>`;
    document.querySelector(
      ".progress_content"
    ).children[3].children[0].innerHTML = `<svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="7.58203"
        cy="8.14453"
        r="6"
        fill="#F4F4F4"
        stroke="#333333"
        stroke-width="3"
      />
    </svg>`;
    document.querySelector(
      ".step3"
    ).innerHTML = `<svg width="3" height="33" viewBox="0 0 3 33" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.83521 1.29297V31.3335" stroke="#6FCF97" stroke-width="2" stroke-linecap="round"/>
    </svg>`;
    document
      .querySelector(".progress_content")
      .children[3].classList.add("reqForm_current");
  });

document.getElementById("openCamera").addEventListener("click", function () {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(function (stream) {
        video.srcObject = stream;
      });
    document
      .querySelector(".attachment_options_wrapper")
      .classList.add("hidden");
    document.querySelector(".camera_feed").classList.remove("hidden");
  }
});

const video = document.getElementById("video");
const button = document.getElementById("acceptCamera");
const select = document.getElementById("selectCamera");
let currentStream;

//============================================
function stopMediaTracks(stream) {
  stream.getTracks().forEach((track) => {
    track.stop();
  });
}

function gotDevices(mediaDevices) {
  select.innerHTML = "";
  select.appendChild(document.createElement("option"));
  let count = 1;
  mediaDevices.forEach((mediaDevice) => {
    if (mediaDevice.kind === "videoinput") {
      const option = document.createElement("option");
      option.value = mediaDevice.deviceId;
      const label = mediaDevice.label || `Camera ${count++}`;
      const textNode = document.createTextNode(label);
      option.appendChild(textNode);
      select.appendChild(option);
    }
  });
}

button.addEventListener("click", (event) => {
  if (typeof currentStream !== "undefined") {
    stopMediaTracks(currentStream);
  }
  const videoConstraints = {};
  if (select.value === "") {
    videoConstraints.facingMode = "environment";
  } else {
    videoConstraints.deviceId = { exact: select.value };
  }
  const constraints = {
    video: videoConstraints,
    audio: false,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      currentStream = stream;
      video.srcObject = stream;
      return navigator.mediaDevices.enumerateDevices();
    })
    .then(gotDevices)
    .catch((error) => {
      console.error(error);
    });
});

navigator.mediaDevices.enumerateDevices().then(gotDevices);
//====================================

const canvas = document.getElementById("canvas");

const attachmentList = document.getElementById("attachments_list");
let imageElement;
let imageName;

/* firebase storage access */
const storage = firebase.storage();

document.getElementById("snapPhoto").addEventListener("click", function () {
  canvas.width = 320;

  canvas.height = (video.videoHeight / video.videoWidth) * 320;

  canvas.getContext("2d").drawImage(video, 0, 0, 320, canvas.height);
  document.querySelector(".camera_feed").classList.add("hidden");
  document.querySelector(".clicked_camera_feed").classList.remove("hidden");
});

document.getElementById("retake").addEventListener("click", function () {
  document.querySelector(".clicked_camera_feed").classList.add("hidden");
  document.querySelector(".camera_feed").classList.remove("hidden");
});

document.getElementById("attachPhoto").addEventListener("click", function () {
  reqImage = canvas.toDataURL("image/png");
  const tracks = video.srcObject.getTracks();
  tracks.forEach((track) => track.stop());
  const currDate = new Date();
  imageName = `img_${currDate.getDate()}${currDate.getMonth()}${currDate.getFullYear()}${currDate.getHours()}${currDate.getMinutes()}${currDate.getSeconds()}`;

  const image = new Image();
  image.src = canvas.toDataURL();
  let temp = document.createElement("li");
  temp.classList.add("image");
  temp.setAttribute("data-name", `${imageName}`);
  attachmentList.appendChild(temp);
  attachmentList.children[attachmentList.children.length - 1].appendChild(
    image
  );
  attachmentList.children[
    attachmentList.children.length - 1
  ].innerHTML += `<button class="img_close" id="${imageName}"><svg width="14" height="15" viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M14 1.91L12.59 0.5L7 6.09L1.41 0.5L0 1.91L5.59 7.5L0 13.09L1.41 14.5L7 8.91L12.59 14.5L14 13.09L8.41 7.5L14 1.91Z" fill="#4F4F4F"/>
  </svg></button>`;
  const imgClose_btns = document.querySelectorAll(".img_close");
  imgClose_btns.forEach((img_item) => {
    img_item.addEventListener("click", function () {
      imageElement = this.closest(".image");
      getName = imageElement.getAttribute("data-name");
      if (getName === this.id) {
        imageElement.remove();
      }
    });
  });
  document.querySelector(
    ".progress_content"
  ).children[3].children[0].innerHTML = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="7.58203" cy="8.14453" r="7.5" fill="#6FCF97"/>
  </svg>`;

  const imageRef = storage.ref().child("/attachments/" + imageName + ".png");
  imageRef.putString(reqImage, "data_url").then(function (snapshot) {
    reqImgURL.push(snapshot.metadata.fullPath);
  });

  document.querySelector(".clicked_camera_feed").classList.add("hidden");
  document.querySelector(".options_attachment").classList.remove("hidden");
  document.querySelector(".options_desciption").classList.remove("hidden");
});

document
  .querySelector(".sendRequest_btn")
  .addEventListener("click", function () {
    if (!document.querySelector(".sendRequest_btn").getAttribute("disabled")) {
      let docNameNum = "request";
      (async () => {
        const response = await DBCall();
        docNameNum += len;
      })().then(() => {
        const RCat = reqCat;
        const RSCat = reqSub;
        const RDesc = reqDesc;
        const RDate = new Date();
        const RUid = auth.currentUser.uid;
        const Rid = docNameNum;

        const RImgURL = reqImgURL;
        let reqObj = new NewReq(RCat, RSCat, RDesc, RDate, RUid, Rid, RImgURL);

        // Adding document while also assigning an id to it
        db.collection("newRequests")
          .doc(docNameNum)
          .set(Object.assign({}, reqObj))
          .then(() => {
            console.log("Document successfully written!");
            document
              .querySelector(".acknowledgement_container")
              .classList.remove("hidden");
            document.querySelector(
              ".acknowledgement_container"
            ).innerHTML = `<div class="ack_content_wrapper">
            <div class="ack_illustration">
              <svg width="51" height="51" viewBox="0 0 51 51" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M25.5 0C11.424 0 0 11.424 0 25.5C0 39.576 11.424 51 25.5 51C39.576 51 51 39.576 51 25.5C51 11.424 39.576 0 25.5 0ZM21.8142 36.8358C21.0332 37.6168 19.7668 37.6168 18.9858 36.8358L9.06421 26.9142C8.28316 26.1332 8.28316 24.8668 9.06421 24.0858L9.83326 23.3167C10.6135 22.5365 11.8783 22.5356 12.6597 23.3148L18.9858 29.6232C19.7672 30.4024 21.032 30.4015 21.8122 29.6213L38.3353 13.0982C39.1183 12.3152 40.3885 12.3175 41.1687 13.1032L41.9458 13.8858C42.7221 14.6677 42.7199 15.9301 41.9408 16.7092L21.8142 36.8358Z" fill="#27AE60"/>
              </svg>
              </div>
            <div class="ack_header">Successful!</div>
            <div class="ack_detail_header"><b>REQUEST DETAIL:</b></div>
            <div class="ack_req_type"><span><b>Category: </b></span>${RCat}</div>
            <div class="ack_req_sub"><span><b>Subject: </b></span>${RSCat}</div>
          </div>`;
          });
      });
    }
  });

document
  .querySelector(".acknowledgement_container")
  .addEventListener("click", function () {
    document
      .querySelector(".acknowledgement_container")
      .classList.add("hidden");
    window.location.pathname = "/notificationHome.html";
  });
