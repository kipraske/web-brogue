//Simple client for the datagram brogue binary

#define SERVER_SOCKET "server-socket"
#define CLIENT_SOCKET "client-socket"

#define BUF_SIZE 600

#include <sys/un.h>
#include <sys/socket.h>
#include <ctype.h>
#include <unistd.h>     /* Prototypes for many system calls */
#include <errno.h>      /* Declares errno and defines error constants */
#include <string.h>     /* Commonly used string-handling functions */
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
  struct sockaddr_un addr_read, addr_write, addr_write_src;
  int wfd, rfd;
  char resp[BUF_SIZE];
  const char *msg = "hello";

  // Client read socket

  rfd = socket(AF_UNIX, SOCK_DGRAM, 0);
  remove(CLIENT_SOCKET);

  memset(&addr_read, 0, sizeof(struct sockaddr_un));
  addr_read.sun_family = AF_UNIX;
  strncpy(addr_read.sun_path, CLIENT_SOCKET, sizeof(addr_read.sun_path) - 1);

  bind(rfd, (struct sockaddr *) &addr_read, sizeof(struct sockaddr_un));

  // Write to server socket

  wfd = socket(AF_UNIX, SOCK_DGRAM, 0);

  memset(&addr_write, 0, sizeof(struct sockaddr_un));
  addr_write.sun_family = AF_UNIX;
  strncpy(addr_write.sun_path, SERVER_SOCKET, sizeof(addr_write.sun_path) - 1);

  // Bind write to server socket to file handle
  // Unnecessary
  /*
  memset(&addr_write_src, 0, sizeof(struct sockaddr_un));
  addr_write_src.sun_family = AF_UNIX;
  strncpy(addr_write_src.sun_path, "/tmp/client_write_src", sizeof(addr_write_src.sun_path) - 1);
  bind(wfd, (struct sockaddr *) &addr_write_src, sizeof(struct sockaddr_un));
  */

  //I should toggle inventory

  char keypress[5];
  keypress[0] = 0; //keystroke
  keypress[1] = 0; //upper byte
  keypress[2] = 105; //i
  keypress[3] = 0; //mod
  keypress[4] = 0; //mod

  //Send a keypress to the server & give details of the response

  //Send keypress
  sendto(wfd, keypress, 5, 0, (struct sockaddr *) &addr_write, sizeof(struct sockaddr_un));

  struct timeval tv;

  tv.tv_sec = 2;  /* 2 Secs Timeout */
  tv.tv_usec = 0;  // Not init'ing this can cause strange errors

  setsockopt(rfd, SOL_SOCKET, SO_RCVTIMEO, (char *)&tv, sizeof(struct timeval));

  //Get responses
  while(1) {
    int size = recvfrom(rfd, resp, BUF_SIZE, 0, NULL, NULL);

    if(size == -1) {
      //Resend
      fprintf(stderr, "Timed-out, resending\n");
      sendto(wfd, keypress, 5, 0, (struct sockaddr *) &addr_write, sizeof(struct sockaddr_un));
    }

    //Likely to be a web plot char

    int count = 0;
    while(count < size) {
      fprintf(stderr, "size: %i, data: (%i, %i) -> %c\n", size, resp[count + 0], resp[count + 1], resp[count + 3]);
      count += 10;
    }



  }

  exit(EXIT_SUCCESS);
}
