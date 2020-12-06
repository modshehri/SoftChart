const auth = firebase.auth();
const firestore = firebase.firestore();

const accountBtn = document.getElementById("account-btn");

auth.onAuthStateChanged(user => {
    if (user) {
        accountBtn.onclick = () => location.href = "documents.html";
    } else {
        accountBtn.onclick = () => location.href = "login.html";
        auth.signOut();
    }
});