const umcButton = document.getElementById("user-management-button");
const canvasShadowDiv = document.getElementById("canvas-shadow");
const userManagementDiv = document.getElementById("user-management");
const inviteEmailTextField = document.getElementById("invite-email-text-field");
const inviteButton = document.getElementById("invite-button");
const documentUsersDiv = document.getElementById("document-users");

var documentUsers;

inviteButton.onclick = async function () {
    let email = inviteEmailTextField.value;

    // Validate email string
    if (email == null || email == "" || !isValidEmail(email)) {
        alert("Error: Please enter a valid email.");
        return;
    }

    let recipientId = await userIdWithEmail(email);

    // Check if document includes this user already
    if (documentObject.users.includes(recipientId)) {
        alert(`The user with email ${email} already exists in this document.`);
        return;
    }

    if (recipientId != null) {
        // Check if an invitation has been sent before (and the user did not yet accept or reject it).
        invitationSentPreviously = await checkIfInviteSentPreviously(recipientId);
        
        if (invitationSentPreviously) {
            alert(`An invitation has already been sent to the user with email: ${email}.`);
            return;
        }

        sendInvite(recipientId);
        alert(`An invitation to the user with the email ${email} was sent successfully.`);

    } else {
        alert(`No user with the email ${email} exists.`);
        return;
    }
}

umcButton.onclick = function () {
    setUsersDialogHidden(true);
}

canvasShadowDiv.onclick = function () {
    setUsersDialogHidden(true);
}

function setUsersDialogHidden(hidden) {
    if (!hidden) {
        $(`#${canvasShadowDiv.id}`).css({ "z-index": "1" });
        $(`#${userManagementDiv.id}`).css({ "z-index": "1" });
        $(`#${canvasShadowDiv.id}`).fadeIn('slow');
        $(`#${userManagementDiv.id}`).fadeIn('slow');
    } else {
        $(`#${canvasShadowDiv.id}`).fadeOut('slow', function () {
            $(`#${canvasShadowDiv.id}`).css({ "z-index": "0" });
        });
    
        $(`#${userManagementDiv.id}`).fadeOut('slow', function () {
            $(`#${userManagementDiv.id}`).css({ "z-index": "0" });
        });
    }
}

function retrieveDocumentUsers() {
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
            setUsersHTML(documentObject.users);
        });
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
    else if (!isAdmin && documentObject.adminUid == this.user.uid) {
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
        console.log(documentObject.adminUid);
        firestore
            .collection('documents')
            .doc(documentObject.id)
            .update({
                users: firebase.firestore.FieldValue.arrayRemove(user.id)
            });
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
        
    return activeRef.docs.length > 0
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
    var invitation = Invitation.create(documentObject.id, documentObject.name, user.uid, user.email, recipientId);

    firestore
        .collection('invitations')
        .withConverter(invitationConverter)
        .add(invitation);
}