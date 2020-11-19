const auth = firebase.auth();
const firestore = firebase.firestore();

const accountBtn = document.getElementById("account-btn");

auth.onAuthStateChanged(user => {
    if (user) {
        accountBtn.onclick = () => window.location.replace("/documents.html");
    } else {
        accountBtn.onclick = () => window.location.replace("/login.html");
        auth.signOut();
    }
});