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

static boolean web_pauseForMilliseconds(short milliseconds)
{    
    
    usleep(milliseconds);
    
/*
    if (milliseconds <= 50){
        return true;
    }
*/
    
    static int homepagePassthrough = 1;
    if (homepagePassthrough){
        homepagePassthrough = 0;
        return true;
    }
    
    

    fds[0].fd = STDIN_FILENO;
    fds[0].events = POLLIN | POLLPRI;
    fds[0].revents = 0;
    
    return (poll(fds, NUM_POLL_FIELDS, RETURN_POLL_NOW) > 0);
 
}

static void web_nextKeyOrMouseEvent(rogueEvent *returnEvent, boolean textInput, boolean colorsDance)
{
    // because we will halt execution until we get more input, we definitely cannot have any dancing colors from the server side.
    colorsDance = false;
    
    // ensure entire stream is written out before getting input
    fflush(stdout);
    
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