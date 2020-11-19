const auth = firebase.auth();
const firestore = firebase.firestore();
const signInGoogleBtn = document.getElementById("google-sign-in");

const provider = new firebase.auth.GoogleAuthProvider();

auth.onAuthStateChanged(user => {
    if (user) {
        window.location.href = "http://www.w3schools.com";
    } else {
        signInGoogleBtn.onclick = () => auth.signInWithPopup(provider);
    }
});