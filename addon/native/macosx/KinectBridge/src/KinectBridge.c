/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */

#include <stdio.h>
#include "KinectBridge.h"
#include "libfreenect_sync.h"

#define WIDTH 640
#define HEIGHT 480

void getDepth(int* jsDepth) {
    short *depth = 0;
    uint32_t ts;
    int length = WIDTH*HEIGHT;
    if (freenect_sync_get_depth((void**)&depth, &ts, 0, FREENECT_DEPTH_11BIT) >= 0) {
//        memcpy(jsDepth, depth, length);
        for (int i = 0; i < length; i++) {
            jsDepth[i] = depth[i];
        }
    } else {
        memset(jsDepth, -1, length);
    }
}

void getVideo(char* jsVideo) {
    char *video = 0;
    uint32_t ts;
    int length = WIDTH*HEIGHT*3;
    if (freenect_sync_get_video((void**)&video, &ts, 0, FREENECT_VIDEO_RGB) >= 0) {
//        memcpy(jsVideo, video, length);
        for (int i = 0; i < length; i++) {
            jsVideo[i] = video[i];
        }
    } else {
        memset(jsVideo, -1, length);
    }
}
