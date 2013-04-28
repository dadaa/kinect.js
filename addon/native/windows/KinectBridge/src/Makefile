# require:
#
#  Visual C++ 2010 Express http://www.microsoft.com/ja-jp/dev/2010/product/express/offline.aspx
#    http://download.microsoft.com/download/4/E/6/4E61E454-1DE7-4B70-860B-13282DE65D6B/VS2010ExpressJPN.iso
#  Mozilla Build https://dev.mozilla.jp/localmdc/localmdc_10446.html#section_5
#    ftp://ftp.mozilla.org/pub/mozilla/libraries/win32/MozillaBuildSetup-1.6.1.exe
#
#  OpenKinect http://openkinect.org/
#    https://github.com/OpenKinect/libfreenect.git
#  as3kinect http://www.as3kinect.org/download/
#    http://as3kinect.org/distribution/win/freenect_win_as3server_0.9c.zip
#  libusb-win32 http://sourceforge.net/apps/trac/libusb-win32/wiki
#    http://sourceforge.net/projects/libusb-win32/files/libusb-win32-releases/1.2.6.0/libusb-win32-bin-1.2.6.0.zip/download
#  POSIX Threads (pthreads) for Win32 http://sourceware.org/pthreads-win32/
#    ftp://sourceware.org/pub/pthreads-win32/pthreads-w32-2-9-1-release.zip
#

SRC_ROOT = ../../../../../..
DLL_DIST = ../../../../../samples/addons/hit-the-web/data
BIN_PATH = $(SRC_ROOT)/addon-sdk-1.11/bin

CFLAGS := -O2 -TP \
	-I$(SRC_ROOT)/libfreenect/wrappers/c_sync \
	-I$(SRC_ROOT)/libfreenect/include \
	-I../../../macosx/KinectBridge/src \
	$(CFLAGS)

LIBS = \
	$(SRC_ROOT)/freenect_win_as3server/lib/freenect.lib \
	$(SRC_ROOT)/freenect_win_as3server/lib/freenect_sync.lib \
	$(SRC_ROOT)/pthreads-w32/Pre-built.2/lib/x86/pthreadVC2.lib \
	$(NULL)

all: KinectBridge.dll

KinectBridge.dll: KinectBridge.obj
	link -DLL -out:KinectBridge.dll -def:KinectBridge.def KinectBridge.obj $(LIBS) -NODEFAULTLIB:LIBCMT
	cp -p KinectBridge.dll $(DLL_DIST)
	cp -p $(SRC_ROOT)/freenect_win_as3server/freenect.dll  $(BIN_PATH)
	cp -p $(SRC_ROOT)/libusb-win32/bin/x86/libusb0_x86.dll $(BIN_PATH)/libusb0.dll
	cp -p $(SRC_ROOT)/pthreads-w32/Pre-built.2/dll/x86/pthreadVC2.dll $(BIN_PATH)

KinectBridge.obj:
	cl $(CFLAGS) -c ../../../macosx/KinectBridge/src/KinectBridge.c -FoKinectBridge.obj

clean:
	rm -f KinectBridge.dll KinectBridge.exp KinectBridge.lib KinectBridge.obj
