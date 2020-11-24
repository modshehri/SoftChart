const auth = firebase.auth();
const firestore = firebase.firestore();

const myDocs = document.getElementById("DocsButton");
const umcButton = document.getElementById("user-management-button");
const canvasShadowDiv = document.getElementById("canvas-shadow");
const userManagementDiv = document.getElementById("user-management");
const inviteEmailTextField = document.getElementById("invite-email-text-field");
const inviteButton = document.getElementById("invite-button");

var userId;
var docId = findGetParameter("id");

window.onload = function() {
    $.getScript("scripts/models/Invitation.js");
};

auth.onAuthStateChanged(user => {
    if (user) {
        userId = user.uid
    } else {
        auth.signOut()
        window.location.replace("/index.html")
    }
})

myDocs.onclick = function () {
    location.href = "documents.html";
};

umcButton.onclick = function() {
    $(`#${canvasShadowDiv.id}`).css({"z-index": "1"});
    $(`#${userManagementDiv.id}`).css({"z-index": "1"});
    $(`#${canvasShadowDiv.id}`).fadeIn('slow');
    $(`#${userManagementDiv.id}`).fadeIn('slow');
}

canvasShadowDiv.onclick = function() {
    $(`#${canvasShadowDiv.id}`).fadeOut('slow', function() {
        $(`#${canvasShadowDiv.id}`).css({"z-index": "0"});
    });

    $(`#${userManagementDiv.id}`).fadeOut('slow', function() {
        $(`#${userManagementDiv.id}`).css({"z-index": "0"});
    });
}

inviteButton.onclick = async function() {
    let email = inviteEmailTextField.value;

    if (email == null || email == "" || !isValidEmail(email)) {
        alert("Error: Please enter a valid email.")
        return
    }

    let recipientId = await userIdWithEmail(email);

    if (recipientId != null) {
        invitationSentPreviously = await checkIfInviteSentPreviously(recipientId);

        if (invitationSentPreviously) {
            alert(`An invite has already been sent to the user with email: ${email}.`);
            return
        }
        sendInvite(recipientId);
    }
    alert(`An invite will be sent to user with email ${email} if the user exists.`);
}

function isValidEmail(email) {
    if (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)) {
        return true
    }
    return false
}

async function checkIfInviteSentPreviously(recipientId) {
    let invitationsRef = firestore
        .collection('invitations');

    let activeRef = await invitationsRef
        .where("recipientId", "==", recipientId)
        .where("status", "==", "UNDECIDED")
        .get();

    return activeRef.length > 0
}

async function userIdWithEmail(recipientEmail) {
    let usersRef = firestore
        .collection('users');

    let activeRef = await usersRef
        .where("email", "==", recipientEmail)
        .get();

    console.log(activeRef.docs[0].data())

    for (docIndex in activeRef.docs) {
        if (activeRef.docs[docIndex].data().email == recipientEmail) {
            return activeRef.docs[docIndex].id
        }
    }

    return null;
}

function sendInvite(recipientId) {
    var invitation = Invitation.create(docId, userId, recipientId);

    firestore
        .collection('invitations')
        .withConverter(invitationConverter)
        .add(invitation)
}

function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}