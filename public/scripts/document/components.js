const canvas = document.getElementById("canvas");

var componentsListener;
var connectionsListener;

var components = [];
var connections = [];
var drawnConnections = [];

var connectFromId;

var draggingComponent = null;
var currentModifyingComponent = null;

/*
    This method is used to achieve two goals. And it is called when ever the document gets clicked.
    1- If a user was modifying a component (e.g. changing the class name),
    this method will call the "updateComponent" method which will save the modified component to the database.

    2- If the user initiated a "connection" process (i.e. connecting two components with a line),
    this method will abort the connection process and hide the connection prompt.
*/

document.onclick = function() {
    //If the document was clicked, and a connection was initiated, abort the connection.
    if (connectFromId != null) { abortConnectingComponents(); }
    if (currentModifyingComponent != null) { updateRecentlyModifiedComponent(); }
}

function abortConnectingComponents() {
    setConnectionPromptHidden(true);
    connectFromId = null;
}

function updateRecentlyModifiedComponent() {
    updateComponent(documentObject.id, currentModifyingComponent.id, { textContents: currentModifyingComponent.textContents });
    currentModifyingComponent = null;
}

function allowDrop(ev) {
    ev.preventDefault();
}

function dragComponent(ev, componentType) {
    ev.dataTransfer.setData("ComponentType", componentType);
}

function drawComponents(components) {
    for (index in components) {
        drawComponent(components[index]);
    }
}

function drawComponent(component) {
    var html = component.getHTMLElement();
    html.style.left = (component.x - 10) + "px";
    html.style.top = (component.y - 10) + "px";
    canvas.append(html);
    makeComponentDraggable(html, component);
}

function dropComponent(event) {
    var componentType = event.dataTransfer.getData("ComponentType");
    var x = event.clientX;
    var y = event.clientY;
    drawNewComponent(componentType, x, y);
}

function drawNewComponent(componentType, x, y) {
    var component = Component.create(componentType, x, y);
    drawComponent(component);
}

function makeComponentDraggable(htmlElement, component) {
    dragElement(htmlElement);

    htmlElement.onclick = function() {
        currentModifyingComponent = component;
    }

    $("#" + component.id).click(function(event) {
        event.stopPropagation();
    });

    $("#" + component.id + "delete").click(function(event) {
        handleDeletionClick(component.id);
    });

    $("#" + component.id + "connect").click(function(event) {
        handleConnectionClick(component.id);
    });

    function dragElement(elmnt) {
        // A neewly dropped element has id == null is not saved in the database, therefore, save it by adding it to Firestore.
        if (component.id == null) {
            addComponent(documentObject.id, component);
        }
        
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        // Set drag point
        if (document.getElementById(elmnt.id + "header")) {
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
        } else {
            elmnt.onmousedown = dragMouseDown;
        }

        // Called when clicked on an element
        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
        }

        // Called when dragging an element
        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();

            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            var canvasPositioning = document.getElementById("canvas").getBoundingClientRect();
            var elementPositioning = elmnt.getBoundingClientRect();
            var elementWidth = elementPositioning.right - elementPositioning.left;
            var elementHeight = elementPositioning.bottom - elementPositioning.top;

            // Prevent dragging components outside of document.
            if((elmnt.offsetTop - pos2 >= canvasPositioning.top) && (elmnt.offsetTop - pos2  + elementHeight <= canvasPositioning.bottom)){
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            }
            if(elmnt.offsetLeft - pos1 >= canvasPositioning.left && elmnt.offsetLeft - pos1 + elementWidth <= canvasPositioning.right){
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
        }

        // Called after dropping an element
        function closeDragElement(e) {
            var canvasPositioning = document.getElementById("canvas").getBoundingClientRect();

            var elementPositioning = elmnt.getBoundingClientRect();
            var elementWidth = elementPositioning.right - elementPositioning.left;
            var elementHeight = elementPositioning.bottom - elementPositioning.top;
            var x= e.clientX;
            var y= e.clientY;

            // Prevent dropping element out of document
            if(y <= canvasPositioning.top) {
                y = canvasPositioning.top;
            }
            if((y + elementHeight >= canvasPositioning.bottom)) {
                y = canvasPositioning.bottom - elementHeight;
            }
            if(x <= canvasPositioning.left) {
                x = canvasPositioning.left
            }
            if (x + elementWidth >= canvasPositioning.right) {
                x = canvasPositioning.right - elementWidth;
            }

            updateComponent(documentObject.id, component.id, { textContents: component.textContents, x: x, y: y });
            repositionAllConnections();

            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

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
            drawAllConnections(connections);
    });
}

function attachDocumentComponentsListener() {
    if (this.componentsListener) { return; }

    componentsListener = firestore
        .collection('documents')
        .doc(documentObject.id)
        .collection('components')
        .onSnapshot(function (querySnapshot) {
            clearAllComponents();
            var components = [];
            querySnapshot.forEach(function (doc) {
                components.push(new Component(doc.id, doc.data().type, doc.data().textContents, doc.data().x, doc.data().y));
            });
            drawComponents(components);
        
        attachDocumentConnectionsListener();
    });
}

function repositionAllConnections() {
    clearDrawnConnections();
    drawAllConnections(this.connections);
}

function clearAllComponents() {
    canvas.innerHTML = "";
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
        console.log(this.connectFromId);
        setConnectionPromptHidden(false);
    } else {
        var connection = Connection.create(this.connectFromId, clickedId);
        this.connectFromId = null;
        addConnection(documentObject.id, connection);
        setConnectionPromptHidden(true);
    }
}

function handleDeletionClick(clickedId) {
    for (connectionIndex in this.connections) {
        var conc = this.connections[connectionIndex];
        if (conc.fromId == clickedId || conc.toId == clickedId) {
            deleteConnection(documentObject.id, conc.id);
        }
    }
    
    deleteComponent(ocumentObject.id, clickedId);
}

function deleteComponent(docId, compId) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('components')
        .doc(compId)
        .delete();
}

function deleteConnection(docId, connId) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('connections')
        .doc(connId)
        .delete();
}

function addComponent(docId, component) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('components')
        .withConverter(componentConverter)
        .add(component)
}

function addConnection(docId, connection) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('connections')
        .withConverter(connectionConverter)
        .add(connection);
}

function setConnectionPromptHidden(hidden) {
    hidden ? $("#connection-prompt").fadeOut() : $("#connection-prompt").fadeIn();
}

function updateComponent(docId, compId, fields) {
    firestore
        .collection('documents')
        .doc(docId)
        .collection('components')
        .doc(compId)
        .update(fields);
}