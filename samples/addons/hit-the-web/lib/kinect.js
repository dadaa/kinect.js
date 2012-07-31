/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

const {Cu, Ci, Cc} = require("chrome");
const { ctypes } = Cu.import("resource://gre/modules/ctypes.jsm");
const self = require("self");
const url = require("url");

const dylibURL = require("self").data.url(ctypes.libraryName('KinectBridge'));
const dylibPATH = url.toFilename(dylibURL).toString();
const dylib = ctypes.open(dylibPATH);  
const pixelSize = 640*480;
const arrayType = ctypes.ArrayType(ctypes.uint32_t, pixelSize);
const getDepth = dylib.declare("getDepth",
                          ctypes.default_abi,
                          ctypes.void_t,
                          arrayType.ptr
                          );

exports.getDepth = function() {
    var depthBuffer = new arrayType();
    getDepth(depthBuffer.address());
    return depthBuffer;
}