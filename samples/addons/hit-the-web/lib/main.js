const widgets = require("widget");
const tabs = require("tabs");
const data = require("self").data;
const kinect = require("kinect.js");

function appendScripts2CurrentContent() {
    var {Cc, Ci} = require("chrome");
    var wm = Cc["@mozilla.org/appshell/window-mediator;1"]
                       .getService(Ci.nsIWindowMediator);
    var mainWindow = wm.getMostRecentWindow("navigator:browser");
    var content = mainWindow.gBrowser.contentDocument.wrappedJSObject;
    content.kinect = kinect;

    var jquery = content.createElement("script");
    jquery.setAttribute("src", data.url("jquery-1.7.2.min.js"));
    content.body.appendChild(jquery);
    var script = content.createElement("script");
    script.setAttribute("src", data.url("hitTheWeb.js"));
    content.body.appendChild(script);
}

var widget = widgets.Widget({
    id: "mozilla-link",
    label: "Mozilla website",
    contentURL: "http://www.mozilla.org/favicon.ico",
    onClick: function() {
        appendScripts2CurrentContent();
    }
});