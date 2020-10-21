const auth             = firebase.auth();
const firestore        = firebase.firestore();
const realtimeDatabase = firebase.database();

//HTML Elements
const isCanvasFoundDiv    = document.getElementById('isCanvasFound');
const isCanvasNotFoundDiv = document.getElementById('isCanvasNotFound');
const canvasNameDiv       = document.getElementById('canvasName');
const canvasAdminNameDiv  = document.getElementById('canvasAdminName');
const canvasMembersDiv    = document.getElementById('canvasMembers');
const mouse               = document.getElementById('mouse');

let canvasId = findGetParameter("id");
let canvasListener;
let sessionListener;

// Listening for user authentication state changes
auth.onAuthStateChanged(user => {
    unsubscribeListeners();
    if (user) {
        retrieveCanvasData(user.uid);
    } else {
        redirectToHomePage();
    }
});

function retrieveCanvasData(uid) {
    canvasListener = firestore
        .collection('canvases')
        .doc(`${ canvasId }`)
        .onSnapshot(documentSnapshot => {
            let canvasExists = documentSnapshot.exists;
            isCanvasFoundDiv.hidden = !canvasExists
            isCanvasNotFoundDiv.hidden = canvasExists

            if (canvasExists) {
                canvasNameDiv.innerHTML = `<h1>Canvas name: ${ documentSnapshot.data().canvasName }</h1>`;
                canvasAdminNameDiv.innerHTML = `<h2>Canvas admin: ${ documentSnapshot.data().adminUid }</h2>`;
                canvasMembersDiv.innerHTML = `<h2>Number of users: ${ documentSnapshot.data().users.length }</h2>`;

                realtimeDatabase.ref(`canvasSessions/${ documentSnapshot.id }/${ uid }`).set({
                    cursorPosition: '0,0'
                });
            }
        }, err => {
            isCanvasFoundDiv.hidden = true;
            isCanvasNotFoundDiv.hidden = false;
        });
}

function redirectToHomePage() {
    window.location.replace("https://www.softchart-3ee27.web.app/");
}

function unsubscribeListeners() {
    canvasListener && canvasListener.unsubscribe();
    sessionListener && sessionListener.unsubscribe();
}






function findGetParameter(parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
          tmp = item.split("=");
          if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
}

(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        // If pageX/Y aren't available and clientX/Y are,
        // calculate pageX/Y - logic taken from jQuery.
        // (This is to support old IE)
        if (event.pageX == null && event.clientX != null) {
            eventDoc = (event.target && event.target.ownerDocument) || document;
            doc = eventDoc.documentElement;
            body = eventDoc.body;

            event.pageX = event.clientX +
              (doc && doc.scrollLeft || body && body.scrollLeft || 0) -
              (doc && doc.clientLeft || body && body.clientLeft || 0);
            event.pageY = event.clientY +
              (doc && doc.scrollTop  || body && body.scrollTop  || 0) -
              (doc && doc.clientTop  || body && body.clientTop  || 0 );
        }

        // Use event.pageX / event.pageY here

        mouse.style = `position: absolute; top: ${ event.pageY }px; left: ${ event.pageX }px;`
        console.log(event.pageX)
    }
})();