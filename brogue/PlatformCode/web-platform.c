//#ifdef BROGUE_TCOD
#include <stdio.h>
#include <string.h>
#include <time.h>
#include "platform.h"

extern playerCharacter rogue;

struct mouseState {int x, y, lmb, rmb;};
//static TCOD_key_t bufferedKey = {TCODK_NONE};
static struct mouseState brogueMouse = {0, 0, 0, 0};
static struct mouseState missedMouse = {-1, -1, 0, 0};

static void gameLoop()
{
	rogueMain();
}

static void web_plotChar(uchar inputChar,
			  short xLoc, short yLoc,
			  short foreRed, short foreGreen, short foreBlue,
			  short backRed, short backGreen, short backBlue) {
	// TODO - build a char buffer for export and send via Stdout
}

static boolean web_pauseForMilliseconds(short milliseconds)
{
    // TODO - can we even miss a mouse event in this model?
    return false;
}

static web_nextKeyOrMouseEvent(rogueEvent *returnEvent, boolean textInput, boolean colorsDance)
{
    // TODO - wait by reading from Stdin and process simple character imput into rogueEvents
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