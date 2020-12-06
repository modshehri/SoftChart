class Component {
    constructor(id, type, textContents, x, y) {
        this.id = id;
        this.type = type;
        this.textContents = textContents;
        this.x = x;
        this.y = y;
    }

    getHTML() {
        var componentContainerDiv = document.createElement("div");
        
        if (this.type == 'CLASS') {
            var classNameHeader = document.createElement("th");
            var classAttributesDetails = document.createElement("td");
            var classMethodsDetails = document.createElement("td");

            classNameHeader.contentEditable = "true";
            classAttributesDetails.contentEditable = "true";
            classMethodsDetails.contentEditable = "true";

            classNameHeader.innerHTML = this.textContents[0];
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

        } else if (this.type == 'INTERFACE') {
            var interfaceNameHeader = document.createElement("th");
            var interfaceMethodsDetails = document.createElement("td");
            
            interfaceNameHeader.contentEditable = "true";
            interfaceMethodsDetails.contentEditable = "true";

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

        } else if (this.type == 'USECASE') {
            var useCaseDiv = document.createElement("div");
            useCaseDiv.innerHTML = this.textContents[0];
            useCaseDiv.className = "use-case";

            componentContainerDiv.append(useCaseDiv);

        } else if (this.type == 'ACTOR') {
            var actorImage = document.createElement("img");
            actorImage.src = "images/actor.png";
            actorImage.alt = "Actor";
            actorImage.className = "actor";

            var actorNameP = document.createElement("p");
            actorNameP.innerHTML = this.textContents[0];

            componentContainerDiv.append(actorImage, actorNameP);

        }
        return componentContainerDiv;
    }
}