// Back button
$("#back_btn").click(function goBack() {
  window.history.back();
});

// Check if the user is logged in or not
const auth = firebase.auth();

// Access firestore db
const db = firebase.firestore();

// Shortcuts to DOM Elements.
let messageListElement = document.getElementById("messages");
let messageFormElement = document.getElementById("message-form");
let messageInputElement = document.getElementById("message");
let submitButtonElement = document.getElementById("submit");
let currUid;
let userNameElement;
let chatCollection;

auth.onAuthStateChanged((user) => {
  if (user) {
    console.log("user is logged in");
    currUid = user.uid;
    chatCollection = "chatWithManager" + currUid;
    // We load currently existing chat messages and listen to new ones.
    loadMessages();

    db.collection("users")
      .doc(currUid)
      .get()
      .then((doc) => {
        userNameElement = doc.data().name;
      });
  } else {
    // No user is signed in.
    console.log("user is not logged in");
    window.location.pathname = "/index.html";
  }
});

// Saves a new message on the Firebase DB.
function saveMessage(messageText) {
  // TODO 7: Push a new message to Firebase.
  return db
    .collection(chatCollection)
    .add({
      userNameElement: userNameElement,
      text: messageText,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      replyTo: "Manager",
    })
    .catch(function (error) {
      console.error("Error writing new message to database", error);
    });
}

// Loads chat messages history and listens for upcoming ones.
async function loadMessages() {
  // TODO 8: Load and listens for new messages.
  let query = db
    .collection(chatCollection)
    .orderBy("timestamp", "desc")
    .limit(12);

  // Start listening to the query.
  query.onSnapshot(function (snapshot) {
    snapshot.docChanges().forEach(function (change) {
      var message = change.doc.data();
      displayMessage(
        change.doc.id,
        message.timestamp,
        message.userNameElement,
        message.text,
        message.profilePicUrl,
        message.imageUrl
      );
    });
  });
}

// Triggered when the send new message form is submitted.
function onMessageFormSubmit(e) {
  e.preventDefault();
  // Check that the user entered a message and is signed in.
  if (messageInputElement.value) {
    saveMessage(messageInputElement.value).then(function () {
      // Clear message text field and re-enable the SEND button.
      resetMaterialTextfield(messageInputElement);
      toggleButton();
    });
  }
}

// Resets the given MaterialTextField.
function resetMaterialTextfield(element) {
  element.value = "";
}

// Template for messages.
var MESSAGE_TEMPLATE = `<div class="message-container">
  <div class="name"></div>
  <div class="message"></div>
  </div>`;

function createAndInsertMessage(id, timestamp, userNameElement) {
  const container = document.createElement("div");
  container.innerHTML = MESSAGE_TEMPLATE;
  const div = container.firstChild;
  div.setAttribute("id", id);
  div.children[0].innerHTML = userNameElement;
  if (userNameElement !== "Manager") {
    div.classList.add("text-right");
    div.classList.add("chat_bubble_round_user");
    div.classList.add("bg-green");
  } else {
    div.classList.add("chat_bubble_round_manager");
    div.classList.add("bg-gray");
  }

  // If timestamp is null, assume we've gotten a brand new message.
  timestamp = timestamp ? timestamp.toMillis() : Date.now();
  div.setAttribute("timestamp", timestamp);

  // figure out where to insert new message
  const existingMessages = messageListElement.children;
  if (existingMessages.length === 0) {
    messageListElement.appendChild(div);
  } else {
    let messageListNode = existingMessages[0];

    while (messageListNode) {
      const messageListNodeTime = messageListNode.getAttribute("timestamp");

      if (!messageListNodeTime) {
        throw new Error(
          `Child ${messageListNode.id} has no 'timestamp' attribute`
        );
      }

      if (messageListNodeTime > timestamp) {
        break;
      }

      messageListNode = messageListNode.nextSibling;
    }

    messageListElement.insertBefore(div, messageListNode);
  }

  return div;
}

// Displays a Message in the UI.
function displayMessage(id, timestamp, userNameElement, text) {
  var div =
    document.getElementById(id) ||
    createAndInsertMessage(id, timestamp, userNameElement);

  div.querySelector(".name").textContent = userNameElement;
  var messageElement = div.querySelector(".message");

  if (text) {
    // If the message is text.
    messageElement.textContent = text;
    // Replace all line breaks by <br>.
    messageElement.innerHTML = messageElement.innerHTML.replace(/\n/g, "<br>");
  }
  // Show the card fading-in and scroll to view the new message.
  setTimeout(function () {
    div.classList.add("visible");
  }, 1);
  messageListElement.scrollTop = messageListElement.scrollHeight;
  messageInputElement.focus();
}

// Enables or disables the submit button depending on the values of the input
// fields.
function toggleButton() {
  if (messageInputElement.value) {
    submitButtonElement.removeAttribute("disabled");
  } else {
    submitButtonElement.setAttribute("disabled", "true");
  }
}

// Checks that the Firebase SDK has been correctly setup and configured.
function checkSetup() {
  if (
    !window.firebase ||
    !(firebase.app instanceof Function) ||
    !firebase.app().options
  ) {
    window.alert(
      "You have not configured and imported the Firebase SDK. " +
        "Make sure you go through the codelab setup instructions and make " +
        "sure you are running the codelab using `firebase serve`"
    );
  }
}

// Checks that Firebase has been imported.
checkSetup();

// Saves message on form submit.
messageFormElement.addEventListener("submit", onMessageFormSubmit);

// Toggle for the button.
messageInputElement.addEventListener("keyup", toggleButton);
messageInputElement.addEventListener("change", toggleButton);
