const auth = firebase.auth();
const firestore = firebase.firestore();

const myDocs = document.getElementById("DocsButton");

var documentObject;
var documentListener;
var user;

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
    documentListener = firestore
    .collection('documents')
    .doc(findGetParameter("id"))
    .onSnapshot(documentSnapshot => {
        let documentExists = documentSnapshot.exists;
        
        if (documentExists) {
            let documentData = documentSnapshot.data();

            var components = [];
            for (documentIndex in documentData.components) {
                var dbComponent = documentData.components[documentIndex];
                components.push(new Component(dbComponent.id, dbComponent.type, dbComponent.textContents, dbComponent.x, dbComponent.y));
            }

            this.documentObject = new Document(documentSnapshot.id, documentData.adminUid, documentData.name, components, documentData.users);

            if (!this.documentObject.users.includes(this.user.uid)) {
                redirectToIndex();
                return;
            }
            
            retrieveDocumentUsers();
            drawComponents(documentObject.components);
        } else {
            redirectToIndex();
        }
    }, err => {
        redirectToIndex();
    });
}

function unsubscribeListeners() {
    if (documentListener != null) {
        documentListener.unsubscribe()
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