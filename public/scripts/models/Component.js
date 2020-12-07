class Component {
    constructor(id, type, textContents, x, y) {
        this.id = id;
        this.type = type;
        this.textContents = textContents;
        this.x = x;
        this.y = y;
    }

    static create(type, x, y) {
        if (type == 'CLASS') {
            return new Component(null, 'CLASS', ['Class Name', 'Attributes', 'Methods'], x, y);
        } else if (type == 'INTERFACE') {
            return new Component(null, 'INTERFACE', ['Interface Name', 'Methods'], x, y);
        } else if (type == 'USECASE') {
            return new Component(null, 'USECASE', ['Use Case'], x, y);
        } else if (type == 'ACTOR') {
            return new Component(null, 'ACTOR', ['Actor Name'], x, y);
        }
        return null;
    }

    getHTMLElement() {
        var componentContainerDiv = document.createElement("div");
        componentContainerDiv.className = "canvas-component";
        componentContainerDiv.id = this.id;

        var dragHeader = document.createElement("div");

        var dragImage = document.createElement("img");
        dragImage.src = "images/drag.png";
        dragImage.className = "component-icon";
        dragImage.id = this.id + "header";

        var deleteComponentImage = document.createElement("img");
        deleteComponentImage.src = "images/delete-component.png";
        deleteComponentImage.className = "component-icon";
        deleteComponentImage.id = this.id + "delete";

        dragHeader.append(dragImage, deleteComponentImage);
        componentContainerDiv.append(dragHeader);
        
        componentContainerDiv.onmouseenter = function() {
            $(`#${this.id + "header"}`).animate({ opacity: 1.0 });
            $(`#${this.id + "delete"}`).animate({ opacity: 1.0 });
        };
    
        componentContainerDiv.onmouseleave = function() {
            $(`#${this.id + "header"}`).animate({ opacity: 0.0 });
            $(`#${this.id + "delete"}`).animate({ opacity: 0.0 });
        };

        if (this.type == 'CLASS') {
            var classNameHeader = document.createElement("th");
            var classAttributesDetails = document.createElement("td");
            var classMethodsDetails = document.createElement("td");

            classNameHeader.contentEditable = "true";
            classAttributesDetails.contentEditable = "true";
            classMethodsDetails.contentEditable = "true";

            classNameHeader.innerHTML = this.textContents[0];
            classNameHeader.className = "table-component-header";
            classAttributesDetails.innerHTML = this.textContents[1];
            classMethodsDetails.innerHTML = this.textContents[2];
            
            var classNameRow = document.createElement("tr");
            var classAttributesRow = document.createElement("tr");
            var classMethodsRow = document.createElement("tr");

            classNameRow.append(classNameHeader);
            classAttributesRow.append(classAttributesDetails);
            classMethodsRow.append(classMethodsDetails);

            var table = document.createElement("table");
            table.className = "table-component"; //todo implement its css
            table.append(classNameRow, classAttributesRow, classMethodsRow);

            componentContainerDiv.append(table);

            classNameHeader.onblur = () => this.updateTextContents(this.type, componentContainerDiv);
            classAttributesDetails.onblur = () => this.updateTextContents(this.type, componentContainerDiv);
            classMethodsDetails.onblur = () => this.updateTextContents(this.type, componentContainerDiv);

        } else if (this.type == 'INTERFACE') {
            var interfaceNameHeader = document.createElement("th");
            var interfaceMethodsDetails = document.createElement("td");
            
            interfaceNameHeader.contentEditable = "true";
            interfaceMethodsDetails.contentEditable = "true";

            interfaceNameHeader.className = "table-component-header";
            interfaceNameHeader.innerHTML = this.textContents[0];
            interfaceMethodsDetails.innerHTML = this.textContents[1];

            var interfaceNameRow = document.createElement("tr");
            var interfaceMethodsRow = document.createElement("tr");

            interfaceNameRow.append(interfaceNameHeader);
            interfaceMethodsRow.append(interfaceMethodsDetails);

            var table = document.createElement("table");
            table.className = "table-component";
            table.append(interfaceNameRow, interfaceMethodsRow);

            componentContainerDiv.append(table);

            interfaceNameHeader.onblur = () => this.updateTextContents(this.type, componentContainerDiv);
            interfaceMethodsDetails.onblur = () => this.updateTextContents(this.type, componentContainerDiv);

        } else if (this.type == 'USECASE') {
            var useCaseDiv = document.createElement("div");
            useCaseDiv.innerHTML = this.textContents[0];
            useCaseDiv.className = "use-case";
            useCaseDiv.contentEditable = "true";

            componentContainerDiv.append(useCaseDiv);

            useCaseDiv.onblur = () => updateTextContents(this.type, componentContainerDiv);
        } else if (this.type == 'ACTOR') {
            var actorImage = document.createElement("img");
            actorImage.src = "images/actor.png";
            actorImage.alt = "Actor";
            actorImage.className = "actor";

            var actorNameP = document.createElement("p");
            actorNameP.innerHTML = this.textContents[0];
            actorNameP.contentEditable = "true";
            actorNameP.className = "actor-name";

            var actorContainerDiv = document.createElement("div");
            actorContainerDiv.className = "actor-container";
            actorContainerDiv.append(actorImage, actorNameP);

            componentContainerDiv.append(actorContainerDiv);
            actorNameP.onblur = () => updateTextContents(this.type, componentContainerDiv);
        }
        return componentContainerDiv;
    }

    updateTextContents(type, html) {
        if (type == 'CLASS') {
            var componentClassName = html.getElementsByTagName("th")[0].innerHTML;
            var componentClassAttributes = html.getElementsByTagName("td")[0].innerHTML;
            var componentClassMethods = html.getElementsByTagName("td")[1].innerHTML;
            this.textContents = [componentClassName, componentClassAttributes, componentClassMethods];
            console.log(this.textContents);
        } else if (type == 'INTERFACE') {
            var componentInterfaceName = html.getElementsByTagName("th")[0].innerHTML;
            var componentInterfaceMethods = html.getElementsByTagName("td")[0].innerHTML;
            this.textContents = [componentInterfaceName, componentInterfaceMethods];
            
        } else if (type == 'USECASE') {
            var componentUseCase = html.getElementsByTagName("div")[0].innerHTML;
            this.textContents = [componentUseCase];

        } else if (type == 'ACTOR') {
            var componentActorName = html.getElementsByTagName("p")[0].innerHTML;
            this.textContents = [componentActorName];
        }
    }
}

var componentConverter = {
    toFirestore: function(component) {
        return {
            type: component.type,
            textContents: component.textContents,
            x: component.x,
            y: component.y
        }
    },
    fromFirestore: function(snapshot, options) {
        const data = snapshot.data(options);
        return new Component(data.id, data.type, data.textContents, data.x, data.y);
    }
}