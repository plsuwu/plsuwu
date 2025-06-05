---
pub: true
title: "Wannahusky Analysis"
link: "https://academy.tcm-sec.com/courses/1547503"
description: "Final report for TCM Security's 'Practical Malware Analysis and Triage' course."
from: "TCM Security"
date: "2025-06-05"
type: "report"
tags: ["rev", "crypto", "malware"]
---

<aside>
Report for the final module of <a href={link}>TCM Security's "Practical Malware Analysis and Triage" course.</a>
</aside>

# WannaHusky Analysis Report

<center>
    <img src="/img/wannahusky-report/husky_cover.webp" style="height: 40%; width: 40%;" />
</center>

## Executive Summary

|Hashing algorithm  |WannaHusky hash                                                                |
|---                |---                                                                            |
|SHA256             |`3D35CEBCF40705C23124FDC4656A7F400A316B8E96F1F9E0C187E82A9D17DCA3`             |

WannaHusky is a 32-bit ransomware binary written in the Nim programming language. This particular sample is compiled to target the Windows operating system,
though the use of Nim greatly simplifies cross-compilation; the same codebase can be used to generate binaries for other x86-64 operating systems, along with
a range of CPU architectures.

This sample targets a specific file named `cosmo.jpeg` on the user's desktop, replacing it with an encrypted version named `cosmo.WANNAHUSKY`. In typical
ransomware fashion, WannaHusky demands a ransom (100 Huskycoin) to restore the original file.

The following remediation options are included with this report:

