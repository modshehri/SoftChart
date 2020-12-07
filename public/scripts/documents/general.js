const auth = firebase.auth();
const firestore = firebase.firestore();

const logout = document.getElementById("Logout")
const documentAdd = document.getElementById("document-add")
const userDocuments = document.getElementById("user-documents")
const userInvitations = document.getElementById("user-invitations");

const invitationsDialogDiv = document.getElementById("invitations-dialog");
const documentsShadowDiv = document.getElementById("documents-shadow");
const userInvitationsButton = document.getElementById("user-invitations-button");

var documentsListener
var invitationsListener
var userId = null

var isAnimating = false

userInvitationsButton.onclick = function() {
    console.log("hello from the other side")
    $(`#${documentsShadowDiv.id}`).css({"z-index": "1"});
    $(`#${invitationsDialogDiv.id}`).css({"z-index": "1"});
    $(`#${documentsShadowDiv.id}`).fadeIn('slow');
    $(`#${invitationsDialogDiv.id}`).fadeIn('slow');
}

documentsShadowDiv.onclick = function() {
    $(`#${documentsShadowDiv.id}`).fadeOut('slow', function() {
        $(`#${documentsShadowDiv.id}`).css({"z-index": "0"});
    });

    $(`#${invitationsDialogDiv.id}`).fadeOut('slow', function() {
        $(`#${invitationsDialogDiv.id}`).css({"z-index": "0"});
    });
}

logout.onclick = auth.signOut;

auth.onAuthStateChanged(user => {
    if (user) {
        userId = user.uid
        loadData()
        documentAdd.onclick = addDocument
        logout.onclick = () => auth.signOut()
    } else {
        unsubscribeListeners()
        documentAdd.onclick = null
        auth.signOut()
        location.href = "index.html";
    }
})

function loadData() {
    loadDocuments()
    loadInvitations()
}

function loadInvitations() {
    invitationsListener = firestore.collection('invitations')
        .where('recipientId', '==', userId)
        .where('status', '==', 'UNDECIDED')
        .onSnapshot(querySnapshot => {
            var invitations = [];
            for (docIndex in querySnapshot.docs) {
                let invitation = querySnapshot.docs[docIndex].data();
                invitations.push(new Invitation(querySnapshot.docs[docIndex].id,
                                                invitation.docId,
                                                invitation.docName,
                                                invitation.senderId,
                                                invitation.senderEmail,
                                                invitation.recipientId,
                                                invitation.status))
            }
            setHTMLInvitations(invitations);
        });
}

function setHTMLInvitations(invitations) {
    setNoInvitationsPromptHidden(invitations.length > 0);

    userInvitations.innerHTML = "";
    for (invitationIndex in invitations) {
        let invitation = invitations[invitationIndex];
        
        var invitationDiv = document.createElement("div");
        invitationDiv.className = "invitation";

        var invitationDocumentName = document.createElement("p");
        invitationDocumentName.innerHTML = `<b>${invitation.docName}</b><br>From: ${invitation.senderEmail}`;
        invitationDocumentName.className = "invitation-document-name";

        var decisionButtons = document.createElement("div");
    
        var acceptButton = document.createElement("button");
        acceptButton.innerHTML = "Accept";
        acceptButton.onclick = () => acceptInvitation(invitation);

        var rejectButton = document.createElement("button");
        rejectButton.innerHTML = "Reject";
        rejectButton.onclick = () => rejectInvitation(invitation);

        decisionButtons.append(acceptButton, rejectButton);

        invitationDiv.append(invitationDocumentName, decisionButtons, document.createElement("hr"));

        userInvitations.append(invitationDiv);
    }

}

function setNoInvitationsPromptHidden(hidden) {
    if (hidden) {
        $('#no-invitations-prompt').hide();
    } else {
        $('#no-invitations-prompt').show();
    }
}

