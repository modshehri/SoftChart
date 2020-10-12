const auth = firebase.auth();
const firestore = firebase.firestore();

//HTML Elements
const isCanvasFoundDiv = document.getElementById('isCanvasFound');
const isCanvasNotFoundDiv = document.getElementById('isCanvasNotFound');

const canvasNameDiv = document.getElementById('canvasName');
const canvasAdminNameDiv = document.getElementById('canvasAdminName');
const canvasMembersDiv = document.getElementById('canvasMembers');
const userName = document.getElementById('userName');

const mouse = document.getElementById('mouse');

auth.onAuthStateChanged(user => {
    if (user) {
        var name = user.name
        userName.innerHTML = name;
    } else {
        window.location.replace("https://softchart-3ee27.web.app/");
    }
});

let canvasListener;

canvasListener = firestore
    .collection('canvases')
    .doc(`${ findGetParameter("id") }`)
    .onSnapshot(documentSnapshot => {
        if (documentSnapshot.exists == false) {
            isCanvasFoundDiv.hidden = true;
            isCanvasNotFoundDiv.hidden = false;
        } else {
            isCanvasFoundDiv.hidden = false;
            isCanvasNotFoundDiv.hidden = true;

            canvasNameDiv.innerHTML = `<h1>Canvas name: ${ documentSnapshot.data().canvasName }</h1>`;
            canvasAdminNameDiv.innerHTML = `<h2>Canvas admin: ${ documentSnapshot.data().adminUid }</h2>`;
            canvasMembersDiv.innerHTML = `<h2>Number of users: ${ documentSnapshot.data().users.length }</h2>`;
            
        }
    }, err => {
        isCanvasFoundDiv.hidden = true;
        isCanvasNotFoundDiv.hidden = false;
    });

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

        mouse.style = `display: flexbox; position: absolute; left: ${event.pageX}px; top: ${event.pageY}px; width: 100%; height: 100%;`
        console.log(event.pageX)
    }
})();