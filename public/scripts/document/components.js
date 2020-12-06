const canvas = document.getElementById("canvas");

function allowDrop(ev) {
    ev.preventDefault();
}

function dragComponent(ev, componentType) {
    ev.dataTransfer.setData("ComponentType", componentType);
}

function drawComponent(event) {
    var componentType = event.dataTransfer.getData("ComponentType");
    var x = event.clientX;
    var y = event.clientY;

    var componentElement = Component.create(componentType, x, y).getHTMLElement();
    
    componentElement.style.left = (x - 125) + "px";
    componentElement.style.top = (y - 65) + "px";

    makeComponentDraggable(componentElement);
    console.log("sdf1");
    canvas.append(componentElement);
}

function makeComponentDraggable(comp) {
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
            console.log("sdf2");

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
            console.log("sdf3");

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
            console.log("sdf4");

            // stop moving when mouse button is released:
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }
}

//Un-needed methods
// function dragClass(ev) {
//     ev.dataTransfer.setData("ComponentType", "Class");
// }
// function dragInterfice(ev) {
//     ev.dataTransfer.setData("ComponentType", "Interfice");
// }

// function addClass(type, x, y) {
//     var classComponent = document.createElement("Div"); //DONE
//     var classTitle = document.createElement("p");       //DONE
//     var textnode = document.createTextNode(type);       //DONE
//     classComponent.className = "ClassComponent";        //DONE
//     classTitle.appendChild(textnode);                   //DONE
//     classComponent.appendChild(classTitle);             //DONE
//     classComponent.style.left = (x - 125) + "px";       //DONE
//     classComponent.style.top = (y - 65) + "px";         //DONE
//     canvas.appendChild(classComponent);                 //DONE
//     classTitle.contentEditable = "true";                //DONE
//     makeComponentDraggable(classComponent);             //DONE
// }

// function drop(ev) {
//     var componentType = ev.dataTransfer.getData("ComponentType");
//     var x = ev.clientX;
//     var y = ev.clientY;
//     drawComponent(componentType, x, y);
// }