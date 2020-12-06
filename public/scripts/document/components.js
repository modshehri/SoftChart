const canvas = document.getElementById("canvas");

var draggingComponent = null;

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
    html.style.left = (component.x - 125) + "px";
    html.style.top = (component.y - 65) + "px";
    makeComponentDraggable(html, component);
    canvas.append(html);
}

function dropComponent(event) {
    var componentType = event.dataTransfer.getData("ComponentType");
    var x = event.clientX;
    var y = event.clientY;
    drawNewComponent(componentType, x, y);
}

function drawNewComponent(componentType, x, y) {
    var component = Component.create(componentType, x, y);
    var componentHTMLElement = component.getHTMLElement();
    componentHTMLElement.style.left = (x - 125) + "px";
    componentHTMLElement.style.top = (y - 65) + "px";
    makeComponentDraggable(componentHTMLElement, component);
    canvas.append(componentHTMLElement);
}

function makeComponentDraggable(htmlElement, component) {
    dragElement(htmlElement);

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
            console.log("Started Dragging");

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
            console.log("Dragging");

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
                .update({ x: e.clientX, y: e.clientY } )

            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

function retrieveDocumentComponents() {
    firestore
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
        });
}

function clearAllComponents() {
    canvas.innerHTML = "";
}