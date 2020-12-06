const auth = firebase.auth();
const firestore = firebase.firestore();

const myDocs = document.getElementById("DocsButton");

var docId = findGetParameter("id");
var documentObject;
var documentUsers;
var user;
var documentUsersListener;

auth.onAuthStateChanged(user => {
    if (user) {
        this.user = user;
        loadData();
    } else {
        unsubscribeListeners();
        auth.signOut()
        redirectToIndex();
    }
});

function loadData() {
    documentUsersListener = firestore
    .collection('documents')
    .doc(docId)
    .onSnapshot(documentSnapshot => {
        let documentExists = documentSnapshot.exists;
        
        if (documentExists) {
            let documentData = documentSnapshot.data();
            this.documentObject = new Document(documentSnapshot.id, documentData.adminUid, documentData.name, documentData.components, documentData.users);

            if (!this.documentObject.users.includes(this.user.uid)) {
                redirectToIndex();
                return;
            }

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

function unsubscribeListeners() {
    if (documentUsersListener != null) {
        documentUsersListener.unsubscribe()
    }
}

function redirectToIndex() {
    location.href = "index.html";
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

myDocs.onclick = function () {
    location.href = "documents.html";
};