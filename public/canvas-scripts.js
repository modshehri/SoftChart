const auth = firebase.auth();
const firestore = firebase.firestore();

//HTML Elements
const isCanvasFoundDiv = document.getElementById('isCanvasFound');
const isCanvasNotFoundDiv = document.getElementById('isCanvasNotFound');

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
        console.log(documentSnapshot.doc)
        if (documentSnapshot.doc == undefined) {
            isCanvasFoundDiv.hidden = true
            isCanvasNotFoundDiv.hidden = false
        } else {
            isCanvasFoundDiv.hidden = false
            isCanvasNotFoundDiv.hidden = true
        }
    }, err => {
        isCanvasFoundDiv.hidden = true
        isCanvasNotFoundDiv.hidden = false
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