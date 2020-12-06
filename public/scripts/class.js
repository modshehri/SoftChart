window.onload = function () {
    var classComponent = new Component(null, 'CLASS', ["Class Name", "Attributes", "Methods"], null, null);
    document.getElementById("test").innerHTML = classComponent.getHTMLElement().innerHTML;
};
