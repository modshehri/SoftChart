const auth = firebase.auth()
const firestore = firebase.firestore()

const logout = document.getElementById("Logout")
var documentsListener;

auth.onAuthStateChanged(user => {
    if (user) {
        loadDocuments(user.uid)
        logout.onclick = () => auth.signOut()
    } else {
        unsubscribeListeners()
        clearDocumentsArray()
        auth.signOut()
        window.location.replace("/index.html")
    }
})

function loadDocuments(userId) {
    documentsListener = firestore.collection('documents')
        .where('users', 'array-contains', userId)
        .onSnapshot(querySnapshot => {
            queryCanvases = querySnapshot.docs.map(doc => {
                var document = {
                    id: doc.id,
                    adminUid: doc.data().adminUid,
                    name: doc.data().name,
                    components: doc.data().components,
                    users: doc.data().users
                }

                console.log(document)
            })
        })
}

function unsubscribeListeners() {
    if (documentsListener != null) {
        documentsListener.unsubscribe()
    }
}

function clearDocumentsArray() {
    documents = []
}