function acceptInvitation(invitation) {
    firestore
        .collection('documents')
        .doc(invitation.docId)
        .get()
        .then(function(document) {
            if (document.exists == false || document == null) { return; }
            var documentData = document.data();
            var documentUsers = documentData.users;


            if (documentUsers.includes(invitation.recipientId) == false) {
                documentUsers.push(invitation.recipientId);
                documentData.users = documentUsers;
    
                firestore
                    .collection('documents')
                    .doc(invitation.docId)
                    .withConverter(documentConveter)
                    .set(documentData);
            }

            invitation.status = "ACCEPTED";
            
            firestore
                .collection('invitations')
                .doc(invitation.id)
                .withConverter(invitationConverter)
                .set(invitation);
        });
}

function rejectInvitation(invitation) {
    firestore
        .collection('documents')
        .doc(invitation.docId)
        .get()
        .then(function(document) {
            if (document.exists == false || document == null) { return; }

            var documentData = document.data();
            var documentUsers = documentData.users;

            if (documentUsers.includes(invitation.recipientId)) {
                documentUsers.pop(invitation.recipientId);
                documentData.users = documentUsers;

                firestore
                    .collection('documents')
                    .doc(invitation.docId)
                    .withConverter(documentConveter)
                    .set(documentData);
            }

            invitation.status = "REJECTED";
            
            firestore
                .collection('invitations')
                .doc(invitation.id)
                .withConverter(invitationConverter)
                .set(invitation);
        });
}

function loadDocuments() {
    documentsListener = firestore.collection('documents')
        .where('users', 'array-contains', userId)
        .onSnapshot(querySnapshot => {
            clearDocumentsHTML()
            queryCanvases = querySnapshot.docs.map(doc => {
                var document = new Document(doc.id, doc.data().adminUid, doc.data().name, doc.data().components, doc.data().user);
                addDocumentToHTML(document);
            })
        })
}

function unsubscribeListeners() {
    if (documentsListener != null) {
        documentsListener();
    }
}

function addDocument() {
    var name = prompt("Document Name:", "");

    if (name == null || name == "") {
        name = "Untitled"
    }

    var document = Document.create(userId, name);

    firestore.collection('documents')
        .withConverter(documentConveter)
        .add(document);
}

function addDocumentToHTML(document) {
    $("#user-documents").append(getDocumentHTMLComponent(document))
}

function getDocumentHTMLComponent(documentObj) {
    var documentDiv = document.createElement("div")
    documentDiv.className = "document"

    var documentImg = document.createElement("img")
    documentImg.className = "document-image"
    documentImg.src = "images/document.svg"

    var documentName = document.createElement("p")
    documentName.className = "document-name"
    documentName.innerHTML = documentObj.name

    var deleteDocumentButton = document.createElement("img")
    deleteDocumentButton.className = "delete-document"
    deleteDocumentButton.id = documentObj.id
    deleteDocumentButton.src = "images/delete.svg"
    deleteDocumentButton.onclick = () => deleteDocument(documentObj.id)

    var documentTypeImage = document.createElement("img")
    documentTypeImage.className = "document-type"
    documentTypeImage.src = documentObj.isDocumentAdmin(userId) ? "images/document-admin-icon.svg" : "images/shared-document-icon.svg"

    documentDiv.append(documentImg)
    documentDiv.append(documentName)
    documentDiv.append(deleteDocumentButton)
    documentDiv.append(documentTypeImage)

    documentDiv.onclick = function() {
        location.href = `canvas.html?id=${documentObj.id}`;
    };

    documentDiv.onmouseenter = function() {
        $(`#${documentObj.id}`).animate({ opacity: 1.0 });
    };

    documentDiv.onmouseleave = function() {
        $(`#${documentObj.id}`).animate({ opacity: 0.0 });
    };
    
    return documentDiv
}

function clearDocumentsHTML() {
    userDocuments.innerHTML = ""
}

function deleteDocument(id) {
    firestore.collection('documents').doc(id).delete()
}

