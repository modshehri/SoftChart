const auth = firebase.auth();
const firestore = firebase.firestore();

const websiteUsersTab = document.getElementById("Users");
const websiteDocumentsTab = document.getElementById("Documents");

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
    createWebsiteUsersTable();
    websiteUsersTab.className = "selected";
    websiteDocumentsTab.className = "unselected";
}

websiteDocumentsTab.onclick = function() {
    isCurrentTabUsers = false;
    createWebsiteDocumentsTable();
    websiteUsersTab.className = "unselected";
    websiteDocumentsTab.className = "selected";
}

auth.onAuthStateChanged(user => {
    if (user) {
        this.userId = user.uid;
        loadUser();
    } else {
        unsubscribeListeners();
        auth.signOut()
        redirectToIndex();
    }
});

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
                    redirectToIndex();
                    return;
                }
                this.user = user;
                loadWebsiteUsers();
                loadWebsiteDocuments();
            } else {
                redirectToIndex();
                return;
            }
        }, err => {
            redirectToIndex();
            return;
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
            if (isCurrentTabUsers) {
                createWebsiteUsersTable();
            }
        });
}

function loadWebsiteDocuments() {
    if (websiteDocumentsListener) { return; }

    websiteDocumentsListener = firestore
        .collection('documents')
        .onSnapshot(querySnapshot => {
            var websiteDocuments = [];
            querySnapshot.forEach(function (doc) {
                websiteDocuments.push(new Document(doc.id, doc.data().adminUid, doc.data().name, doc.data().user));
            });
            this.websiteDocuments = websiteDocuments;
            if (isCurrentTabUsers == false) {
                createWebsiteDocumentsTable();
            }
        });
}

function setUserBlocked(id, blocked) {
    firestore
        .collection('users')
        .doc(id)
        .update({ isBlocked: blocked });
}

function setUserAdminRole(id, isAdmin) {
    firestore
        .collection('users')
        .doc(id)
        .update({ isWebsiteAdmin: isAdmin })
}

function redirectToIndex() {
    location.href = "index.html";
}