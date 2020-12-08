const canvas = document.getElementById("canvas");

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
    var componentHTMLElement = component.getHTMLElement();
    componentHTMLElement.style.left = (x - 10) + "px";
    componentHTMLElement.style.top = (y - 10) + "px";
    canvas.append(componentHTMLElement);
    makeComponentDraggable(componentHTMLElement, component);
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
            var canvasPositioning = document.getElementById("canvas").getBoundingClientRect();
            var elementPositioning = elmnt.getBoundingClientRect();
            var elementWidth = elementPositioning.right - elementPositioning.left;
            var elementHeight = elementPositioning.bottom - elementPositioning.top;
            
            // set the element's new position:
            
            if((elmnt.offsetTop - pos2 >= canvasPositioning.top) && (elmnt.offsetTop - pos2  + elementHeight<= canvasPositioning.bottom)){
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            }
            
            if(elmnt.offsetLeft - pos1 >= canvasPositioning.left && elmnt.offsetLeft - pos1 + elementWidth<= canvasPositioning.right){
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
            
        }

        function closeDragElement(e) {


            console.log("Ended Dragging");

            var canvasPositioning = document.getElementById("canvas").getBoundingClientRect();
            var elementPositioning = elmnt.getBoundingClientRect();
            var elementWidth = elementPositioning.right - elementPositioning.left;
            var elementHeight = elementPositioning.bottom - elementPositioning.top;
            var x= e.clientX;
            var y= e.clientY;

            
            if(y <= canvasPositioning.top){
                console.log("Higher")
                y = canvasPositioning.top;
            }
            if((y + elementHeight>= canvasPositioning.bottom)){
                console.log("Lower")
                y = canvasPositioning.bottom - elementHeight;
            }
            if(x<= canvasPositioning.left){
                console.log("Lefter")
                x = canvasPositioning.left
            }
            if (x + elementWidth >= canvasPositioning.right){
                console.log("Righter")
                x = canvasPositioning.right - elementWidth;
            }

            firestore
                .collection('documents')
                .doc(documentObject.id)
                .collection('components')
                .doc(component.id)
                .update({ textContents: component.textContents, x: x, y: y } );
            
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