---
title: "Tragedy Redux"
description: "We found this file as part of an attack chain that seemed to manipulate file contents to stage a payload. Can you make any sense of it?"
author: "huntress"
date: "2023-10-16"
published: true
---

# Tragedy Redux

<aside>
👻 We found this file as part of an attack chain that seemed to manipulate file contents to stage a payload. Can you make any sense of it?
</aside>

Unzipping the challenge, we are given a single file - running `file tragedy_redux` on this indicates that it’s a Zip archive:

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

Extracting the contents, we are given some `XML` documents and a handful of references to Microsoft Word and Visual Basic:

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

My assumption here is that this is a VBA Macro for Word, though loading this into Word’s VB editor throws an error, and loading `word/vbaProject.bin` by itself yields bad UTF-8 characters and the script cannot be run.

![Untitled](/img/tragedy_redux_img/Untitled.png)

![Untitled](/img/tragedy_redux_img/Untitled%201.png)

The right hand side contains what seems like a file header - `ÐÏà¡±á`. This is the [mangled hex file header for Object Linking and Embedding (OLE) Compound Files](https://sceweb.sce.uhcl.edu/abeysekera/itec3831/labs/FILE%20SIGNATURES%20TABLE.pdf). There are also numerous references to the `OLE` file format scattered throughout the compiled `tragedy_redux` code - now under the assumption that this script has been compiled or something, a quick Google search returns a [method to extract and analyze the script’s contents](https://fishtech.group/cybersecurity/extracting-and-analyzing-malicious-word-macros-for-threat-hunting/) using [OLEDump.py.](https://blog.didierstevens.com/programs/oledump-py/)

Downloading OLEDump.py’s Zip archive, extracting it, and then running it on `vbaProject.bin` yields the following output:

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

Files containing VBA macros are shown through the `M` flag in the above output; we can run OLEDump.py with the `-s <stream-no.>`  argument against `vbaProject.bin`, which must be identified with the `-v` argument here to decompress the macro - otherwise we get raw hex content. I’m going to also pipe the output to `tee` and write it to a file so I can open it in an IDE:

```visual-basic
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

    Apples = "1291281361181311321211181251250490621181271160490910881071321061041160... # and so on
    Water = Nuts(Apples)

    GetObject(Nuts("136122127126120126133132075")).Get(Nuts("104122127068067112097131128116118132132")).Create Water, Tea, Coffee, Napkin

End Function

Sub AutoOpen()
    Tragedy
End Sub
```

Visual Basic looks insane and confusing, but the functions here are (reasonably) simple:

- `Pears(Beets)` takes a number as an argument, subtracts 17, and returns the corresponding ASCII character.
- `Strawberries(Grapes)` takes a string and returns *only* its first 3 characters
- `Almonds(Jelly)` takes a string and returns everything *except* its first 3 characters
- `Nuts(Milk)` loops through a string in 3-character sections, subtracts 17 from the ASCII value of each character, and then concatenates them together.
- `Bears(Cows)` accepts a string and returns it in reverse

Ultimately, the program here is using the number strings to perform a series of decryptions. `Tea`, `Coffee`and `Napkin` aren’t instantiated in this section of the script, but even after removing these I found myself unable to get this to run as a Visual Basic script, so I instead converted the script to python:

```python
def pears(beets):
    return chr(beets - 17)

def strawberries(grapes):
    return grapes[:3]

def almonds(jelly):
    return jelly[3:]

def nuts(milk):
    oat_milk = ""
    while len(milk) > 0:
        oat_milk += pears(int(strawberries(milk)))
        milk = almonds(milk)
    return oat_milk

# the other strings didn't deobfuscate into anything particularly useful
apples = "1291281361181311321211181251250490621181271160490910881071321061041160740901261..." # u get the picture
print(nuts(apples))
```

The script here converts the `apples` string into `powershell -enc JGZsYWc9ImZsYWd7NjNkY2M4MmMzMDE5Nzc2OGY0ZDQ1OGRhMTJmNjE4YmN9Ig==`; decoding the base64 portion of this output gives us the flag:

```bash
$ echo 'JGZsYWc9ImZsYWd7NjNkY2M4MmMzMDE5Nzc2OGY0ZDQ1OGRhMTJmNjE4YmN9Ig==' | base64 -d
$flag="flag{6******************************c}"
```
