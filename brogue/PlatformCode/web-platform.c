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
    
    #ifdef USE_UNICODE
    // because we can't look at unicode and ascii without messing with Rogue.h, reinterpret until some later version comes along:
    switch (inputChar) {
    case FLOOR_CHAR: inputChar = '.'; break;
    case CHASM_CHAR: inputChar = ':'; break;
    case TRAP_CHAR: inputChar = '%'; break;
    case FIRE_CHAR: inputChar = '^'; break;
    case FOLIAGE_CHAR: inputChar = '&'; break;
    case AMULET_CHAR: inputChar = ','; break;
    case SCROLL_CHAR: inputChar = '?'; break;
    case RING_CHAR: inputChar = '='; break;
    case WEAPON_CHAR: inputChar = '('; break;
    case GEM_CHAR: inputChar = '+'; break;
    case TOTEM_CHAR: inputChar = '0'; break;
    case BAD_MAGIC_CHAR: inputChar = '+'; break;
    case GOOD_MAGIC_CHAR: inputChar = '$'; break;

    // case UP_ARROW_CHAR: inputChar = '^'; break; // same as WEAPON_CHAR
    case DOWN_ARROW_CHAR: inputChar = 'v'; break;
    case LEFT_ARROW_CHAR: inputChar = '<'; break;
    case RIGHT_ARROW_CHAR: inputChar = '>'; break;

    case UP_TRIANGLE_CHAR: inputChar = '^'; break;
    case DOWN_TRIANGLE_CHAR: inputChar = 'v'; break;

    case CHARM_CHAR: inputChar = '7'; break;

    case OMEGA_CHAR: inputChar = '<'; break;
    case THETA_CHAR: inputChar = '0'; break;
    case LAMDA_CHAR: inputChar = '^'; break;
    case KOPPA_CHAR: inputChar = '0'; break;

    case LOZENGE_CHAR: inputChar = 'o'; break;
    case CROSS_PRODUCT_CHAR: inputChar = 'x'; break;

    case STATUE_CHAR: inputChar = '5'; break;
    case UNICORN_CHAR: inputChar = 'U'; break;
    }
    #endif

    if (inputChar < ' ' || inputChar > 127) inputChar = ' ';
  
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
    // rather than polling for key events while paused, we will just wait an read them in when needed in nextKeyOrMouseEvent
    return true;
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