// Back button
$("#back_btn").click(function goBack() {
  window.history.back();
});

// Array to store objects to store form data
// let newReqs = [];

class NewReq {
  constructor(category, subCategory, description, date, userID) {
    this.ReqCategory = category;
    this.title = subCategory;
    this.description = description;
    this.submittedDate = date;
    this.ReqUid = userID;
    this.infoType = "request";
    this.requestStatus = "sent";
  }
}

// Accessing cloud firestore db
const db = firebase.firestore();

const auth = firebase.auth();

// let promise1 = new Promise(function (resolve, reject) {
//     resolve(this.length);
// });
// let docNumber = docNum();
// console.log(docNumber);
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

$("#requestForm").submit(function () {
  //   $("#submit_btn").attr("disabled", "disabled");
  let docNameNum = "request#";
  const RCat = $("#requestCategory").val();
  const RSCat = $("#otherrequestCategory").val();
  const RDesc = $("#description").val();
  const RDate = new Date();
  const RUid = auth.currentUser.uid;
  let reqObj = new NewReq(RCat, RSCat, RDesc, RDate, RUid);
  (async () => {
    const response = await DBCall();
    docNameNum += len;
  })().then(() => {
    console.log(docNameNum);
    // Adding document while also assigning an id to it
    try {
      db.collection("newRequests")
        .doc(docNameNum)
        .set(Object.assign({}, reqObj))
        .then(() => {
          console.log("Document successfully written!");
          setTimeout((window.location.pathname = "/notificationHome.html"),2000);
        });
    } catch (err) {
      console.error(err);
    }
  });

  // Create an entry in tenant's collection to link this request to their profile
  //   try {
  //     db.collection("newRequests")
  //     .doc("one")
  //     .set(Object.assign({},reqObj))
  //     .then(() => {
  //       console.log("Document successfully written!");
  //     });
  //   }
  //   catch(err) {
  //       console.error(err);
  //   }
  return false;
});
