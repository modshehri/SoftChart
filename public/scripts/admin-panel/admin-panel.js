var usersTable = document.getElementById("users-table");
var usersTableBody = document.getElementById("users-table-body");

var documentsTable = document.getElementById("documents-table");
var documentsTableBody = document.getElementById("documents-table-body");

function createWebsiteUsersTable() {
    var i = 1;
    for(index in websiteUsers) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");

        var emailCell = document.createElement("td");
        var IDCell = document.createElement("td");
        var statusCell = document.createElement("td");
        var prevligesCell = document.createElement("td");

        th.innerHTML = `${i}`;
        i++
        emailCell.innerHTML = websiteUsers[index].email;
        IDCell.innerHTML = websiteUsers[index].id;

        var blockButton = document.createElement("button");
        var adminButton = document.createElement("button");
        if (websiteUsers[index].isBlocked){
            blockButton.className = "btn btn-success"
            blockButton.innerHTML = "Unblock"
        }else {
            blockButton.className = "btn btn-danger"
            blockButton.innerHTML = "Block"
        }
        statusCell.appendChild(blockButton);

        if (websiteUsers[index].isAdmin){
            adminButton.className = "btn btn-warning"
            adminButton.innerHTML = "Depromote"
        }else {
            adminButton.className = "btn btn-warning"
            adminButton.innerHTML = "Promote"
        }

        prevligesCell.appendChild(adminButton);

        th.scope = "row";
        tr.appendChild(th);
        tr.appendChild(emailCell);
        tr.appendChild(IDCell);
        tr.appendChild(statusCell);
        tr.appendChild(prevligesCell);

        usersTableBody.appendChild(tr);
    }
}

function createWebsiteDocumentsTable() {
    var i = 1;
    for(index in websiteDocuments) {
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var IDCell = document.createElement("td");
        var adminCell = document.createElement("td");
        var nameCell = document.createElement("td");
        var numberOfUsersCell = document.createElement("td");
        var deleteCell = document.createElement("td");

        th.innerHTML = `${i}`;
        i++
        IDCell.innerHTML = websiteDocuments[index].id;
        adminCell.innerHTML = websiteDocuments[index].adminUid;
        nameCell.innerHTML = websiteDocuments[index].name;

        var deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger"
        deleteButton.innerHTML = "Delete"
        deleteCell.appendChild(deleteButton);
        var j = 0;
        for (index1 in websiteDocuments[index].users){
            j++
        }
        numberOfUsersCell.innerHTML = `${j}`;

        th.scope = "row";
        tr.appendChild(th);
        tr.appendChild(IDCell);
        tr.appendChild(adminCell);
        tr.appendChild(nameCell);
        tr.appendChild(numberOfUsersCell);
        tr.appendChild(deleteCell);

        documentsTableBody.appendChild(tr);
    }

}