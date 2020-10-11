const auth = firebase.auth();

const signedInDiv = document.getElementById('signedIn');
const signedOutDiv = document.getElementById('signedOut');
const userDetailsDiv = document.getElementById('userDetails');
const signInGoogleBtn = document.getElementById('signInGoogleBtn');
const signOutBtn = document.getElementById('signOutBtn');

const provider = new firebase.auth.GoogleAuthProvider();

signInGoogleBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        signedInDiv.hidden = false;
        signedOutDiv.hidden = true;
        userDetailsDiv.innerHTML = `<p>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        signedInDiv.hidden = true;
        signedOutDiv.hidden = false;
    }
});
