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
    memset(jsDepth, -1, WIDTH*HEIGHT);
    if (freenect_sync_get_depth((void**)&depth, &ts, 0, FREENECT_DEPTH_11BIT) < 0) {
    } else {
        for (int y = 0; y < HEIGHT; y++) {
            int yindex = y * WIDTH;
            for (int x = 0; x < WIDTH; x++) {
                int index = yindex + x;
                jsDepth[index] = depth[index];
            }
        }
    }
}
