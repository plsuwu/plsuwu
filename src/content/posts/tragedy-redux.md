---
pub: true
title: "Tragedy Redux"
description: "We found this file as part of an attack chain that seemed to manipulate file contents to stage a payload. Can you make any sense of it?"
from: "huntress (2023)"
date: "2023-10-16"
type: "ctf"
tags: ["malware", "rev"]
---

# Tragedy Redux

<aside>
"We found this file as part of an attack chain that seemed to manipulate file contents to stage a payload. Can you make any sense of it?"
</aside>

Unzipping the challenge archive, we are given a single file to work with - running `file` on it tells us that it’s a Zip archive:

```bash
$ ls -la
total 56
drwxr-xr-x  2 pls pls  4096 Oct 16 20:00 .
drwxr-xr-x 18 pls pls  4096 Oct 16 19:59 ..
-rw-------  1 pls pls 24518 Oct 15 23:29 tragedy_redux
-rwxr-xr-x  1 pls pls 21810 Oct 16 19:59 tragedy_redux.7z

$ file tragedy_redux
tragedy_redux: Zip archive data, made by v4.5, extract using at least v2.0, last modified, last modified Sun, Jan 01 1980 00:00:00, uncompressed size 1453, method=deflate
```

Performing a second extraction, we are given some XML documents and references to Microsoft Word & Visual Basic - alongside an error that indicates this might not
be what we think it is - `bad zipfile offset (local header sig):  0`

```bash
$ unzip tragedy_redux
Archive:  tragedy_redux
file #1:  bad zipfile offset (local header sig):  0
  inflating: _rels/.rels
  inflating: word/document.xml
  inflating: word/_rels/document.xml.rels
  inflating: word/vbaProject.bin
  inflating: word/theme/theme1.xml
  inflating: word/_rels/vbaProject.bin.rels
  inflating: word/vbaData.xml
  inflating: word/settings.xml
  inflating: word/styles.xml
  inflating: word/webSettings.xml
  inflating: word/fontTable.xml
  inflating: docProps/core.xml
  inflating: docProps/app.xml
```

Seems like this isn't ACTUALLY a Zip archive.

My assumption then is that this is a VBA Macro for MS Word, though loading this into Word’s VB editor tool throws an error:

![Untitled](/img/tragedy_redux_img/Untitled.webp)

And attempting to load `word/vbaProject.bin` by itself yields another error:

![Untitled](/img/tragedy_redux_img/Untitled_1.webp)

