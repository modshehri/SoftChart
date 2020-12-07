const canvas = document.getElementById("canvas");


var componentsListener;
var connectionsListener;

var components = [];
var connections = [];
var drawnConnections = [];

canvas.onclick = function() {
    if (currentModifyingComponent == null) {
        return;
    }
    console.log("saving..." + currentModifyingComponent.id);

    firestore
        .collection('documents')
        .doc(documentObject.id)
        .collection('components')
        .doc(currentModifyingComponent.id)
        .update({ textContents: currentModifyingComponent.textContents } );

    currentModifyingComponent = null;
}

var draggingComponent = null;
var currentModifyingComponent = null;

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
        firestore
            .collection('documents')
            .doc(documentObject.id)
            .collection('components')
            .doc(component.id)
            .delete();
    });

    function dragElement(elmnt) {
        // A neewly dropped element has id == null is not saved in the database, therefore, save it.
        if (component.id == null) {
            firestore
                .collection('documents')
                .doc(documentObject.id)
                .collection('components')
                .withConverter(componentConverter)
                .add(component)
        }
        
        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        if (document.getElementById(elmnt.id + "header")) {
            // if present, the header is where you move the DIV from:
            document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;

        } else {
            // otherwise, move the DIV from anywhere inside the DIV:
            elmnt.onmousedown = dragMouseDown;
        }

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // get the mouse cursor position at startup:
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // call a function whenever the cursor moves:
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // calculate the new cursor position:
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // set the element's new position:
            elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
        }

        function closeDragElement(e) {
            console.log("Ended Dragging");

            firestore
                .collection('documents')
                .doc(documentObject.id)
                .collection('components')
                .doc(component.id)
                .update({ textContents: component.textContents, x: e.clientX, y: e.clientY } );

            repositionAllConnections();
            // stop moving when mouse button is released:
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
        console.log(drawnConc);
        drawnConc.setOptions({
            color: "black",
            path: "grid",
            endPlug: "arrow3",
            size: 3
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