- [**Appendix A**](#appendix-a-decryption-script): A Python script that can be used to decrypt an encrypted `cosmo.WANNAHUSKY` file, 
- [**Appendix B**](#appendix-b-yara-rules): YARA signature rules to detect future instances of WannaHusky.

## Technical Summary 

WannaHusky's functionality is entirely encapsulated within a single portable executable stage, with cryptographic logic all handled internally by a Nim library 
(`NimCrypto`). The binary itself also has an embedded Powershell script and ransom note PNG that it will drop on a victim's machine - the Powershell script is 
used to set the victim's background to the ransom note PNG, and so these do not necessarily serve a malicious purpose in and of themselves.

As such, there are four "steps" to WannaHusky's functionality:

1. The target file is encrypted,
2. Embedded files (i.e, the Powershell script and PNG) are dropped,
3. The Powershell script is executed before being deleted,
4. `tree.exe` is called.

Of particular note is the binary's target file; as mentioned above, WannaHusky looks for a specific file on the victim's desktop (`cosmo.jpeg`). If this file does
not exist (or is empty), then it will return from the encryption routine early, and therefore will not drop the ransom note PNG, though the Powershell script **is**
still dropped and executed, as it is part of a separate function. This means the execution path will branch slightly depending on the presence and content of 
`%USERPROFILE%\Desktop\cosmo.jpeg`:

- If the encryption routine was executed in full (i.e, the target file exists and contains data), a ransom note is dropped and the victim's desktop background is set to the ransom note. 
- Otherwise, the victim's desktop to a solid black color - this is due to the sample never extracting the ransom image, which occurs at the end of the encryption function.

Finally, WannaHusky will call `tree.exe`, passing `C:\` as the argument. This dumps the victim's file system structure to the machine's standard output, though this
occurs after the malicious activity has occurred, and appears to be a misdirection tactic.

With all of this in mind, the binary spawns two child processes (`powershell.exe` and `tree.exe`), and spends most of its execution time waiting for the `tree.exe` process to exit:

![tree](/img/wannahusky-report/wannahusky-process-tree.webp)


## Composition Overview

|Artifact Filename  |SHA256 hash                                                        |
|---                |---                                                                |
|ps1.ps1            |`D6317F374F879CD4E67FB4E9DDC0D283926489F4C0D6CF07D912A247E5CFDE99` |
|WANNAHUSKY.png     |`07B3E2937388AC6394A08D35F3A66A80DDE38C63B3C459729E2471022961F562` |

Internally, there appear to be two developer-created functions - these are found in the 'main' function, which is labelled `@NimMainModule0`. This function is called after
some runtime setup. The binary is compiled with the following partially-mangled symbols representing the function names implemented by the developer:

`@wannaHusky__4JhDTDCSrwYIQ19bJbLaL2w@0`:
- Primarily handles the file read, encryption and write logic.
- This function additionally drops the ransom image `WANNAHUSKY.png` after a successful encryption.

`@changeBackground__4JhDTDCSrwYIQ19bJbLaL2w_2@0`:
- Retrieves and executes a Powershell script from the `.rdata` section 
- Additionally, executes the script to alter the user's desktop background.

The last function call highlighted below - `@nosexecShellCmd@4` - runs the `tree.exe` command. It appears that the command is passed in as a string to a Nim built-in function,
and is executed by `cmd.exe`.

![nim-main-module](/img/wannahusky-report/NimMainModule_primary-functions.webp)

As such, these three functions work to perform the following routine:

1. WannaHusky first checks whether it can execute its payload by checking for the existence of a file named `cosmo.jpeg` on the user's desktop (i.e., `%USERPROFILE%\Desktop\cosmo.jpeg`).
    - If the file does not exist, the binary returns early from the `wannaHusky` function here.
2. A handle to the `cosmo.jpeg` file is opened, and its contents are read into memory.
    - If the file does not contain any data, the binary returns early from the `wannaHusky` function here.
3. Algorithm context `CTR-AES256` is initialized and the content in `cosmo.jpeg` is encrypted, and then encoded as base64.
    - The binary includes what appears to be a key, `COSMO`, though this is never used; as such:
        - The key used is 32 `NULL` bytes,
        - The CTR nonce/IV is 8 `NULL` bytes.
4. The encrypted base64 string is written to a new file `cosmo.WANNAHUSKY`, which replaces the existing `cosmo.jpeg` file, which is deleted.
5. An embedded ransom note image is extracted from the `.rdata` section and is written to `%USERPROFILE%\Desktop\WANNAHUSKY.png` ([**Appendix C**](#appendix-c-wannahusky.png)).
6. A PowerShell script `ps1.ps1` ([**Appendix D**](#appendix-d-ps1.ps1)) is written to the desktop, executed, and removed. This sets the user's background to the ransom note.
7. Finally, the binary calls `tree.exe C:\`. As previously stipulated, this is unrelated to the binary's actual functionality and appears to be a misdirection tactic.


## Preliminary Analysis

### Overview

Recall that WannaHusky has two operation "states" (as outlined in the [Technical Summary](#technical-summary)):

- A "failure" state, which occurs when `cosmo.jpeg` is not present on the victim's desktop, or if `cosmo.jpeg` is an empty file,
- A "success" state, which occurs when `cosmo.jpeg` is present and its size is at least 1 byte.

The success state encrypts `cosmo.jpeg` and effectively renames the file to `cosmo.WANNAHUSKY`. A ransom PNG is dropped to the desktop, 
and a Powershell script modifies the victim's desktop background to display this ransom note:

![wannahusky-success-state](/img/wannahusky-report/wannahusky-success.webp)


The failure state bails out of the encryption function early (without dropping the ransom PNG). A Powershell script modifies the victim's 
desktop background to display a non-existent ransom PNG - a fallback option (a solid black color) is set by the operating system in this instance:

![wannahusky-failure-state](/img/wannahusky-report/wannahusky-failure.webp)

### "Failure" States

Executing the sample without `cosmo.jpeg` present at the expected filepath yields the following result (noting the output
'cannot open: C:\Users\Peas\Desktop\cosmo'):

```powershell
PS C:\\Users\\Peas\\Desktop\\Ransomware.wannahusky.exe.malz> .\\Ransomware.wannahusky.exe
cannot open: C:\\Users\\Peas\\Desktop\\cosmo.jpeg
Folder PATH listing
Volume serial number is 00000009 1054:D946
C:\\
├───inetpub
├───PerfLogs
├───Program Files

[ ... ]
```

Creating an empty 'dummy' file with the name `cosmo.jpeg` also triggers an error state (again, noting the line 'index out of
bounds, the container is empty'):

```powershell
PS C:\\Users\\Peas\\Desktop> New-Item -Name cosmo.jpeg


    Directory: C:\\Users\\Peas\\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
-a----         1/06/2025   1:19 AM              0 cosmo.jpeg


PS C:\\Users\\Peas\\Desktop> cd .\\Ransomware.wannahusky.exe.malz\\
PS C:\\Users\\Peas\\Desktop\\Ransomware.wannahusky.exe.malz> .\\Ransomware.wannahusky.exe
index out of bounds, the container is empty
Folder PATH listing
Volume serial number is 00000009 1054:D946
C:\\
├───inetpub
├───PerfLogs
├───Program Files

[...]
```

### "Success" State

Ultimately, WannaHusky requires the existence of a `cosmo.jpeg` with a content length greater than 0; writing anything to `cosmo.jpeg`
allows WannaHusky to execute its entire encryption routine. The final output is written to `cosmo.WANNAHUSKY` encoded as a base64 string.

```powershell
PS C:\\Users\\Peas\\Desktop> echo 'AAAA' | Out-File -FilePath cosmo.jpeg
PS C:\\Users\\Peas\\Desktop> Get-Content .\\cosmo.jpeg
AAAA
PS C:\\Users\\Peas\\Desktop> cd .\\Ransomware.wannahusky.exe.malz\\
PS C:\\Users\\Peas\\Desktop\\Ransomware.wannahusky.exe.malz> .\\Ransomware.wannahusky.exe
Folder PATH listing
Volume serial number is 00000009 1054:D946
C:\\
├───inetpub

[...]

│   │           └───misc
SIGINT: Interrupted by Ctrl-C.
^C
PS C:\\Users\\Peas\\Desktop\\Ransomware.wannahusky.exe.malz> cd ..
PS C:\\Users\\Peas\\Desktop> la


    Directory: C:\\Users\\Peas\\Desktop


Mode                 LastWriteTime         Length Name
----                 -------------         ------ ----
d-----        20/05/2025   5:28 AM                Ransomware.wannahusky.exe.malz
-a----        10/05/2025   9:29 AM        1754626 cosmo - Copy.jpeg
-a----         1/06/2025   1:23 AM             20 cosmo.WANNAHUSKY
-a----         1/06/2025   1:23 AM          32478 WANNAHUSKY.png


PS C:\\Users\\Peas\\Desktop> Get-Content .\\cosmo.WANNAHUSKY
I2uBeONAyInsSK8UmIQ=
PS C:\\Users\\Peas\\Desktop>
```

The above base64 is simply an encoded representation of the encrypted bytes, however.

```sh
[please@ruby]nsSK8UmIQ==' | base64 -d
#kx@ȉHbase64: invalid input
```

WannaHusky appears to implement a very naive encryption method; the output is deterministic and will always produce the same output given the same input. This means
it should be not only possible, but potentially quite straightforward to reverse engineer a decryption key.

```powershell
PS C:\\Users\\Peas\\Desktop> echo 'A' | Out-File -FilePath cosmo.jpeg
PS C:\\Users\\Peas\\Desktop> .\\wannahusky.exe > $null
PS C:\\Users\\Peas\\Desktop> Get-Content .\\cosmo.WANNAHUSKY
I2uBeK9Ag4k=
PS C:\\Users\\Peas\\Desktop> echo 'A' | Out-File -FilePath cosmo.jpeg
PS C:\\Users\\Peas\\Desktop> .\\wannahusky.exe > $null
PS C:\\Users\\Peas\\Desktop> Get-Content .\\cosmo.WANNAHUSKY
I2uBeK9Ag4k=
PS C:\\Users\\Peas\\Desktop>
```


## Advanced Analysis 

A significant portion of this sample's functionality is stored without obfuscation directly within the binary. As such, it is reasonably easy to grasp the sample's 
purpose by dumping its internal strings. This is done herein using [`FLOSS`](https://github.com/mandiant/flare-floss). The full `FLOSS` output is available as
[**Appendix E**](#appendix-e-floss-output).

Observing the `FLOSS` output, the `COSMO` string below instinctually stands out as a prime candidate for an encryption key:

```c
@COSMO
@Desktop\\target\\cosmo.WANNAHUSKY
@Desktop\\cosmo.jpeg
```

Disassembling the sample, the `COSMO` string was indeed intended for use as a key - the `COSMO` string is passed to a key digest generation function to generate a 32-byte key
from the 5-byte string. The actual output from this key digest function appears to have unintentionally gone unused, with the function used to initialize encryption context
being passed the nonce bytearray (which is initialized with 16 `NULL` bytes) instead of the key digest:

![ida-cosmo-key](/img/wannahusky-report/cosmo-key.webp)

> Disassembly for key digest creation and context initialization.

![ida-context-init](/img/wannahusky-report/ida-context-init.webp)

> Decompilation of the digest creation and context initialization.

This is confirmed when inspecting the values that are passed to the context initialization function in `x32dbg`, where a pointer to the address of an array of `NULL` bytes appears
to be passed instead of the generated key digest:

![x32-dbg-nullptr](/img/wannahusky-report/x32-dbg-address-null.webp)

> Where `x64`'s ABI generally uses a four-register + stack calling convention to pass arguments to a function, `x86` differs
> [depending on the function call's type](https://learn.microsoft.com/en-us/cpp/cpp/argument-passing-and-naming-conventions?view=msvc-170). The above context initialization function
> uses the `__stdcall` convention, where all arguments are pushed onto the stack.

The use of `AES256` can also be assumed here given the size of the key (32 bytes) and IV (16 bytes - referred to as a nonce in `CTR` mode). `CTR` mode was ultimately determined 
through a process of elimintation - the ciphertext contains too few bytes to be strict `CBC` or `GCM` - and some trial and error.

## Embedded Files

#### ps1.ps1

The Powershell script used to modify the victim's desktop background is stored unobfuscated as a Nim string. The `$code` variable here
contains a string of `C#` code, which effectively loads the [SystemParametersInfo](https://learn.microsoft.com/en-us/windows/win32/api/winuser/nf-winuser-systemparametersinfoa) 
API function from `user32.dll` into the script. Below, `ps1.ps1` uses this API function to perform wallpaper modification.

```powershell
@powershell 
@Desktop\\ps1.ps1
@$code = @'
using System.Runtime.InteropServices;
namespace Win32{
    
    public class Wallpaper{
      [DllImport("user32.dll", CharSet=CharSet.Auto)]
      static  extern int SystemParametersInfo (int uAction , int uParam , string lpvParam , int fuWinIni) ;
      public static void SetWallpaper(string thePath){
         SystemParametersInfo(20,0,thePath,3);
      }
    }
add-type $code
$currDir = Get-Location
$wallpaper = ".\\WANNAHUSKY.PNG"
$fullpath = Join-Path -path $currDir -ChildPath $wallpaper
[Win32.Wallpaper]::SetWallpaper($fullpath)
```


#### WANNAHUSKY.png

The ransom note PNG is also embedded in plaintext within the binary - note the `IHDR`, `sRBG`, `gAMA`, `pHYs`, and `IDAT` header bytes directly
after the `Desktop\WANNAHUSKY.png` filepath, and the `IEND` trailer.

```powershell
@Desktop\\WANNAHUSKY.png
IHDR
sRGB
gAMA
\\tpHYs
~rIDATx^
}1JsPt.:
~-F\\t!{
F</@
?!My
?!dM0
Xn#i
?!Y@&
UBH}
wsR[
?CJ^J

[ .. truncated .. ]

$" C
o4GDZ
?5SZ
%OCZIE
I|w7
z0Gz
1RgOB
@Z-B
IEND
```


The `FLOSS` output also contains references to Windows header structures associated with more advanced evasion techniques like API hashing, 
PE injection, and anti-debugging. This was noted during early analysis, but hindsight indicates that these strings don't match the format
used by the Nim compiler. 

Interestingly, it is these struct-related strings in particular that are responsible for the content present in the `/19` section. This may
be an artifact of how Nim compiles debug builds - or possibly `mingw`-related - but it appears generally inconsequential to the sample's
functionality.

![strings-peviewer](/img/wannahusky-report/strings-peviewer.webp)

```c
_IMAGE_DOS_HEADER
e_magic

// ...

e_lfanew
IMAGE_DOS_HEADER
PIMAGE_DOS_HEADER

// ...

VirtualAddress
SizeOfRawData
PointerToRawData
PointerToRelocations
PointerToLinenumbers
NumberOfRelocations
NumberOfLinenumbers
Characteristics
PIMAGE_SECTION_HEADER

// ... 
```

<br />

For the most part, the above `FLOSS` output will be incorporated into a YARA ruleset for detecting instances of WannaHusky.

<br />

<br />

## Appendices

Copies of this report, the malware sample, and all the appendices are also available in [this GitHub repository](https://github.com/plsuwu/pmat-final).

### Appendix A: Decryption Script

> [GitHub mirror](https://github.com/plsuwu/pmat-final/blob/main/remediation/decrypt.py)

```python
#!/usr/bin/env python

"""
-----------------------------------------------
https://github.com/plsuwu | https://plsuwu.com
-----------------------------------------------
An over-engineered script for decrypting
encrypted `cosmo.WANNAHUSKY` files.

Requires the 'Crypto' package
(https://pypi.org/project/pycryptodome/):

  $: pip install pycryptodome
-----------------------------------------------
"""

from typing import Any
from Crypto.Cipher import AES
import base64
import pathlib
import os


TARGET_FILENAME: str = "cosmo.jpeg"
ENCRYPTED_FILENAME: str = "cosmo.WANNAHUSKY"
USER_HOME_DIR: pathlib.Path = pathlib.Path.home()
DECRYPTED_FILEPATH: str = os.path.join(USER_HOME_DIR, "Desktop", TARGET_FILENAME)
ENCRYPTED_FILEPATH: str = os.path.join(USER_HOME_DIR, "Desktop", ENCRYPTED_FILENAME)

ENCRYPTION_KEY: bytes = b"\x00" * 32
CTR_NONCE: bytes = b"\x00" * 8


class RetrieveCosmo:
    def __init__(
        self,
        enc_file: str = ENCRYPTED_FILEPATH,
        dec_file: str = DECRYPTED_FILEPATH,
        key: bytes = ENCRYPTION_KEY,
        nonce: bytes = CTR_NONCE,
    ):
        self.enc_file: str = enc_file
        self.dec_file: str = dec_file
        self.key: bytes = key
        self.nonce: bytes = nonce

        self.context: Any = None
        self.ciphertext: Any = None
        self.plaintext: Any = None

    def _check_initialized(self):
        """
        Checks the current state of the object's fields to ensure all required
        fields are initialized prior to a decryption attempt
        """

        # determine which fields are populated
        state = [
            1 if self.context is not None else 0,
            1 if self.ciphertext is not None else 0,
            1 if self.plaintext is not None else 0,
        ]

        match state:
            # ------------------------------------------------------
            # All required fields are initialized, return and
            # continue
            case [_, _, 1]:
                return

            # ------------------------------------------------------
            # No required fields are initialized
            # Set up all fields before continuing
            case [0, 0, 0]:
                state[0] = 1
                self.init_context()

                state[1] = 1
                self.read_encrypted()

                state[2] = 1
                self._decrypt()

            # ------------------------------------------------------
            # Only self.context is initialized, set up the other
            # fields before continuing
            case [1, 0, 0]:
                state[1] = 1
                self.read_encrypted()

                state[2] = 1
                self._decrypt()

            # ------------------------------------------------------
            # Only self.plaintext is confirmed uninitialized
            #
            # (makes a check for context though this is likely not
            # a possible state for our state machine)
            case [_, 1, 0]:
                if state[0] == 0:
                    state[0] = 1
                    self.init_context()
                state[1] = 1
                self._decrypt()

    def init_context(self) -> None:
        self.context = AES.new(
            self.key, AES.MODE_CTR, nonce=self.nonce, initial_value=0
        )

    def decode_b64(self, encoded: bytes) -> bytes:
        return base64.decodebytes(encoded)

    def read_encrypted(self) -> None:
        with open(self.enc_file, "rb") as handle:
            encoded = handle.read()
            self.ciphertext = self.decode_b64(encoded)

    def _decrypt(self) -> None:
        self.plaintext = self.context.decrypt(self.ciphertext)

    def get_decrypted(self) -> str:
        self._check_initialized()

        wide_ascii = (bytes(self.plaintext)).decode("ansi")
        return wide_ascii

    def write_decrypted(self) -> None:
        self._check_initialized()
        with open(self.dec_file, "wb") as handle:
            handle.write(self.plaintext)


def main() -> None:
    cosmo = RetrieveCosmo()
    dec = cosmo.get_decrypted()

    # truncate printed bytes
    print("\n[+] Retrieved decryped content: \n")
    print(bytes(dec[:64], "utf-8"), " ...\n")

    print(f"[+] Writing back to {cosmo.dec_file}...")
    cosmo.write_decrypted()

    print("[+] Decryption complete.\n")


if __name__ == "__main__":
    main()
```

### Appendix B: YARA Rules

> [GitHub mirror](https://github.com/plsuwu/pmat-final/blob/main/remediation/wannahusky.yara)

```yara
import "pe"

/**
* Probably over-engineered, I kind of just wanted
* to practice writing YARA rules.
*/

private rule has_embedded_png {
    meta: 
        date = "2025-05-19"
        author = "plsuwu"
        description = "Uses the PNG magic bytes to determine potential embedded PNG data."
    strings: 
        $png_magic = { 89 50 4E 47 0D 0A 1A 0A }
    condition:
        $png_magic
}

private rule has_nim_pe_strings {
    meta: 
        date = "2025-05-19"
        author = "plsuwu"
        description = "Identifies strings associated with the Nim compiler."
    strings: 
        $nim_main = "NimMain" ascii wide
        $pre_main_inner = "PreMainInner" ascii wide
    condition:
        any of them
}

private rule contains_nimcrypto_imports {
    meta: 
        date = "2025-05-19"
        author = "plsuwu"
        description = "Identifies strings associated with nimcrypto functions."
    strings:
        $nimcrypto = "nimcrypto" ascii wide
        $nimble = /nimble.{,5}pkgs/i ascii wide
        $mod_bcmode = "bcmode" ascii wide
        $mod_rijndael = "rijndael" ascii wide
        $mod_sha2 = "sha2" ascii wide
        $mod_utils = "utils" ascii wide
        $mod_hash = "hash" ascii wide
        $mod_sysrand = "sysrand" ascii wide
    condition:
        has_nim_pe_strings and (any of ($mod_*)) and ($nimble or $nimcrypto)
}

rule is_wannahusky_binary {
    meta: 
        date = "2025-05-19"
        author = "plsuwu"    
        description = "Detects WannaHusky ransomware binaries."

    strings: 
        $cosmo_key = "COSMO" ascii wide
        $wannahusky_png = "WANNAHUSKY.PNG" ascii wide
        $cosmo_encrypted = "cosmo.WANNAHUSKY" ascii wide
        $cosmo_original = "cosmo.jpeg" ascii wide
        $ps1_ps1_payload = "ps1.ps1" ascii wide
        $wannahusky_func = "wannaHusky__" ascii wide
        $change_bg_func = "changeBackground__" ascii wide

    condition:
        (pe.is_pe and has_embedded_png and contains_nimcrypto_imports) and (
            all of them
        )
}
```

### Appendix C: WANNAHUSKY.png

> [GitHub mirror](https://github.com/plsuwu/pmat-final/blob/main/artifacts/WANNAHUSKY.png)

<center>
    <img src='/img/wannahusky-report/WANNAHUSKY.webp' />
</center>

### Appendix D: ps1.ps1

> [GitHub mirror](https://github.com/plsuwu/pmat-final/blob/main/artifacts/ps1.ps1)

```powershell
$code = @'
using System.Runtime.InteropServices;

namespace Win32{
    
    public class Wallpaper{

      [DllImport("user32.dll", CharSet=CharSet.Auto)]
      static  extern int SystemParametersInfo (int uAction , int uParam , string lpvParam , int fuWinIni) ;

      public static void SetWallpaper(string thePath){
         SystemParametersInfo(20,0,thePath,3);
      }
    }
}
'@
add-type $code

$currDir = Get-Location
$wallpaper = ".\WANNAHUSKY.PNG"
$fullpath = Join-Path -path $currDir -ChildPath $wallpaper

[Win32.Wallpaper]::SetWallpaper($fullpath)
```

### Appendix E: FLOSS Output

The content of this file was deemed to long to include as an inline appendix - please refer to the 
[GitHub repository](https://github.com/plsuwu/pmat-final/blob/main/artifacts/wannahusky.strings.txt) instead.
