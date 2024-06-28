---
title: "the-brewing-secrets"
link: "https://jellyc.tf/challenges#the_brewing_secrets-47"
description: "Rumour has it Sakana stores the secret recipes for Phase Connect's coffee blends in his garage 'super secure laboratory'. Can you hack your way in?"
from: "jellyCTF"
date: "2024-06-24"
type: "ctf"
tags: ["rev", "crypto"]
---

# the-brewing-secrets

<aside>
<a href={link}>{title} @ {author}</a><br/>
Rumour has it Sakana stores the secret recipes for Phase Connect's coffee blends in his garage 'super secure laboratory'. Can you hack your way in?
</aside>

---

<br/>

**[a quick foreword]:**

There was some weirdness that didn't really line up with my explanation when I was feeding the binary
junk - it would randomly just... work? For example:

```bash
[please@ruby]:[~/Documents/CTF/jellyctf/the-brewing-secrets] $ ./the_brewing_secrets                                                     130 ↵


Starting phase_number 1...
WARNING: System will timeout after 69 entries
Enter 6-digit binary passcode
129030
Phase number 1 - validation result: 1


Starting phase_number 2...
WARNING: System will timeout after 69 entries
Enter 6-digit binary passcode
1023948
Passcode incorrect. Try again!
1092934
Passcode incorrect. Try again!
1293
Passcode incorrect. Try again!
123980
Passcode incorrect. Try again!
1234567
Passcode incorrect. Try again!
^C
[please@ruby]:[~/Documents/CTF/jellyctf/the-brewing-secrets] $
```

I'm like 99% sure the explanation below is correct for _my_ solution given that it would hit the correct sequence
perfectly using a local binary, however I do not know what the hell is happening above lmao

---

## anyway...

This challenge gives us a zip archive containing some challenge files which we can examine locally, though the main challenge is served over a socket
@ `nc chals.jellyc.tf 6000`.

```vim
" zip.vim version v33
" Browsing zipfile /home/please/Documents/CTF/jellyctf/the-brewing-secrets/the_brewing_secrets.zip
" Select a file with cursor and press ENTER

Dockerfile
flag.txt
Makefile
the_brewing_secrets
the_brewing_secrets.c
```

Running the prebuilt binary, we are prompted to enter a binary passcode:

```bash
[please@ruby]:[~/Documents/CTF/jellyctf/the-brewing-secrets] $ ./the_brewing_secrets


Starting phase_number 1...
WARNING: System will timeout after 69 entries
Enter 6-digit binary passcode
as;ldfj
Passcode incorrect. Try again!
123


123333
Passcode incorrect. Try again!
00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Passcode incorrect. Try again!
Timeout exceeded
Phase number 1 - validation result: 0
[please@ruby]:[~/Documents/CTF/jellyctf/the-brewing-secrets] $
```

## a brief look at the program's code

