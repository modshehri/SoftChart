const auth = firebase.auth();
const firestore = firebase.firestore();
const signInGoogleBtn = document.getElementById("google-sign-in");

const provider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged(user => {
    if (user) {
        firestore
            .collection('users')
            .doc(user.uid)
            .get()
            .then(function(docRef) {
                if (docRef.exists) {
                    if (docRef.data().isBlocked) {
                        auth.signOut();
                        alert("Sorry, your account has been blocked by an admin.");
                        return;
                    }
                    location.href = "documents.html";
                } else {
                    firestore
                        .collection('users')
                        .doc(user.uid)
                        .set( { email: user.email, isWebsiteAdmin: false, isBlocked: false } )
                        .then(function(docRef) {
                            location.href = "documents.html";
                        });
                }
            });
        
    } else {
        signInGoogleBtn.onclick = () => auth.signInWithPopup(provider);
    }
});