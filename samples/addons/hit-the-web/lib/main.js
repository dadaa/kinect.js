const widgets = require("widget");
const data = require("self").data;
const workers = require("content/worker");
const windows = require("window-utils");
const {Cc, Ci} = require("chrome");
const kinect = require("kinect.js");
const url = require("url");

const scriptContent = require("file").read(url.toFilename(data.url("image-processing.js")));

function appendScripts2CurrentContent() {
    let window = windows.activeWindow;
    //to use from context of content script in worker thread 
    window.kinect = kinect;
    let content = window.gBrowser.contentDocument.wrappedJSObject;
    //call from user content document
    content.kinect = kinect;
    content.kinectImageProcessingScript = scriptContent;
    //performance
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