const test = document.getElementById("test");

window.onload = function() {
    test.append(Component.create("ACTOR", 0, 0).getHTMLElement());
}