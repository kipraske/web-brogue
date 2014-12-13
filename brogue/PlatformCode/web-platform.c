//#ifdef BROGUE_TCOD
#define _GNU_SOURCE
#define OUTPUT_SIZE             9
#define MAX_INPUT_SIZE          4
#define MOUSE_INPUT_SIZE        4
#define KEY_INPUT_SIZE          3

#include <stdio.h>
#include <string.h>
#include <time.h>
#include "platform.h"

#ifdef WIN32
#include <io.h>
#include <fcntl.h>
#endif

extern playerCharacter rogue;

struct mouseState {int x, y, lmb, rmb;};
//static TCOD_key_t bufferedKey = {TCODK_NONE};
static struct mouseState brogueMouse = {0, 0, 0, 0};
static struct mouseState missedMouse = {-1, -1, 0, 0};

static void gameLoop()
{
    
// It turns out on windows platforms it will convert any /n to /r/n in our stdout stream.  We don't want any of our coordinates accidentally adding bytes into the raw output.
#ifdef WIN32
    setmode(fileno(stdout), O_BINARY);
    setmode(fileno(stdin), O_BINARY);
#endif
    
    rogueMain();
}

static void web_plotChar(uchar inputChar,
			  short xLoc, short yLoc,
			  short foreRed, short foreGreen, short foreBlue,
			  short backRed, short backGreen, short backBlue) {
    // just pack up the output and ship it off to the webserver
    char outputBuffer[OUTPUT_SIZE];
        
    outputBuffer[0] = (char) xLoc;
    outputBuffer[1] = (char) yLoc;
    outputBuffer[2] = inputChar;
    outputBuffer[3] = (char) foreRed * 255 / 100;
    outputBuffer[4] = (char) foreGreen * 255 / 100;
    outputBuffer[5] = (char) foreBlue * 255 / 100;
    outputBuffer[6] = (char) backRed * 255 / 100;
    outputBuffer[7] = (char) backGreen * 255 / 100;
    outputBuffer[8] = (char) backBlue * 255 / 100;
    
    fwrite(outputBuffer, sizeof(char), OUTPUT_SIZE, stdout);
            
}

static boolean web_pauseForMilliseconds(short milliseconds)
{
    // ensure entire stream is written out before getting input
    fflush(stdout);
    
    // rather than polling for key events while paused, we will just wait an read them in when needed in nextKeyOrMouseEvent
    return true;
}

static void web_nextKeyOrMouseEvent(rogueEvent *returnEvent, boolean textInput, boolean colorsDance)
{
    // because we will halt execution until we get more input, we definitely cannot have any dancing colors from the server side.
    colorsDance = false;
    
    char controlBuffer[1];
    char inputBuffer[MAX_INPUT_SIZE];
    
    fread(controlBuffer, sizeof(char), 1, stdin);
    returnEvent->eventType = controlBuffer[0]; 
    
    if (returnEvent->eventType == KEYSTROKE){
        fread(inputBuffer, sizeof(char), KEY_INPUT_SIZE, stdin);
        returnEvent->param1 = inputBuffer[0];  //key character
        returnEvent->controlKey = inputBuffer[1];
        returnEvent->shiftKey = inputBuffer[2];
    }
    else // it is a mouseEvent
    {
        fread(inputBuffer, sizeof(char), MOUSE_INPUT_SIZE, stdin);
        returnEvent->param1 = inputBuffer[0];  //x coord
        returnEvent->param2 = inputBuffer[1];  //y coord
        returnEvent->controlKey = inputBuffer[2];
        returnEvent->shiftKey = inputBuffer[3];
    }
    
}

static void web_remap(const char *input_name, const char *output_name) {
    // TODO - translate web input to brogue characters
}

static boolean modifier_held(int modifier) {
	rogueEvent tempEvent;

	return 0;
}

struct brogueConsole webConsole = {
	gameLoop,
	web_pauseForMilliseconds,
	web_nextKeyOrMouseEvent,
	web_plotChar,
	web_remap,
	modifier_held
};

//#endif