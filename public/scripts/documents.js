const auth = firebase.auth();
const firestore = firebase.firestore();

const logout = document.getElementById("Logout");

auth.onAuthStateChanged(user => {
    if (user) {
        // TODO:- loadUserData();
        logout.onclick = () => auth.signOut();
    } else {
        auth.signOut();
        window.location.replace("/index.html");
        // TODO:- Unsubscribe from all listeners if needed.
    }
});