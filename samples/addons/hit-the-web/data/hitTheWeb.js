/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

var MAX_DEPTH = 2047;
var BASE_DEPTH_THRESHOLD = 900;
var HIT_DEPTH_THRESHOLD = 60;
var MAX_MINUS_BASE = MAX_DEPTH-BASE_DEPTH_THRESHOLD;
var Main = {
    start: function() {
        Main.buffer = document.kinect.createDepthBuffer();
        Main.depthBuffer = new Array(Main.buffer.length);

        var canvas = document.createElement("canvas");
        canvas.setAttribute("style", "z-index:1000;position:fixed;left:0px;top:0px;width:100%;background-color:transparent;");
        canvas.setAttribute("width", "640");
        canvas.setAttribute("height", "480");
        document.body.appendChild(canvas);
        Main.canvas = canvas;
        Main.context = canvas.getContext("2d");
        Main.imagedata = Main.context.createImageData(640, 480);
        for (var i = 0, n = Main.depthBuffer.length; i < n; i++) {
            var index = i * 4;
            Main.imagedata.data[index] = 0;
            Main.imagedata.data[index+2] = 0;
        }
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
var time1 = (new Date()).getTime();
        document.kinect.getDepthTo(Main.buffer);

var time2 = (new Date()).getTime();
        var depthBuffer = Main.depthBuffer;
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            depthBuffer[i] = Main.buffer[i];
        }

var time3 = (new Date()).getTime();
        //binalize
        var totalX = 0;
        var totalY = 0;
        var validCount = 0;
        var wOfWindow = window.innerWidth;
        var hOfWindow = window.innerHeight;
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            if (depthBuffer[i] > BASE_DEPTH_THRESHOLD) {
                depthBuffer[i] = 0;
            } else if (depthBuffer[i] < Main.averageDepth-HIT_DEPTH_THRESHOLD) {
                var y = Math.floor(Math.floor(i / 640)/640 * wOfWindow);
                var x = Math.floor((i % 640)/640 * hOfWindow);
                depthBuffer[i] = 255;
                totalX += x;
                totalY += y;
                validCount += 1;
            } else {
                depthBuffer[i] = Math.floor(depthBuffer[i]/MAX_MINUS_BASE*255);
            }
        }

var time4 = (new Date()).getTime();
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            var depth = depthBuffer[i];
            var index = i * 4;
            Main.imagedata.data[index+1] = depth;
            Main.imagedata.data[index+3] = depth;
        }

var time5 = (new Date()).getTime();
        Main.context.putImageData(Main.imagedata, 0, 0);

var time6 = (new Date()).getTime();
        if (validCount > 100) {
            Main.canvas.style.visibility = "hidden";
            var hitX = Math.round(totalX/validCount);
            var hitY = Math.round(totalY/validCount);
            Main.hitElement(hitX, hitY);
            Main.canvas.style.visibility = "";
        }
var time7 = (new Date()).getTime();

window.dump("1:"+(time2-time1)+"\n");//capture :
window.dump("2:"+(time3-time2)+"\n");//copy:
window.dump("3:"+(time4-time3)+"\n");//binalize:
window.dump("4:"+(time5-time4)+"\n");//copy to imagadata:
window.dump("5:"+(time6-time5)+"\n");//draw:
window.dump("6:"+(time7-time6)+"\n");//find:
window.dump("total:"+(time7-time1)+"\n");

        setTimeout(Main.next, 20);
    },
    
    idle: function() {
var time1 = (new Date()).getTime();
        document.kinect.getDepthTo(Main.buffer);

var time2 = (new Date()).getTime();
        //addon で作ったバッファを、document のバッファに変換すると断然早い
        //var depthBuffer = Main.buffer;
        //copy
        //Array.apply(null, Main.buffer) : 120ms
        var depthBuffer = Array.apply(null, Main.buffer);
        //for で順繰りコピーすると遅い： 130ms でもメモリとか考えると、こっちの方がいい？
        //var depthBuffer = Main.depthBuffer;
        //for (var i = 0, n = depthBuffer.length; i < n; i++) {
        //    depthBuffer[i] = Main.buffer[i];
        //}

var time3 = (new Date()).getTime();
        //binalize
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            if (depthBuffer[i] > BASE_DEPTH_THRESHOLD) {
                depthBuffer[i] = 0;
            } else {
                depthBuffer[i] = 255;
            }
        }

var time4 = (new Date()).getTime();
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            var depth = depthBuffer[i];
            var index = i * 4;
            Main.imagedata.data[index+1] = depth;
            Main.imagedata.data[index+3] = depth;
        }

var time5 = (new Date()).getTime();
        Main.context.putImageData(Main.imagedata, 0, 0);
var time6 = (new Date()).getTime();
        
window.dump("1:"+(time2-time1)+"\n");//capture :
window.dump("2:"+(time3-time2)+"\n");//copy: 
window.dump("3:"+(time4-time3)+"\n");//binalize: 
window.dump("4:"+(time5-time4)+"\n");//copy to imagedata:
window.dump("5:"+(time6-time5)+"\n");//draw:
window.dump("total:"+(time6-time1)+"\n");
//original : 
//capture : 1
//binalize: 284
//copy: 218
//draw: 3

        setTimeout(Main.next, 20);
    },
    _idle: function() {
var time1 = (new Date()).getTime();
        document.kinect.getDepthTo(Main.buffer);
var time2 = (new Date()).getTime();
        var depthBuffer = Main.buffer;
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
var time3 = (new Date()).getTime();
        Main.averageDepth = total/validcount;
        for (var i = 0, n = depthBuffer.length; i < n; i++) {
            var depth = depthBuffer[i];
            var index = i * 4;
            Main.imagedata.data[index] = 0;
            Main.imagedata.data[index+1] = depth;
            Main.imagedata.data[index+2] = 0;
            Main.imagedata.data[index+3] = depth;
        }
var time4 = (new Date()).getTime();
        Main.context.putImageData(Main.imagedata, 0, 0);
var time5 = (new Date()).getTime();
        
window.dump("1:"+(time2-time1)+"\n");//capture : 1
window.dump("2:"+(time3-time2)+"\n");//binalize: 284
window.dump("3:"+(time4-time3)+"\n");//copy: 218
window.dump("4:"+(time5-time4)+"\n");//draw: 3
window.dump("total:"+(time5-time1)+"\n");
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
    }
}

Main.start();