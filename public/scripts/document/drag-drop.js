function dropComponent(event) {
    var componentType = event.dataTransfer.getData("ComponentType");
    var x = event.clientX;
    var y = event.clientY;

    var canvasPositioning = document.getElementById("canvas").getBoundingClientRect();

    var pureX = x - canvasPositioning.left;
    var pureY = y - canvasPositioning.top;

    var component = Component.create(componentType, pureX, pureY);
    drawComponent(component);
}

function dragComponent(ev, componentType) {
    ev.dataTransfer.setData("ComponentType", componentType);
}

function allowDrop(ev) {
    ev.preventDefault();
}

function makeComponentDraggable(htmlElement, component) {
    dragElement(htmlElement);

    htmlElement.onclick = function() {
        currentModifyingComponent = component;
    }

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

            // Prevent dragging components outside of document.
            if((elmnt.offsetTop - pos2 >= 0)) {
                elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
            }
            if(elmnt.offsetLeft - pos1 >= 0) {
                elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
            }
        }

        // Called after dropping an element
        function closeDragElement(e) {
            var canvasPositioning = document.getElementById("canvas").getBoundingClientRect();

            var x= e.clientX;
            var y= e.clientY;

            var pureX = x - canvasPositioning.left;
            var pureY = y - canvasPositioning.top;

            // Prevent dropping element out of document
            pureY = pureY < 0 ? 10 : pureY;
            pureX = pureX < 0 ? 10 : pureX;

            updateComponent(documentObject.id, component.id, { textContents: component.textContents, x: pureX, y: pureY });
            repositionAllConnections();

            // Stop moving when mouse button is released
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}