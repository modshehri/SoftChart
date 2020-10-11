const auth = firebase.auth();

const whenSignedIn = document.getElementById('whenSignedIn');
const whenSignedOut = document.getElementById('wwhenSignedOut');

const signInbtn = document.getElementById('signInBtn');
const signOutBtn= document.getElementById('signOutBtn');

const userDetails = document.getElementById('userDetails');

const provider = new firebase.auth.GoogleAuthProvider()

signInbtn.onclick = () => auth.signInWithPopup(provider);
signOutBtn.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if(user){
        whenSignedIn.hidden = 'false';
        whenSignedOut.hidden = 'true';
        userDetails.innerHTML = '<h3>Hello ${user.displayName}</h3>'
    }else{
        whenSignedIn.hidden = 'true';
        whenSignedOut.hidden = 'false';
        userDetails.innerHTML = ''
    }
})