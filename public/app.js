const auth = firebase.auth();

const whenSignedIn = document.getElementByClass('whenSignedIn');
const whenSignedOut = document.getElementByClass('whenSignedOut');

const signInBtn = document.getElementByCasss('signInBtn');
const signOutBtn = document.getElementByClass('signOutBtn');

const userDetails = document.getElementByClass('userDetails');


const provider = new firebase.auth.GoogleAuthProvider();


signInBtn.onclick = () => auth.signInWithPopup(provider);

signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});