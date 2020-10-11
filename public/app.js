const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('wwhenSignedOut');

const signInbtn = document.getElementById('signInBtn');
const signOutBtn= document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider()

signInbtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();