const cursorsDiv = document.getElementById("cursors");

var cursorsListener = null;

function attachCursorsListener() {
    if (cursorsListener) { return; }
    cursorsListener = realtimeDatabase.ref(`documentSessions/${documentObject.id}`);

    cursorsListener.on('value', function (snapshot) {
        clearAllCursors();
        snapshot.forEach(function (childSnapshot) {
            var cursorUserId = childSnapshot.key;
            if (cursorUserId != user.uid) {
                var cursorHTML = createCursorHTML(childSnapshot.key, childSnapshot.val().x, childSnapshot.val().y);
                document.getElementById("cursors").append(cursorHTML);
            }
        });
    });
}

function clearAllCursors() {
    cursorsDiv.innerHTML = "";
}

function createCursorHTML(id, x, y) {
    var cursorContainer = document.createElement("div");
    cursorContainer.innerHTML = "*";
    cursorContainer.className = "cursor";
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
    if (user == null || documentObject == null) { return; }

    realtimeDatabase.ref(`documentSessions/${documentObject.id}/${user.uid}`).set({
        x: `${x}`,
        y: `${y}`
    });
}