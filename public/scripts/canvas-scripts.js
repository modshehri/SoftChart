const myDocs = document.getElementById("DocsButton");
const umcButton = document.getElementById("user-management-button");
const canvasShadowDiv = document.getElementById("canvas-shadow");
const userManagementDiv = document.getElementById("user-management");

myDocs.onclick = function () {
    location.href = "documents.html";
};

umcButton.onclick = function() {
    $(`#${canvasShadowDiv.id}`).css({"z-index": "1"});
    $(`#${userManagementDiv.id}`).css({"z-index": "1"});
    $(`#${canvasShadowDiv.id}`).fadeIn('slow');
    $(`#${userManagementDiv.id}`).fadeIn('slow');
}

canvasShadowDiv.onclick = function() {
    $(`#${canvasShadowDiv.id}`).fadeOut('slow', function() {
        $(`#${canvasShadowDiv.id}`).css({"z-index": "0"});
    });

    $(`#${userManagementDiv.id}`).fadeOut('slow', function() {
        $(`#${userManagementDiv.id}`).css({"z-index": "0"});
    });
}