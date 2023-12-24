---
title: "Rock, Paper, Psychic"
description: "Wanna play a game of rock, paper, scissors against a computer that can read your mind? Sounds fun, right?"
author: "huntress"
date: "2023-10-16"
published: true
---

# Rock, Paper, Psychic

<aside>
👻 Wanna play a game of rock, paper, scissors against a computer that can read your mind? Sounds fun, right?
</aside>

We are presented with a `.7z` file containing an`.exe` binary. After extracting, I tried a few simple classics (buffer overflow/format string stuff) - though nothing wound up sticking.

Loading the binary into IDA, we are able to perform a quick search for the term `flag` and make a quick note of any functions or subroutines:

![Interesting functions](/img/rock_paper_psychic_img/Untitled.png)

Interesting functions

Checking out our `printFlag` function, I’m not *entirely* sure what’s going on here (on account of the weird Nim machine code), but we can glean a bit of info regardless:

- The program seems to have been written in Nim,
- The binary uses this function when a player wins to load a memory address (represented by the variable `TM__V45tF8B8NBcxFcjfe7lhBw_38`, which contains a string) into `$rcx` before running a `copyString` function on it
    - This operation is run a second time, though on a different address (the string at `TM__V45tF8B8NBcxFcjfe7lhBw_39`).
- The `fromRC4` function seems to be the recipient of these strings - my assumption is that we’re deciphering RC4-encrypted text, which will probably hold our flag.

![IDA graph view](/img/rock_paper_psychic_img/Untitled%201.png)

IDA graph view

![Text view](/img/rock_paper_psychic_img/Untitled%202.png)

Text view

The addresses of `TM__V45tF8B8NBcxFcjfe7lhBw_38` & `TM__V45tF8B8NBcxFcjfe7lhBw_39` point to sequential sections in `.rdata`, and contain the following values respectively (note that each byte uses one `.rdata` address, so these were technically not represented like this in memory, though this is what we want to use for decryption):

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

Our values used in the decryption process use the strings `P P @gnnhexnyjkwpaghynzfthadollhtrhballsdmhhnbjppewgjkhnlhspwjswqoxtgdykxrhwlabblekxj` and `L L @D1E2A0D9FA89CABED207EDF4F55C688E04EBE20F077351BDAA1E110D5A74805C916AF12F054C` to decipher and print a flag.

Digging a little into the RC4 decryption function, we will find some child functions necessary to understand how we should ultimately be performing a decryption:

- `genKeystream__OOZOnimbleZpkgsZ8267524548O49O48Z826752_2`,
- `fromHex__OOZOnimbleZpkgsZ8267524548O49O48Z826752_83`.

![Untitled](/img/rock_paper_psychic_img/Untitled%203.png)

![Untitled](/img/rock_paper_psychic_img/Untitled%204.png)

`genKeystream` seems to just utilize a plaintext value, and it is fairly safe to assume `fromHex` will convert a string from its hex representation to ASCII. My other assumption was that `fromRC4` uses the string prefixed with `P P @` as the “passphrase”/key, and the hexadecimal string labeled `L L @` as its encrypted input.

With these assumptions, we can discard the weirdness at the start of our cipher strings, and we can run this through Cyberchef’s RC4 decrypt function to get our flag:

![Untitled](/img/rock_paper_psychic_img/Untitled%205.png)
