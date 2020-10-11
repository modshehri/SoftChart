const auth = firebase.auth();
const firestore = firebase.firestore();

//HTML Elements
const isCanvasFoundDiv = document.getElementById('isCanvasFound');
const isCanvasNotFoundDiv = document.getElementById('isCanvasNotFound');

const canvasNameDiv = document.getElementById('canvasName');
const canvasAdminNameDiv = document.getElementById('canvasAdminName');
const canvasMembersDiv = document.getElementById('canvasMembers');

auth.onAuthStateChanged(user => {
    if (!user) {
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