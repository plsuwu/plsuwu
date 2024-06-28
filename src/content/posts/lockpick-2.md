---
title: "Lockpick 2"
link: "https://app.hackthebox.com/sherlocks/Lockpick2.0"
description: "We've been hit by Ransomware again, but this time the threat actor seems to have upped their skillset."
from: "hackthebox"
date: "2024-02-03"
type: "ctf"
tags: ["rev", "crypto", "malware"]
---

# Lockpick 2

<aside>
<a href={link}>{title} @ {author}</a><br/>
We've been hit by Ransomware again, but this time the threat actor seems to have upped their skillset.
Once again they've managed to encrypt a large set of our files. It is our policy NOT to negotiate with criminals.
Please recover the files they have encrypted - we have no other option! Unfortunately our CEO is on a no-tech retreat so can't be reached.
</aside>

Similar to [the first Lockpick challenge](/writeups/lockpick), this challenge hands us an ELF binary with the same general context of "decrypt these files with information from this ransomware binary".

## Tasks

Our tasks for this challenge are as follows:

1. What type of encryption has been utilised to encrypt the files provided?
2. Which market is our CEO planning on expanding into? (Please answer with the wording utilised in the PDF)
3. Please confirm the name of the bank our CEO would like to takeover?
4. What is the file name of the key utlised by the attacker?
5. What is the file hash of the key utilised by the attacker?
6. What is the BTC wallet address the TA is asking for payment to?
7. How much is the TA asking for?
8. What was used to pack the malware?

As this challenge's binary is a little more complex and the questions are a little more disordered, I'll go through the steps for analysis rather than per task as in the first Lockpick.

## Basic analysis

I want to start by just running it to see what happens, so I will copy it onto a Kali box which *should* have a few pre-installed tools to do some network/system analysis when we detonate. While we are told that the
binary is packed, other aspects such as
- the very small size of `.zip` archive itself,
- the content of the IDA disassembly,
- even just some basic output from `strings` or `objdump`,

Would be giveaways as to a packed binary.

Here, the output from `strings` indicates that the binary is packed with UPX (which is the answer for task 8). I’m going to detonate it with `Wireshark` monitoring the traffic (over an internal VM network with `inetsim`),
and then I want to unpack it and load into IDA.

![Untitled](/img/lockpick_2_img/Untitled.png)

Nothing super obvious yet, but that’s currently on account of the compression hiding away most of the functionality. I’ll quickly mark it as executable and run it and see what happens.

![Untitled](/img/lockpick_2_img/Untitled%201.png)

Wireshark indicates the binary reaches out to an endpoint, seemingly via `curl` (though these could just as easily be hard-coded strings):

![Untitled](/img/lockpick_2_img/Untitled%202.png)

This binary is starting to seem a bit suspicious...

To me, it’s not exactly obvious what is going on from this or the Wireshark output alone. I will come back to those URLs if necessary - the binary isn’t actually receiving any usable data on account of  `inetsim`,
so I feel like this is just printing some junk URLs and doing funny malware stuff in the background.

## Unpacking and investigating

Unpacking it and running it through IDA now...

![Untitled](/img/lockpick_2_img/Untitled%203.png)

![Untitled](/img/lockpick_2_img/Untitled%204.png)

> *from ~10K to ~24K*

With the program decompressed, we can take a much better look at its internals. In the symbol table, we can note that the binary is most likely using AES to encrypt the files (with AES being the answer for Task 1):

![Untitled](/img/lockpick_2_img/Untitled%205.png)

In the read-only data section, there are several interesting constants pertinent given the context of ransomware:

- A reference to a string, `b7894532snsmajuys6`, which seems like it a candidate for use in crypto-related functions,
- The target directory (`/share/`), and a list of file extensions,
- And finally, the ransom note output, which links to a `pastes.io` URL containing raw ascii - this is the ransom text:

![Untitled](/img/lockpick_2_img/Untitled%206.png)

![Untitled](/img/lockpick_2_img/Untitled%207.png)

> *`xyzf3jv6xq3d7w5e.onion` looks too short to be a valid onion URL so I’m ignoring it.*

## get_key_from_url & xor_cipher functions

After a bit of digging to try to find out how the binary is encrypting files, my general interpretation of the relevant program flow is as follows:

1. `main` does some initial library setup stuff (seems to be preparing `curl`) before calling a `get_key_from_url` function,
2. `get_key_from_url` loads a pair of strings into memory:
    - The first string from `HESB`, which is the string “`b7894532snsmajuys6`" in `.rodata`,
    - The second string from `unk_3010`, which is a chunk of the `.rodata` segment that is housing some hex values.
