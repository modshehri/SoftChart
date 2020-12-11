const auth = firebase.auth();
const firestore = firebase.firestore();
const realtimeDatabase = firebase.database();

const myDocs = document.getElementById("DocsButton");
const exportDocumentButton = document.getElementById("export-document-button");

var documentObject = null;
var documentListener = null;
var user = null;

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
    if (this.documentListener) { return; }

    documentListener = firestore
        .collection('documents')
        .doc(findGetParameter("id"))
        .onSnapshot(documentSnapshot => {
            let documentExists = documentSnapshot.exists;
            if (documentExists) {
                let documentData = documentSnapshot.data();

                this.documentObject = new Document(documentSnapshot.id, documentData.adminUid, documentData.name, documentData.users);

                if (!this.documentObject.users.includes(this.user.uid)) {
                    redirectToIndex();
                    return;
                }
                
                // A call to query all the components in the document (->components.js).
                attachDocumentComponentsListener();

                // A call to query all the users in the document (->user-management.js).
                retrieveDocumentUsers();

                // A call to listen for all cursor changes (mouse movements) (->cursors-listener.js).
                attachCursorsListener();
            } else {
                redirectToIndex();
            }
        }, err => {
            redirectToIndex();
        });
}

function unsubscribeListeners() {
    if (documentListener != null) { documentListener(); }
    if (componentsListener != null) { componentsListener(); }
    if (connectionsListener != null) { connectionsListener(); }
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

exportDocumentButton.onclick = function () {
    // document.getElementById('canvas').appendChild(document.querySelector('.leader-line'));
    html2canvas(document.getElementById('canvas')).then(function (canvas) {
        var img = canvas.toDataURL("image/png", 1);
        let a = document.createElement("a");
        a.href = img;
        a.download = img;
        a.click();
    });
}