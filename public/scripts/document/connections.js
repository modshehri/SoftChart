var connectionsListener = null;
var connections         = [];
var drawnConnections    = [];
var connectFromId       = null;

// Firestore Function
function attachDocumentConnectionsListener() {
    if (this.connectionsListener) { return; }

    connectionsListener = firestore
        .collection('documents')
        .doc(documentObject.id)
        .collection('connections')
        .onSnapshot(function (querySnapshot) {
            clearAllConnections();
            var connections = [];
            querySnapshot.forEach(function (doc) {
                var c = new Connection(doc.id, doc.data().fromId, doc.data().toId);
                connections.push(c);
            });
            console.log(connections);
            drawAllConnections(connections);
    });
}

function deleteConnection(docId, connId) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('connections')
        .doc(connId)
        .delete();
}

function addConnection(docId, connection) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('connections')
        .withConverter(connectionConverter)
        .add(connection);
}


// Rendering Connections Functions
function repositionAllConnections() {
    clearDrawnConnections();
    drawAllConnections(this.connections);
}

function drawAllConnections(connections) {
    for (index in connections) {
        var conc = connections[index];
        var drawnConc = new LeaderLine(document.getElementById(conc.fromId), document.getElementById(conc.toId));
        drawnConc.setOptions({
            color: "black",
            path: "grid",
            endPlug: "arrow3",
            size: 2
        });
        drawnConc.show();
        this.drawnConnections.push(drawnConc);
    }
    this.connections = connections;
}

function clearAllConnections() {
    for (index in this.drawnConnections) {
        this.drawnConnections[index].remove();
    }
    this.drawnConnections = [];
    this.connections = [];
}

function clearDrawnConnections() {
    for (index in this.drawnConnections) {
        this.drawnConnections[index].remove();
    }
    this.drawnConnections = [];
}

function handleConnectionClick(clickedId) {
    if (!this.connectFromId) {
        this.connectFromId = clickedId;
        setConnectionPromptHidden(false);
    } else {
        if (this.connectFromId != clickedId) {
            var connection = Connection.create(this.connectFromId, clickedId);
            addConnection(documentObject.id, connection);
        }

        this.connectFromId = null;
        setConnectionPromptHidden(true);
    }
}

function setConnectionPromptHidden(hidden) {
    hidden ? $("#connection-prompt").fadeOut() : $("#connection-prompt").fadeIn();
}

function abortConnectingComponents() {
    setConnectionPromptHidden(true);
    connectFromId = null;
}