3.  `get_key_from_url` calls `xor_cipher`, where it performs an `XOR` operation on the two strings:

![Untitled](/img/lockpick_2_img/Untitled%208.png)

> *Diagram is a little messy and hard to follow but I don’t really know how to make assembly function calls readable.*

As the function name indicates an XOR cipher, we can perform some manual decryption using these strings and Cyberchef. It seems the binary is using the `get_key_from_url` function to print the strings (URLs) to the terminal:

![Untitled](/img/lockpick_2_img/Untitled%209.png)

![Untitled](/img/lockpick_2_img/Untitled%2010.png)

> *`https://rb.gy/ehec6` is similar enough to the `Https://rb.gy/ehec` in the manual decryption.*

It's worth noting that it might be worth exercizing even a small amount of caution before opening sites referenced in *real* malware. In this instance, its kind of unlikely that HTB will do
anything insane and malicious to my network or VM, and having mentally assessed the risks, I'm happy to go ahead and open the URL. We find out that the service returns a 301 status and redirects to Google.

![Untitled](/img/lockpick_2_img/Untitled%2011.png)

However, the domain seems to belong to a URL shortening service, so maybe the other links direct to some kind of service?

![Untitled](/img/lockpick_2_img/Untitled%2012.png)

They don’t!

## Decryption

None of the URLs directly printed to `stdout` lead to anything interesting - just pointless redirections to Google/Yahoo/similar websites.

Instead of trying to figure out the exact XOR methodology here, I opt to use `gdb` to step through the `get_key_from_url` and `xor_cipher` functions, as we now know *generally* where we want to look:

- Open the binary for debugging with `gdb ./update`,
- Set breakpoints at `break get_key_from_url` and `break xor_cipher` function calls,
- Run the binary until we hit the first breakpoint,
- Step through the instructions until I hit something interesting.

In the `xor_cipher` function, we hit an instruction where our `HESB` key is loaded into `$rdx`:

![Untitled](/img/lockpick_2_img/Untitled%2013.png)

Taking another step, we can see the following (previously unseen) URL as the result of the `xor_cipher` function call:

![Untitled](/img/lockpick_2_img/Untitled%2014.png)

Navigating to that URL, a tiny 48-byte payload is dropped (Task 4 is this file's name, and Task 5 requires us to run `md5sum` on it):

![Untitled](/img/lockpick_2_img/Untitled%2015.png)

Opening it with Vim, the content seems like it could be the AES-encrypted string:

![Untitled](/img/lockpick_2_img/Untitled%2016.png)

> *`file` command output*


![Untitled](/img/lockpick_2_img/Untitled%2017.png)

> *the file’s actual content*


I’m not really sure what should be used as the key, but I am kind of sick of looking at assembly and it’s like 4am so I opt to mash strings together in Cyberchef until something sticks.

Luckily, we quickly land on converting the dropped payload to hex, and then cutting the 48-byte payload to AES key specification of `16`/`24`/`32` bytes.

![Untitled](/img/lockpick_2_img/Untitled%2018.png)

Truncating it to the first 32 bytes (i.e, removing some characters from the end of the key) returns some promising results when we run it against the encrypted PDF document:

![Untitled](/img/lockpick_2_img/Untitled%2019.png)

While the output in Cyberchef seems like PDF content, it unfortunately doesn’t result in a readable PDF document when I actually try to open it.

![Untitled](/img/lockpick_2_img/Untitled%2020.png)

I try this again against the `takeover.docx` file, where Word automatically performed some kind of auto-repair function, producing a working Word document:

![Untitled](/img/lockpick_2_img/Untitled%2021.png)

Not exactly sure what is wrong here - my guess is that there is possibly something off with the `CR`/`LF` encoding given how close I was; my VM host here is running on a Windows machine whereas the victim runs Linux,
which both use different line separator encodings. Ultimately, following Word’s example, we can get a perfectly functional PDF document after running it through an online PDF repair service:

![Untitled](/img/lockpick_2_img/Untitled%2022.png)

![Untitled](/img/lockpick_2_img/Untitled%2023.png)

## Finally,

From these decrypted documents, we can get the answer for tasks 2 and 3 (the answers being `Australian Market` and `Notionwide` respectively).

For the final remaining flags (the BTC wallet and ransom amount), we can just pull this directly from the ransom note; `1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2` for the wallet address,
and `£1000000` (a million pounds) for the amount.
