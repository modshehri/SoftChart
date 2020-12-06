const canvas = document.getElementById("canvas");
function allowDrop(ev) {
    ev.preventDefault();
}

function dragClass(ev) {
    ev.dataTransfer.setData("ComponentType", "Class");
}
function dragInterfice(ev) {
    ev.dataTransfer.setData("ComponentType", "Interfice");
}

function drop(ev) {
    var data = ev.dataTransfer.getData("ComponentType");
    var x = ev.clientX;
    var y = ev.clientY;
    if (data == "Class") {
        addClass("Class", x, y);
    } else if (data == "Interfice") {
        addClass("Interfice", x, y);
    }
}

function addClass(type, x, y) {
    var classComponent = document.createElement("Div");
    var classTitle = document.createElement("p");
    var textnode = document.createTextNode(type);
    classComponent.className = "ClassComponent";
    classTitle.appendChild(textnode);
    classComponent.appendChild(classTitle);
    classComponent.style.left = (x - 125) + "px";
    classComponent.style.top = (y - 65) + "px";
    canvas.appendChild(classComponent);
    classTitle.contentEditable = "true";
    makeClassDragable(classComponent);
}

function addInterfice() {
    var traingleComponent = document.createElement("Div");
    var classTitle = document.createElement("p");
    var textnode = document.createTextNode("Interfice");
    classComponent.className = "ClassComponent";
    classTitle.appendChild(textnode);
    classComponent.appendChild(classTitle);
    canvas.appendChild(classComponent);
    classTitle.contentEditable = "true";
    makeClassDragable(classComponent);
}

// Make the DIV element draggable:
function makeClassDragable(comp) {
    dragElement(comp);

    function dragElement(elmnt) {
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

        function closeDragElement() {
            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}