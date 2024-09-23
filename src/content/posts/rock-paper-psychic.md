---
pub: true
title: "Rock, Paper, Psychic"
description: "Wanna play a game of rock, paper, scissors against a computer that can read your mind? Sounds fun, right?"
from: "huntress (2023)"
date: "2023-10-16"
type: "ctf"
tags: ["rev"]
---

# Rock, Paper, Psychic

<aside>
Wanna play a game of rock, paper, scissors against a computer that can read your mind? Sounds fun, right?
</aside>

The challenge presents us with a 7z archive, which extracts to an `.exe` binary. I executed the binary and tried a few easy classics (buffer overflow/format string stuff) and some pretty
cheesy exploits from similarly-named CTF challenges - unfortunately it's not going to be _quite_ that easy.

Loading the binary into IDA, we are able to perform a quick search for the term `flag` and make a quick note of relevant functions or symbols:

![Interesting functions](/img/rock_paper_psychic_img/Untitled.webp)
> IDA's function search results

Checking out our `printFlag` function, I have a pretty solid interpretation of what I'm looking at, but the mangled Nim disasm took me a bit off-guard:

- The program seems to have been written in Nim,
- The binary itself calls the `printFlag` function when a player wins.
- This function seems to be a loop, which performs two _general_ actions:
    1. `lea` computes the address of a memory operand, storing the resulting location in the `rcx` register
    2. a function, `copyString`, is called - I didn't really go into this function, but ultimately it's pretty inconsequential to the function's outcome; I'm assuming this is a memory-safe way to dereference pointers or something.
- The loop runs twice on two strings - `TM__V45tF8B8NBcxFcjfe7lhBw_38` in the first iteration, and `TM__V45tF8B8NBcxFcjfe7lhBw_39` in the second.
- Finally, the program calls the function `fromRC4`, which appears to be the recipient of both strings.

To summarize, it seems like the flag is RC4-encrypted, and is stored in the read-only `.rdata` section. Once a player wins, and the program will decrypt the flag and then print it to STDOUT.

![IDA graph view](/img/rock_paper_psychic_img/Untitled_1.webp)
> IDA's graph view of the program's call flow

![Text view](/img/rock_paper_psychic_img/Untitled_2.webp)
> `.text` view

Moving to the addresses referenced by `TM__V45tF8B8NBcxFcjfe7lhBw_38` & `TM__V45tF8B8NBcxFcjfe7lhBw_39` in the `.rdata` section - this means the variables are constants (i.e, read-only; not used to store dynamic data).

We see they hold the following values respectively:

```nasm
.rdata:000000000041D9E0 TM__V45tF8B8NBcxFcjfe7lhBw_39 db  4Ch ; L
.rdata:000000000041D9E0                                         ; DATA XREF: printFlag__main_6+14↑o
.rdata:000000000041D9E1                 db    0
.rdata:000000000041D9E2                 db    0
.rdata:000000000041D9E3                 db    0
.rdata:000000000041D9E4                 db    0
.rdata:000000000041D9E5                 db    0
.rdata:000000000041D9E6                 db    0
.rdata:000000000041D9E7                 db    0
.rdata:000000000041D9E8                 db  4Ch ; L
.rdata:000000000041D9E9                 db    0
.rdata:000000000041D9EA                 db    0
.rdata:000000000041D9EB                 db    0
.rdata:000000000041D9EC                 db    0
.rdata:000000000041D9ED                 db    0
.rdata:000000000041D9EE                 db    0
.rdata:000000000041D9EF                 db  40h ; @D1E2A0D9FA89CABED207EDF4F55C688E04EBE20F077351BDAA1E110D5A74805C916AF12F054C
.rdata: .....truncated addresses.....
.rdata:000000000041DA3C                 db    0
.rdata:000000000041DA3D                 db    0
.rdata:000000000041DA3E                 db    0
.rdata:000000000041DA3F                 db    0
.rdata:000000000041DA40 TM__V45tF8B8NBcxFcjfe7lhBw_38 db  50h ; P
.rdata:000000000041DA40                                         ; DATA XREF: printFlag__main_6+8↑o
.rdata:000000000041DA41                 db    0
.rdata:000000000041DA42                 db    0
.rdata:000000000041DA43                 db    0
.rdata:000000000041DA44                 db    0
.rdata:000000000041DA45                 db    0
.rdata:000000000041DA46                 db    0
.rdata:000000000041DA47                 db    0
.rdata:000000000041DA48                 db  50h ; P
.rdata:000000000041DA49                 db    0
.rdata:000000000041DA4A                 db    0
.rdata:000000000041DA4B                 db    0
.rdata:000000000041DA4C                 db    0
.rdata:000000000041DA4D                 db    0
.rdata:000000000041DA4E                 db    0
.rdata:000000000041DA4F                 db  40h ; @gnnhexnyjkwpaghynzfthadollhtrhballsdmhhnbjppewgjkhnlhspwjswqoxtgdykxrhwlabblekxj
.rdata: .....truncated addresses.....
.rdata:000000000041DAA0                 db    0
.rdata:000000000041DAA1                 db    0
.rdata:000000000041DAA2                 db    0
.rdata:000000000041DAA3                 db    0
.rdata:000000000041DAA4                 db    0
.rdata:000000000041DAA5                 db    0
.rdata:000000000041DAA6                 db    0
.rdata:000000000041DAA7                 db    0
```
> NOTE: Each byte of these variables were stored in a unique address and so the visual representation we got in IDA was a little different, but the end result is ultimately the same.

The decryption process uses the strings `P P @gnnhexnyjkwpaghynzfthadollhtrhballsdmhhnbjppewgjkhnlhspwjswqoxtgdykxrhwlabblekxj` and `L L @D1E2A0D9FA89CABED207EDF4F55C688E04EBE20F077351BDAA1E110D5A74805C916AF12F054C` to decipher and print a flag.

Digging a little into the RC4 decryption function, we will find some child functions necessary to understand how we should ultimately be performing a decryption:

- `genKeystream__OOZOnimbleZpkgsZ8267524548O49O48Z826752_2`,
- `fromHex__OOZOnimbleZpkgsZ8267524548O49O48Z826752_83`.

![Untitled](/img/rock_paper_psychic_img/Untitled_3.webp)

![Untitled](/img/rock_paper_psychic_img/Untitled_4.webp)

`genKeystream` seems to just utilize a plaintext value, and it is fairly safe to assume `fromHex` will convert a string from its hex representation to ASCII. I also am assuming that the
`L L @...` & `P P @...` portions of each string are use to identify the key from the input, and that we should remove them before trying to descrypt anything.

With two strings in hand, we _could_ force it and mash them together until something works, but I wanted to try making an educated guess on which string was which; a quick Google search
returned [this Nim RC4 library on GitHub](https://github.com/OHermesJunior/nimRC4).

The function from this library expects
- argument one - possibly `TM_..._38` - to be a key,
- argument two - possibly `TM_...39` to be a hexadecimal string containing the ciphertext.

The example closely aligns with the function calls and values in this program, so let's test this theory and run it through cyberchef:

![Untitled](/img/rock_paper_psychic_img/Untitled_5.webp)
