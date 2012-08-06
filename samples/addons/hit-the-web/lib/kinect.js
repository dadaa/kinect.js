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
const intArrayType = ctypes.ArrayType(ctypes.uint32_t, pixelSize);
const charArrayType = ctypes.ArrayType(ctypes.char, pixelSize*3);

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
    var depthBuffer = new intArrayType();
    getDepth(depthBuffer.address());
    return depthBuffer;
}

exports.getDepthTo = function(buffer) {
    getDepth(buffer.address());
}

exports.createDepthBuffer = function() {
    return new intArrayType();
}

exports.getVideo = function() {
    var videoBuffer = new charArrayType();
    getVideo(videoBuffer.address());
    return videoBuffer;
}

exports.getVideoTo = function(buffer) {
    getVideo(buffer.address());
}

exports.createVideoBuffer = function() {
    return new charArrayType();
}