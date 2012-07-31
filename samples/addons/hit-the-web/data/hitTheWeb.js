const MAX_DEPTH = 2047;
const BASE_DEPTH_THRESHOLD = 900;
const HIT_DEPTH_THRESHOLD = 60;
const MAX_MINUS_BASE = MAX_DEPTH-BASE_DEPTH_THRESHOLD;
var Main = {
    start: function() {
        //document.addEventListener("click", Main.onclick, true);
        var canvas = document.createElement("canvas");
        canvas.setAttribute("style", "z-index:1000;position:fixed;left:0px;top:0px;width:100%;background-color:transparent;");
        canvas.setAttribute("width", "640");
        canvas.setAttribute("height", "480");
        document.body.appendChild(canvas);
        Main.canvas = canvas;
        Main.context = canvas.getContext("2d");
        Main.imagedata = Main.context.createImageData(640, 480);
        Main.next = Main.idle;
        Main.averageDepth = 0;

        var div = document.createElement("div");
        div.setAttribute("style", "z-index:1001;position:fixed;left:0px;top:0px;width:100%;height:100%;background-color:black;opacity: 0.5;");
        div.addEventListener("click", function() {
            document.body.removeChild(div);
            Main.next = Main.play;
        });
        document.body.appendChild(div);
        Main.next();
        
    }, 
    
    play: function() {
        var depthBuffer = document.kinect.getDepth();
        //binalize
        var totalX = 0;
        var totalY = 0;
        var validCount = 0;
        var wOfWindow = window.innerWidth;
        var hOfWindow = window.innerHeight;
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            var y = Math.floor(Math.floor(i / 640)/640 * wOfWindow);
            var x = Math.floor((i % 640)/640 * hOfWindow);
            if (depthBuffer[i] > BASE_DEPTH_THRESHOLD) {
                depthBuffer[i] = 0;
            } else if (depthBuffer[i] < Main.averageDepth-HIT_DEPTH_THRESHOLD) {
                depthBuffer[i] = 255;
                totalX += x;
                totalY += y;
                validCount += 1;
            } else {
                depthBuffer[i] = Math.floor(depthBuffer[i]/MAX_MINUS_BASE*255);
            }
        }
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            var depth = depthBuffer[i];
            var index = i * 4;
            Main.imagedata.data[index] = 0;
            Main.imagedata.data[index+1] = depth;
            Main.imagedata.data[index+2] = 0;
            Main.imagedata.data[index+3] = depth;
        }
        Main.context.putImageData(Main.imagedata, 0, 0);
        if (validCount > 100) {
            Main.canvas.style.visibility = "hidden";
            var hitX = Math.round(totalX/validCount);
            var hitY = Math.round(totalY/validCount);
            Main.hitElement(hitX, hitY);
            Main.canvas.style.visibility = "";
        }
        setTimeout(Main.next, 20);
    },
    
    idle: function() {
        var depthBuffer = document.kinect.getDepth();
        //binalize
        var total = 0;
        var validcount = 0;
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            if (depthBuffer[i] > BASE_DEPTH_THRESHOLD) {
                depthBuffer[i] = 0;
            } else {
                total += depthBuffer[i];
                validcount += 1;
                depthBuffer[i] = 255;
            }
        }
        Main.averageDepth = total/validcount;
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            var depth = depthBuffer[i];
            var index = i * 4;
            Main.imagedata.data[index] = 0;
            Main.imagedata.data[index+1] = depth;
            Main.imagedata.data[index+2] = 0;
            Main.imagedata.data[index+3] = depth;
        }
        Main.context.putImageData(Main.imagedata, 0, 0);
        setTimeout(Main.next, 20);
    },
    
    hitElement: function(x, y) {
        var element = document.elementFromPoint(x, y);
        if (null == element || element.nodeName == "HTML") {
            return;
        }

        var boundingRect = element.getBoundingClientRect();
        var x = (boundingRect.left+boundingRect.right)/2;
        var y = (boundingRect.top+boundingRect.bottom)/2;

        var parent = element.parentNode;
        var children = element.childNodes;
        for (var i = 0, n = children.length; i < n; i++) {
            try {
                parent.appendChild(children[i]);
            } catch (e) {}
        }
        parent.removeChild(element);
        
        var fadeElement = document.createElement("div");
        var style = "font-size:34px;border-radius: 10px;opacity: 1; z-index:1002;position:absolute;background-color:black;color: white;left:"+x+"px;top:"+y+"px";
        fadeElement.setAttribute("style", style);
        fadeElement.textContent = element.nodeName
        document.body.appendChild(fadeElement);
        
        $(fadeElement).animate({top: (y-100)+"px", opacity: 0.1}, 500, function() {
            document.body.removeChild(fadeElement);
        });
    },
    
    onclick: function(e) {
        Main.hitElement(e.clientX, e.clientY);
    },
}

Main.start();