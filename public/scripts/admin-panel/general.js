const auth = firebase.auth();
const firestore = firebase.firestore();

const websiteUsersTab = document.getElementById("Users");
const websiteDocumentsTab = document.getElementById("Documents");
const headline = document.getElementById("headline");

var user = null;
var userId = null;

var websiteUsers = null;
var websiteDocuments = null;

var userListener = null;
var websiteUsersListener = null;
var websiteDocumentsListener = null;

var isCurrentTabUsers = true;

websiteUsersTab.onclick = function() {
    isCurrentTabUsers = true;
    if (websiteUsers == null) { return; }
    createWebsiteUsersTable();
    websiteUsersTab.className = "selected";
    websiteDocumentsTab.className = "unselected";
    usersTable.style.display='block';
    documentsTable.style.display='none';
    headline.innerHTML = "Users";
}

websiteDocumentsTab.onclick = function() {
    isCurrentTabUsers = false;
    if (websiteDocuments == null) { return; }
    createWebsiteDocumentsTable();
    websiteUsersTab.className = "unselected";
    websiteDocumentsTab.className = "selected";
    usersTable.style.display='none';
    documentsTable.style.display='block';
    headline.innerHTML = "Documents";
}

auth.onAuthStateChanged(user => {
    if (user) {
        this.userId = user.uid;
        loadUser();
    } else {
        console.log("called");
        unsubscribeListeners();
        redirectToIndex();        
    }
});

function unsubscribeListeners() {
    if (userListener) { userListener(); }
    if (websiteUsersListener) { websiteUsersListener(); }
    if (websiteDocumentsListener) { websiteDocumentsListener(); }
}

function loadUser() {
    if (userListener) { return; }

    userListener = firestore
        .collection('users')
        .doc(userId)
        .onSnapshot(documentSnapshot => {
            let documentExists = documentSnapshot.exists;
            if (documentExists) {
                let documentData = documentSnapshot.data();
                var user = new User(documentSnapshot.id, documentData.email, documentData.isWebsiteAdmin, documentData.isBlocked);
                if (user.isWebsiteAdmin == false || user.isBlocked) {
                    setTimeout(() => {
                        auth.signOut();
                        return;
                    }, 500);
                }

                this.user = user;
                loadWebsiteUsers();
                loadWebsiteDocuments();
            }
        });
}

function loadWebsiteUsers() {
    if (websiteUsersListener) { return; }

    websiteUsersListener = firestore
        .collection('users')
        .onSnapshot(querySnapshot => {
            var websiteUsers = [];
            querySnapshot.forEach(function (doc) {
                websiteUsers.push(new User(doc.id, doc.data().email, doc.data().isWebsiteAdmin, doc.data().isBlocked));
            });
            this.websiteUsers = websiteUsers;
            createWebsiteUsersTable();
        });
}

function loadWebsiteDocuments() {
    if (websiteDocumentsListener) { return; }

    websiteDocumentsListener = firestore
        .collection('documents')
        .onSnapshot(querySnapshot => {
            var websiteDocuments = [];
            querySnapshot.forEach(function (doc) {
                websiteDocuments.push(new Document(doc.id, doc.data().adminUid, doc.data().name, doc.data().users));
            });
            this.websiteDocuments = websiteDocuments;
            createWebsiteDocumentsTable();
        });
}

function setUserBlocked(id, blocked) {
    var message;

    if (blocked) {
        message = "Are you sure you want to block this user from SoftChart?";
    } else {
        message = "Are you sure you want to unblock this user from SoftChart?";
    }

    if (confirm(message)) {
        firestore
            .collection('users')
            .doc(id)
            .update({ isBlocked: blocked });
    }
}

function setUserAdminRole(id, isAdmin) {
    var message;

    if (isAdmin) {
        message = "Are you sure you want to assign this user as an admin role?";
    } else {
        message = "Are you you want to revoke the admin role from this user?"
    }

    if (confirm(message)) {
        firestore
            .collection('users')
            .doc(id)
            .update({ isWebsiteAdmin: isAdmin });
    }
}

function deleteDocument(id) {
    if(confirm("Are you sure you want to delete this document?")) {
        firestore
            .collection('documents')
            .doc(id)
            .delete();
    }
}

function redirectToIndex() {
    location.href = "index.html";
}