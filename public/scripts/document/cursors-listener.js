const cursorsDiv = document.getElementById("cursors");

var cursorsListener = null;

function attachCursorsListener() {
    if (cursorsListener) { return; }
    cursorsListener = realtimeDatabase.ref(`documentSessions/${documentObject.id}`);

    cursorsListener.on('value', function (snapshot) {
        clearAllCursors();
        snapshot.forEach(function (childSnapshot) {
            var cursorUserId = childSnapshot.key;
            var cursorX = childSnapshot.val().x;
            var cursorY = childSnapshot.val().y;
            var email = documentUsers.find(user => user.id == cursorUserId).email;

            if (cursorUserId != user.uid && cursorX > 0 && cursorY > 0 && email != null) {
                var cursorHTML = createCursorHTML(email, childSnapshot.val().x, childSnapshot.val().y);
                document.getElementById("cursors").append(cursorHTML);
            }
        });
    });
}
    
function clearAllCursors() {
    cursorsDiv.innerHTML = "";
}

function createCursorHTML(email, x, y) {
    var cursorImg = document.createElement("img");
    cursorImg.src = "images/cursor.svg"
    cursorImg.style.width = "100%";
    cursorImg.style.height = "100%";

    var cursorEmail = document.createElement("p");
    cursorEmail.innerHTML = email.substring(0, email.indexOf("@"));
    cursorEmail.className = "cursor-email";

    var cursorContainer = document.createElement("div");
    cursorContainer.className = "cursor";
    cursorContainer.append(cursorImg, cursorEmail);

    cursorContainer.style.left = x + "px";
    cursorContainer.style.top = y + "px";
    return cursorContainer;
}

(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;
        
        event = event || window.event;
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
        var canvasPosition = canvas.getBoundingClientRect();

        var mouseX = event.pageX - canvasPosition.left;
        var mouseY = event.pageY - canvasPosition.top;

        setDatabaseMousePosition(mouseX, mouseY);
    }
})();

function setDatabaseMousePosition(x, y) {
    if (this.user == null || this.documentObject == null) { return; }

    realtimeDatabase.ref(`documentSessions/${documentObject.id}/${user.uid}`).set({
        x: `${x}`,
        y: `${y}`
    });
}