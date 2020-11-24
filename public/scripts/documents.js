const auth = firebase.auth();
const firestore = firebase.firestore();

const logout = document.getElementById("Logout")
const documentAdd = document.getElementById("document-add")
const userDocuments = document.getElementById("user-documents")

var documentsListener
var userId = null

var isAnimating = false

window.onload = function() {
    $.getScript("scripts/models/Document.js");
};

auth.onAuthStateChanged(user => {
    if (user) {
        userId = user.uid
        loadDocuments()
        documentAdd.onclick = addDocument
        logout.onclick = () => auth.signOut()
    } else {
        unsubscribeListeners()
        auth.signOut()
        documentAdd.onclick = null
        window.location.replace("/index.html")
    }
})

function loadDocuments() {
    documentsListener = firestore.collection('documents')
        .where('users', 'array-contains', userId)
        .onSnapshot(querySnapshot => {
            clearDocumentsHTML()
            queryCanvases = querySnapshot.docs.map(doc => {
                var document = new Document(doc.id, doc.data().adminUid, doc.data().name, doc.data().components, doc.data().user);
                console.log(document.isDocumentAdmin(userId))
                addDocumentToHTML(document);
            })
        })
}

function unsubscribeListeners() {
    if (documentsListener != null) {
        documentsListener.unsubscribe()
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
    var documentDiv = document.createElement("a")
    documentDiv.className = "document"
    documentDiv.href = `/canvas.html?id=${documentObj.id}`

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

    documentDiv.onmouseenter = function() {
        $(`#${documentObj.id}`).animate({ opacity: 1.0 });
    };

    documentDiv.onmouseleave = function() {
        $(`#${documentObj.id}`).animate({ opacity: 0.0 });
    }

    documentDiv.onclick = function() {

    }

    return documentDiv
}

function clearDocumentsHTML() {
    userDocuments.innerHTML = ""
}

function deleteDocument(id) {
    firestore.collection('documents').doc(id).delete()
}

