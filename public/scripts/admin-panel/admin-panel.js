var usersTable = document.getElementById("users-table");
var usersTableBody = document.getElementById("users-table-body");

var documentsTable = document.getElementById("documents-table");
var documentsTableBody = document.getElementById("documents-table-body");

function createWebsiteUsersTable() {
    var i = 1;
    usersTableBody.innerHTML = ""
    
    websiteUsers.forEach(user => {
        var tr = document.createElement("tr");
        var th = document.createElement("th");

        var emailCell = document.createElement("td");
        var IDCell = document.createElement("td");
        var statusCell = document.createElement("td");
        var prevligesCell = document.createElement("td");

        th.innerHTML = `${i}`;
        i++;
        emailCell.innerHTML = user.email;
        IDCell.innerHTML = user.id;

        var blockButton = document.createElement("button");
        var adminButton = document.createElement("button");

        if (user.isBlocked) {
            blockButton.className = "btn btn-success";
            blockButton.innerHTML = "Unblock";
        } else {
            blockButton.className = "btn btn-danger";
            blockButton.innerHTML = "Block";
        }

        blockButton.onclick = function() {
            setUserBlocked(user.id, !(user.isBlocked));
        }


        statusCell.appendChild(blockButton);

        if (user.isWebsiteAdmin) {
            adminButton.className = "btn btn-warning"
            adminButton.innerHTML = "Depromote"
        } else {
            adminButton.className = "btn btn-primary"
            adminButton.innerHTML = "Promote"
        }
        adminButton.onclick = function() {
            setUserAdminRole(user.id, !(user.isWebsiteAdmin));
        }

        prevligesCell.appendChild(adminButton);

        th.scope = "row";
        tr.appendChild(th);
        tr.appendChild(emailCell);
        tr.appendChild(IDCell);
        tr.appendChild(statusCell);
        tr.appendChild(prevligesCell);

        usersTableBody.appendChild(tr);
    });
}

function createWebsiteDocumentsTable() {
    var i = 1;
    documentsTableBody.innerHTML = "";
    websiteDocuments.forEach(docObj => {
        var tr = document.createElement("tr");
        var th = document.createElement("th");

        var IDCell = document.createElement("td");
        var adminCell = document.createElement("td");
        var nameCell = document.createElement("td");
        var numberOfUsersCell = document.createElement("td");
        var deleteCell = document.createElement("td");

        th.innerHTML = `${i}`;
        i++;

        IDCell.innerHTML = docObj.id;
        adminCell.innerHTML = docObj.adminUid;
        nameCell.innerHTML = docObj.name;

        var deleteButton = document.createElement("button");
        deleteButton.className = "btn btn-danger"
        deleteButton.innerHTML = "Delete"

        deleteButton.onclick = function() {
            deleteDocument(docObj.id);
        }

        deleteCell.appendChild(deleteButton);
        numberOfUsersCell.innerHTML = `${docObj.users.length}`;

        th.scope = "row";
        tr.appendChild(th);
        tr.appendChild(IDCell);
        tr.appendChild(adminCell);
        tr.appendChild(nameCell);
        tr.appendChild(numberOfUsersCell);
        tr.appendChild(deleteCell);
        documentsTableBody.appendChild(tr);
    });
}

