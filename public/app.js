const auth = firebase.auth();
const firestore = firebase.firestore();

const whenSignedIn = document.getElementByClass('whenSignedIn');
const whenSignedOut = document.getElementByClass('whenSignedOut');

const signInBtn = document.getElementById('signInBtn');
const signOutBtn = document.getElementById('signOutBtn');
const createCanvasBtn = document.getElementById('createCanvasBtn');

const userDetails = document.getElementByClass('userDetails');

const provider = new firebase.auth.GoogleAuthProvider();

signInBtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();


auth.onAuthStateChanged(user => {
    if (user) {
        whenSignedIn.hidden = false;
        whenSignedOut.hidden = true;
        userDetails.innerHTML = `<h3>Hello ${user.displayName}!</h3> <p>User ID: ${user.uid}</p>`;
        createCanvasBtn.onclick = () => firestore.collection('canvases').add({
            uid: user.uid
        });
        
    } else {
        whenSignedIn.hidden = true;
        whenSignedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});