I make another guess that the standalone `.bin` would contain file header info - in this case, `ÐÏà¡±á`; I make a lot of assumptions, but at the end of the day I suppose that's kind of what this is all
about. Regardless, that seems pretty cursed, even for file headers, so I thought it was a bit unlikely. Turns out this was a pretty solid guess as it IS header info - its a mangled hex-to-ASCII conversion for an [Object Linking and Embedding (OLE) Compound File](https://sceweb.sce.uhcl.edu/abeysekera/itec3831/labs/FILE_SIGNATURES_TABLE.pdf).
There are also numerous references to the `OLE` file format scattered throughout the compiled `tragedy_redux` code, too, which is a very promising outcome.

I couldn't figure out a way to actually _run_ the code (doesn't seem like a great way to distribute a malware stager), but with the `OLE` keyword as part of my vocab I was able to pretty quickly find a
simple method to [extract the OLE archive](https://fishtech.group/cybersecurity/extracting-and-analyzing-malicious-word-macros-for-threat-hunting/) by way of a python script - [OLEDump.py.](https://blog.didierstevens.com/programs/oledump-py/)

Downloading OLEDump.py and passing the `vbaProject.bin` file to it yields the following output:

```bash
$ python ../oledump.py vbaProject.bin
  1:       410 'PROJECT'
  2:        71 'PROJECTwm'
  3: M    6164 'VBA/NewMacros'
  4: m     954 'VBA/ThisDocument'
  5:      3067 'VBA/_VBA_PROJECT'
  6:      3003 'VBA/__SRP_0'
  7:       226 'VBA/__SRP_1'
  8:      2334 'VBA/__SRP_2'
  9:       526 'VBA/__SRP_3'
 10:       571 'VBA/dir'
```

As described in the article prior, files containing VBA macros are denoted via an `M` flag in the second column in the script's output. We are then able to run OLEDump.py with
the `-s <stream-no.>` argument, passing `vbaProject.bin` once again (specifying the `-v` argument here to indicate that we want to decompress the macro).
I’m going to also pipe the output to `tee` and write it to a file so I can open it in an IDE, because the script is obfuscated:

```vb
$ python ../oledump.py -s 3 -v vbaProject.bin | tee vbaDecomp.txt
Attribute VB_Name = "NewMacros"
Function Pears(Beets)
    Pears = Chr(Beets - 17)
End Function

Function Strawberries(Grapes)
    Strawberries = Left(Grapes, 3)
End Function

Function Almonds(Jelly)
    Almonds = Right(Jelly, Len(Jelly) - 3)
End Function

Function Nuts(Milk)
    Do
    OatMilk = OatMilk + Pears(Strawberries(Milk))
    Milk = Almonds(Milk)
    Loop While Len(Milk) > 0
    Nuts = OatMilk
End Function

Function Bears(Cows)
    Bears = StrReverse(Cows)
End Function

Function Tragedy()

    Dim Apples As String
    Dim Water As String

    If ActiveDocument.Name <> Nuts("131134127127118131063117128116") Then
        Exit Function
    End If

    Apples = "1291281361181311321211181251250490621181271160490910881071321061041160..." 'long string, truncated for brevity.
    Water = Nuts(Apples)

    GetObject(Nuts("136122127126120126133132075")).Get(Nuts("104122127068067112097131128116118132132")).Create Water, Tea, Coffee, Napkin

End Function

Sub AutoOpen()
    Tragedy
End Sub
```

Visual Basic looks cursed (because it is) - but we can walk through the script and describe the purpose of each function:

- `Pears(Beets)` -> Subtracts 17 from a number and returns its corresponding ASCII character,
- `Strawberries(Grapes)` -> Returns the first 3 characters in a string,
- `Almonds(Jelly)` -> Removes the first 3 characters in a string,
- `Nuts(Milk)` -> Like the script's `main` function - loops through a string which it passes to other functions, concatenating the returned values into a final payload,
- `Bears(Cows)` -> Returns a reversed string (this function isn't used).

Essentially, the program here is building out a payload by looping over a number in 3-character sections, subtracting 17 from the section, and then converting the result to ASCII.
I really wanted to simply run this and have it print a payload to my terminal, but I couldn't get it to run at all - I _think_ I discarded all the garbage variables and functions,
like `Tea`, `Coffee`, `Napkin`, and `Bears()`, but the script adamantly refusing to execute. Maybe it was silently doing deobfuscation and similar malware things in the background? Who knows.

In any case, I gave up and converted the script to python:

```python
# i've added types & comments for clarity

def int_to_str(n: int) -> str:
    """subtract 17 from n and return the associated ascii char"""
    return chr(n - 17)

def slice_str(s: str) -> str:
    """return the first three characters of a string"""
    return s[:3]

def discard_chrs(s: str) -> str:
    """remove the first three characters of a string"""
    return s[3:]

def main(s: str) -> str:
    """
    deobfuscates and returns a string:
        1. use the length of `s` to perform a loop:
            a. pass `s` to `slice_str()`
            b. convert the returned value to an integer and pass to
            `int_to_str()`
            c. append the returned char to `stager_payload`
            d. pass `s` to `discard_chrs` remove the processed portion of `s`
        2. loop until the length of `s` is equal to 0
        3. return `stager_payload` to be printed to stdout.
    """

    # store the output from each iteration
    stager_payload = ""

    while len(s) > 0:
        stager_payload += int_to_str(int(slice_str(s)))
        s = discard_chrs(s)
    return stager_payload

payload = "129128136118131132121118125125049062118127116049091088107132106104116074090126" # ... truncated
print(main(payload))
```
> This script still runs, regardless of the truncation - though it will only output **part** of the final Powershell command below.

The script here converts the `Apples` string into a PowerShell command:

```powershell
powershell -enc JGZsYWc9ImZsYWd7NjNkY2M4MmMzMDE5Nzc2OGY0ZDQ1OGRhMTJmNjE4YmN9Ig==
```

Finally, we get the flag by decoding the base64 section of the command.

```bash
$ echo 'JGZsYWc9ImZsYWd7NjNkY2M4MmMzMDE5Nzc2OGY0ZDQ1OGRhMTJmNjE4YmN9Ig==' | base64 -d
flag="flag{6******************************c}"
```
