/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cu, Ci, Cc} = require("chrome");
const { ctypes } = Cu.import("resource://gre/modules/ctypes.jsm");
const url = require("url");

const dylibURL = require("self").data.url(ctypes.libraryName('KinectBridge'));
const dylibPATH = url.toFilename(dylibURL).toString();

const dylib = ctypes.open(dylibPATH);  
const pixelSize = 640*480;
const intArrayType = ctypes.ArrayType(ctypes.int32_t, pixelSize);
const charArrayType = ctypes.ArrayType(ctypes.uint8_t, pixelSize*3);

exports.depthBuffer = new intArrayType();
exports.videoBuffer = new charArrayType();

exports.copyToArray = function(buffer, array) {
    for(var i = 0; i < buffer.length; i++){
        array[i] = buffer[i];
    }
}

const getDepth = dylib.declare("getDepth",
                          ctypes.default_abi,
                          ctypes.void_t,
                          intArrayType.ptr
                          );

const getVideo = dylib.declare("getVideo",
                          ctypes.default_abi,
                          ctypes.void_t,
                          charArrayType.ptr
                          );

exports.getDepth = function() {
    var depthArray = exports.createDepthBuffer();
    exports.getDepthTo(depthArray);
    return depthArray;
}

exports.getDepthTo = function(array) {
    getDepth(exports.depthBuffer.address());
    exports.copyToArray(exports.depthBuffer, array);
}

exports.createDepthBuffer = function() {
    return Int32Array(pixelSize);
}

exports.getVideo = function() {
    var videoArray = exports.createVideoBuffer();
    exports.getVideoTo(videoArray);
    return videoArray;
}

exports.getVideoTo = function(array) {
    getVideo(exports.videoBuffer.address());
    exports.copyToArray(exports.videoBuffer, array);
}

exports.createVideoBuffer = function() {
    return Uint8Array(pixelSize*3);
}
