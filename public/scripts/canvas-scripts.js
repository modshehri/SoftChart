const auth = firebase.auth();
const firestore = firebase.firestore();

const myDocs = document.getElementById("DocsButton");
const umcButton = document.getElementById("user-management-button");
const canvasShadowDiv = document.getElementById("canvas-shadow");
const userManagementDiv = document.getElementById("user-management");
const inviteEmailTextField = document.getElementById("invite-email-text-field");
const inviteButton = document.getElementById("invite-button");
const documentUsersDiv = document.getElementById("document-users");

var docId = findGetParameter("id");
var user;
var documentObject;
var documentUsers;

var documentUsersListener;

window.onload = function () {
    $.getScript("scripts/models/Invitation.js");
    $.getScript("scripts/models/User.js");

};

auth.onAuthStateChanged(user => {
    if (user) {
        this.user = user
        loadData();
    } else {
        unsubscribeListeners();
        auth.signOut()
        window.location.replace("/index.html")
    }
})

function loadData() {
    documentUsersListener = getDocumentUsersListener();
}

function unsubscribeListeners() {
    if (documentUsersListener != null) {
        documentUsersListener.unsubscribe()
    }
}

function getDocumentUsersListener() {
    firestore
        .collection('documents')
        .doc(docId)
        .onSnapshot(documentSnapshot => {
            let documentExists = documentSnapshot.exists;
            let documentData = documentSnapshot.data();

            this.documentObject = documentData;

            if (documentExists) {
                firestore
                    .collection('users')
                    .where(firebase.firestore.FieldPath.documentId(), 'in', documentObject.users)
                    .get()
                    .then(function(querySnapshot) {
                        var users = [];
                        querySnapshot.forEach(function(doc) {
                            users.push(new User(doc.id, doc.data().email));
                        });
                        this.documentUsers = users;
                        setUsersHTML(documentData.users);
                    });
            } else {
                redirectToIndex();
            }
        }, err => {
            redirectToIndex();
        });
}

function redirectToIndex() {
    //TODO: Implement
}

function setUsersHTML() {
    documentUsersDiv.innerHTML = "";
    for (userIndex in documentUsers) {
        let user = documentUsers[userIndex];
        documentUsersDiv.append(createUserHTMLElement(user, user.id == this.documentObject.adminUid));
    }
}

function createUserHTMLElement(user, isAdmin) {
    var userInformationDiv = document.createElement("div");
    userInformationDiv.className = "user-information";

    var userImg = document.createElement("img");
    userImg.src = "images/user.svg";
    userImg.className = "document-user-icon";

    var userEmailP = document.createElement("p");
    userEmailP.className = "user-email";
    userEmailP.innerHTML = user.email;

    var emailIconContainer = document.createElement("div");
    emailIconContainer.className = "email-icon-container";
    emailIconContainer.append(userImg, userEmailP);

    userInformationDiv.append(emailIconContainer);

    if (isAdmin) {
        var documentAdminStarIcon = document.createElement("img");
        documentAdminStarIcon.src = "images/document-admin-icon-gold.svg";
        documentAdminStarIcon.id = "document-admin-icon";

        userInformationDiv.append(documentAdminStarIcon);
    }
    else if (!isAdmin && documentObject.adminUid == user.uid) {
        var deleteButton = document.createElement("button");
        deleteButton.id = "delete-user";
        deleteButton.innerHTML = "Delete";
        deleteButton.onclick = () => deleteUserFromCanvas(user);

        userInformationDiv.append(deleteButton);
    }
    return userInformationDiv
}

function deleteUserFromCanvas(user) {
    if (confirm(`Are you sure you want to delete the user with email ${user.email}?`)) {
        
    }
}

myDocs.onclick = function () {
    location.href = "documents.html";
};

umcButton.onclick = function () {
    $(`#${canvasShadowDiv.id}`).css({ "z-index": "1" });
    $(`#${userManagementDiv.id}`).css({ "z-index": "1" });
    $(`#${canvasShadowDiv.id}`).fadeIn('slow');
    $(`#${userManagementDiv.id}`).fadeIn('slow');
}

canvasShadowDiv.onclick = function () {
    $(`#${canvasShadowDiv.id}`).fadeOut('slow', function () {
        $(`#${canvasShadowDiv.id}`).css({ "z-index": "0" });
    });

    $(`#${userManagementDiv.id}`).fadeOut('slow', function () {
        $(`#${userManagementDiv.id}`).css({ "z-index": "0" });
    });
}

inviteButton.onclick = async function () {
    let email = inviteEmailTextField.value;

    if (email == null || email == "" || !isValidEmail(email)) {
        alert("Error: Please enter a valid email.");
        return
    }

    let recipientId = await userIdWithEmail(email);

    if (documentObject.users.includes(recipientId)) {
        alert(`The user with email ${email} already exists in this document.`);
        return
    }

    if (recipientId != null) {
        invitationSentPreviously = await checkIfInviteSentPreviously(recipientId);

        if (invitationSentPreviously) {
            alert(`An invitation has already been sent to the user with email: ${email}.`);
            return
        }

        sendInvite(recipientId);
        alert(`An invitation to the user with the email ${email} was sent successfully.`);

    } else {
        alert(`No user with the email ${email} exists.`);
        return
    }
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

    for (docIndex in activeRef.docs) {
        if (activeRef.docs[docIndex].data().email == recipientEmail) {
            return activeRef.docs[docIndex].id
        }
    }

    return null;
}

function sendInvite(recipientId) {
    var invitation = Invitation.create(docId, documentObject.name, user.uid, user.email, recipientId);

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