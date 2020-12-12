var webSiteUsers = [];
var documents = [];

var usersTable = document.getElementById("users-table");
var usersTableBody = document.getElementById("users-table-body");



function createWebSiteUsersTable(){
    for(index in webSiteUsers){
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var emailCell = document.createElement("td");
        var IDCell = document.createElement("td");
        var statusCell = document.createElement("td");
        var prevligesCell = document.createElement("td");

        th.innerHTML = `${i+1}`;
        emailCell.innerHTML = webSiteUsers[index].email;
        IDCell.innerHTML = webSiteUsers[index].id;

        var blockButton = document.createElement("button");
        var adminButton = document.createElement("button");
        if (webSiteUsers[index].isBlocked){
            blockButton.className = "btn btn-success"
            blockButton.innerHTML = "Unblock"
        }else {
            blockButton.className = "btn btn-danger"
            blockButton.innerHTML = "Block"
        }
        statusCell.appendChild(blockButton);

        if (webSiteUsers[index].isAdmin){
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
