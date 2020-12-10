function dropComponent(event) {
    var componentType = event.dataTransfer.getData("ComponentType");
    var x = event.clientX;
    var y = event.clientY;

    var component = Component.create(componentType, x, y);
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