I think it's a safe assumption that we want to find a 6-digit string of 1's and 0's that matches whatever the program has set internally as its passcode.
We thankfully have been supplied the binary's source code (a `C` program). I will save you the pain of having to scroll past a massive chunk of `C` code and
just describe the important sections ([full source on the challange page](https://jellyc.tf/challenges#the_brewing_secrets-47)):

```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int runChallenge(int passcodeLength) {
    int EXTRA_ALLOWANCE = passcodeLength;
    int bitmask = (1 << passcodeLength) - 1;
    int maxTimeout = bitmask;
    int passCode = random() & bitmask;

    // [truncated]

    while (timeout < maxTimeout + EXTRA_ALLOWANCE) {
        // [truncated]
        // read input from stdint, and compare to passcode:

        // if input == passcode:
        return 1;

        // otherwise, if input != passcode:
        printf("Passcode incorrect. Try again!\n");
        timeout++; // always increment timeout counter after each entry
    }

    // `return 0` if timeout >= maxTimeout + EXTRA_ALLOWANCE
    return 0;
}

int main(int argc, char **argv) {
    srand(time(NULL));
    int PASSCODE_LENGTH = 6;
    int NUM_PHASES = 10;
    int phase_number;
    int result = 0;

    for (phase_number = 1; phase_number <= NUM_PHASES; phase_number++) {
        // [truncated]

        result = runChallenge(PASSCODE_LENGTH);

        // flush stdin
        int c;
        while ((c = getchar()) != '\n' && c != EOF);

        // break iteration if result == 0
    }

    if (phase_number == NUM_PHASES + 1) {
        // read in the flag file and print it to stdout
    }

    return 0;
}
```

This is a reasonably simple program, but essentially the program is seeding the `rand()` function with the UNIX time at the program's start, and
comparing our input to a pseudo-random number. This number is based on the `PASSCODE_LENGTH` (`6`) and the seeded `random()` function near the top
of `runChallenge()`, which is called a maximum of 10 times, where the correct input supplies us with the flag:

```c
// ...

int runChallenge(int passcodeLength) {

    // passcodeLength is hardcoded to 6 in `main()`
    int EXTRA_ALLOWANCE = passcodeLength;

    // because `passcodeLength` is always 6, the value of
    // `bitmask` is always  63, given the operation below:
    int bitmask = (1 << passcodeLength) - 1;
    //
    // ie,
    // bitmask = (1 << 6) - 1
    //         = 64 - 1
    //         = 63
    //

    // maxTimeout = 63;
    int maxTimeout = bitmask;

    // by default, `random()` will produce an int with a max value
    // of around `32_767`, so the below operation will always mean
    // passCode is a number in the range 0 <= 63:
    int passCode = random() & bitmask;

// ...
```

As `random()` is seeded with the current UNIX time once per run, we can generally predict that two instances of this binary launched within
the same second will follow a related (if not identical) sequence. What we can try in this case is to modify this source code to output the
final value in `passCode`, compile it, and then write a script to open a connection to the websocket and run the modified program, feeding
the output of the modified one to the input of the websocket.

## exploit code

The final modified code was as follows:
```c
#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>

void runChallenge(int passcodeLength) {
    int EXTRA_ALLOWANCE = passcodeLength;
    int bitmask = (1 << passcodeLength) - 1;
    int maxTimeout = bitmask;
    int passCode = random() & bitmask;

    char received;
    scanf("%c", &received);

    // read each bit into an array
    int pcode_bin[8];
    printf("send:: => \n"); // flag the line with passcode
    for (int i = 0; i < 8; i++) {
        pcode_bin[i] = (passCode >> i) & 1; // lsb
    }

    // print binary array
    // (little-endian, truncate bits 7 and 8)
    for (int j = 5; j >= 0; j--) {
        printf("%d", pcode_bin[j]);
    }

    printf("\n");
}

int main(int argc, char **argv) {
    int time_null = time(NULL);
    printf("seeding run w/ time(NULL) @: %f\n", time_null);
    srand(time_null);

    int PASSCODE_LENGTH = 6;
    int NUM_PHASES = 99999; // idk

    int phase_number;
    int result = 0;
    int c;

    for (phase_number = 1; phase_number <= NUM_PHASES; phase_number++) {
        while ((c = getchar()) != '\n'); // loop until newline recv
        runChallenge(PASSCODE_LENGTH);
    }

    return 0;
}
```

And the Python script (using the `pwntools` module) to call the socket and binary and share their input:
```python
#!/usr/bin/env python

import time
import random
from pwn import *

host = 'chals.jellyc.tf'
port = 6000

c = process('./bsecrets-mod-e')
p = remote(host, port)

# receive data until we hit the remote's input prompt
# (this isn't exact but around this point seemed to product the most reliable results)
p.recvuntil('Enter 6-digit bin')

# push two lines through to our local process to start the
# `runChallenge()` function
c.sendline('a')
c.sendline('a')

# run generate-send-receive loop infinitely - we will auto-die on EOF
while True:
    # truncate locator flags in local proc output
    c.recvuntil('send:: => ')
    rnd_binary = c.recvline()
    print(rnd_binary)

    # send passcode to remote, then send to local to go to the
    # next generation
    p.sendline(rnd_binary)
    c.sendline(rnd_binary)
    is_ok = str(p.recvline()) # remote res

    # bad response supplied
    if is_ok.__contains__('Passcode incorrect'):
        print(f'[!] bad entry: {rnd_binary}')

    # we either won the round ("... result: 1")
    # or lost ("... result: 0" -> EOF and die)
    if is_ok.__contains__('validation result:'):
        print('[**] OK:', is_ok)
        line = p.recvline()
        print(line)

        # wait on remote to return to the input prompt to retain
        # pattern locally
        while 'binary passcode' not in str(line):
            line = p.recvline()
            print(line)
```

While not yielding _perfectly_ repeatable results, we can continue re-running the script until we hit a lucky
sequence and get our flag on completion of the 10th phase:

```bash
[please@ruby]:[~/Documents/CTF/jellyctf/the-brewing-secrets] $ ./expl.py                                                                                                                               1 ↵
[+] Starting local process './bsecrets-mod-e': pid 58863
[+] Opening connection to chals.jellyc.tf on port 6000: Done
/home/please/Documents/CTF/jellyctf/the-brewing-secrets/./expl.py:13: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  p.recvuntil('Enter 6-digit bin')
/home/please/Documents/CTF/jellyctf/the-brewing-secrets/./expl.py:14: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  c.sendline('a')
/home/please/Documents/CTF/jellyctf/the-brewing-secrets/./expl.py:15: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  c.sendline('a')
/home/please/Documents/CTF/jellyctf/the-brewing-secrets/./expl.py:18: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  c.recvuntil('send:: => ')
b'100110\n'
b'100000\n'
[**] OK: b'Phase number 1 - validation result: 1\r\n'
b'\r\n'
b'\r\n'
b'Starting phase_number 2...\r\n'
b'WARNING: System will timeout after 69 entries\r\n'
b'Enter 6-digit binary passcode  \r\n'
b'100011\n'
[!] bad entry: b'100011\n'
b'101110\n'
[!] bad entry: b'101110\n'
b'011101\n'
[**] OK: b'Phase number 2 - validation result: 1\r\n'
b'\r\n'
b'\r\n'
b'Starting phase_number 3...\r\n'
b'WARNING: System will timeout after 69 entries\r\n'
b'Enter 6-digit binary passcode  \r\n'
b'111001\n'
[!] bad entry: b'111001\n'
b'011110\n'
[!] bad entry: b'011110\n'

# ... [truncated] ...

b'Starting phase_number 10...\r\n'
b'WARNING: System will timeout after 69 entries\r\n'
b'Enter 6-digit binary passcode  \r\n'
b'101101\n'
[!] bad entry: b'101101\n'
b'010111\n'
[!] bad entry: b'010111\n'
b'110100\n'
[!] bad entry: b'110100\n'
b'011011\n'
[!] bad entry: b'011011\n'
b'111001\n'
[**] OK: b'Phase number 10 - validation result: 1\r\n'
b'Validation successful. Unlocking garage door: jellyCTF{mad3_w1th_99_percent_l0v3_and_1_percent_sad_g1rl_t3ars}\r\n'

# ... [truncated] ...

[*] Closed connection to chals.jellyc.tf port 6000
[*] Stopped process './bsecrets-mod-e' (pid 58863)
[please@ruby]:[~/Documents/CTF/jellyctf/the-brewing-secrets] $
```

