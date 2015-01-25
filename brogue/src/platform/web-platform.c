#ifdef BROGUE_WEB

#include <stdio.h>
#include <string.h>
#include <poll.h>
#include <unistd.h>
#include "platform.h"

#define NUM_POLL_FIELDS         1
#define RETURN_POLL_NOW         0

#define OUTPUT_SIZE             10
#define MAX_INPUT_SIZE          4
#define MOUSE_INPUT_SIZE        4
#define KEY_INPUT_SIZE          3

enum StatusTypes {
    DEEPEST_LEVEL_STATUS,
    GOLD_STATUS,
    SEED_STATUS,
    EASY_MODE_STATUS,
    STATUS_TYPES_NUMBER
};

extern playerCharacter rogue;
static struct pollfd fds[NUM_POLL_FIELDS];

static void gameLoop()
{    
    rogueMain();
}

static void web_plotChar(uchar inputChar,
			  short xLoc, short yLoc,
			  short foreRed, short foreGreen, short foreBlue,
			  short backRed, short backGreen, short backBlue) {
    
    // just pack up the output and ship it off to the webserver
    char outputBuffer[OUTPUT_SIZE];
    
    char firstCharByte = inputChar >> 8 & 0xff;
    char secondCharByte = inputChar;
    
    outputBuffer[0] = (char) xLoc;
    outputBuffer[1] = (char) yLoc;
    outputBuffer[2] = firstCharByte;
    outputBuffer[3] = secondCharByte;
    outputBuffer[4] = (char) foreRed * 255 / 100;
    outputBuffer[5] = (char) foreGreen * 255 / 100;
    outputBuffer[6] = (char) foreBlue * 255 / 100;
    outputBuffer[7] = (char) backRed * 255 / 100;
    outputBuffer[8] = (char) backGreen * 255 / 100;
    outputBuffer[9] = (char) backBlue * 255 / 100;
    
    fwrite(outputBuffer, sizeof(char), OUTPUT_SIZE, stdout);
            
}

static void sendStatusUpdate(){
    
    char statusOutputBuffer[STATUS_TYPES_NUMBER * OUTPUT_SIZE];
    
    unsigned long statusValues[STATUS_TYPES_NUMBER]; 
    statusValues[DEEPEST_LEVEL_STATUS] = rogue.deepestLevel;
    statusValues[GOLD_STATUS] = rogue.gold;
    statusValues[SEED_STATUS] = rogue.seed;
    statusValues[EASY_MODE_STATUS] = rogue.easyMode;
    
    int i;
    int j;
    for (i = 0; i < STATUS_TYPES_NUMBER; i++){
        
        // Coordinates of (255, 255) will let the server and client know that this is a status update rather than a cell update 
        statusOutputBuffer[0] = 255;
        statusOutputBuffer[1] = 255;
        
        // The status type
        statusOutputBuffer[2] = i;
        
        // I am just going to explicitly send the status big-endian so we can be consistent on the client and server
        statusOutputBuffer[3] = statusValues[i] >> 24 & 0xff;
        statusOutputBuffer[4] = statusValues[i] >> 16 & 0xff;
        statusOutputBuffer[5] = statusValues[i] >> 8 & 0xff;
        statusOutputBuffer[6] = statusValues[i];
        
        // The rest is filler so we keep consistent output size
        for (j = 7; j < OUTPUT_SIZE; j++){
            statusOutputBuffer[j] = 0;
        }
        
        fwrite(statusOutputBuffer, sizeof(char), OUTPUT_SIZE, stdout);
    }
}

// This function is used both for checking input and pausing
    static boolean web_pauseForMilliseconds(short milliseconds)
{       
    usleep(milliseconds);   

    fds[0].fd = STDIN_FILENO;
    fds[0].events = POLLIN | POLLPRI;
    fds[0].revents = 0;
    
    return (poll(fds, NUM_POLL_FIELDS, RETURN_POLL_NOW) > 0);
}

static void web_nextKeyOrMouseEvent(rogueEvent *returnEvent, boolean textInput, boolean colorsDance)
{
    // because we will halt execution until we get more input, we definitely cannot have any dancing colors from the server side.
    colorsDance = false;
    
    // We must avoid the main menu, so we spawn this process with noMenu, and quit instead of going to the menu
    if (noMenu && rogue.nextGame == NG_NOTHING) rogue.nextGame = NG_QUIT;
    
    // ensure entire stream is written out before getting input
    fflush(stdout);
    
    char controlBuffer[1];
    char inputBuffer[MAX_INPUT_SIZE];
    
    fread(controlBuffer, sizeof(char), 1, stdin);
    
    if (controlBuffer[0] == RNG_CHECK){
        sendStatusUpdate();
        
        // This function is expecting a mouse or keystroke, so let's click outside of the window rather than return empty handed
        returnEvent->eventType = MOUSE_UP;
        returnEvent->param1 = 255; //x coord
        returnEvent->param2 = 255;  //y coord
    }
    else if (controlBuffer[0] == KEYSTROKE){
        returnEvent->eventType = KEYSTROKE;
        fread(inputBuffer, sizeof(char), KEY_INPUT_SIZE, stdin);
        returnEvent->param1 = inputBuffer[0];  //key character
        returnEvent->controlKey = inputBuffer[1];
        returnEvent->shiftKey = inputBuffer[2];
    }
    else // it is a mouseEvent
    {
        returnEvent->eventType = controlBuffer[0];
        fread(inputBuffer, sizeof(char), MOUSE_INPUT_SIZE, stdin);
        returnEvent->param1 = inputBuffer[0];  //x coord
        returnEvent->param2 = inputBuffer[1];  //y coord
        returnEvent->controlKey = inputBuffer[2];
        returnEvent->shiftKey = inputBuffer[3];
    }
    
}

static void web_remap(const char *input_name, const char *output_name) {
    // Not needed
}

static boolean modifier_held(int modifier) {
    // Not needed, I am passing in the modifiers directly with the event data
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

#endif