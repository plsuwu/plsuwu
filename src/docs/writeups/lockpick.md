---
title: "Lockpick"
link: "https://app.hackthebox.com/sherlocks/Lockpick"
description: "Forela needs your help! A whole portion of our UNIX servers have been hit with what we think is ransomware."
author: "hackthebox"
date: "2024-02-02"
published: true
area: "ctf"
tags: ["reversing", "malware"]
---

# Lockpick

<aside>
<a href={link}>{title} @ {author}</a><br/>
Forela needs your help! A whole portion of our UNIX servers have been hit with what we think is ransomware.
We are refusing to pay the attackers and need you to find a way to recover the files provided.
</aside>

## Tasks

The challenge indicates the following tasks (which are essentially the challenge's flags) to complete:

1. Please confirm the encryption key string utilised for the encryption of the files provided
2. We have recently received an email from `wbevansn1@cocolog-nifty.com`  demanding to know the first and last name we have him registered as. They believe they
made a mistake in the application process. Please confirm the first and last name of this applicant.
3. What is the MAC address and serial number of the laptop assigned to Hart Manifould?
4. What is the email address of the attacker?
5. City of London Police have suspicions of some insider trading taking part within our trading organisation. Please confirm the email address of the person with
the highest profit percentage in a single trade alongside the profit percentage.
6. Our E-Discovery team would like to confirm the IP address detailed in the Sales Forecast log for a user who is suspected of sharing their account with a
colleague. Please confirm the IP address for Karylin O'Hederscoll.
7. Which of the following file extensions is not targeted by the malware? `.txt, .sql,.ppt, .pdf, .docx, .xlsx, .csv, .json, .xml`
8. We need to confirm the integrity of the files once decrypted. Please confirm the MD5 hash of the applicants DB.
9. We need to confirm the integrity of the files once decrypted. Please confirm the MD5 hash of the trading backup.
10. We need to confirm the integrity of the files once decrypted. Please confirm the MD5 hash of the complaints file.

### Task 1

This task requires the encryption key - loading this up in IDA, the `.text`  section contains the following strings:

```nasm
sub     rsp, 10h
.text:000000000000174E                 lea     rax, aBhulishutrea98 ; "bhUlIshutrea98liOp"
.text:0000000000001755                 mov     [rbp+var_8], rax
.text:0000000000001759                 lea     rax, aForelaCritical ; "/forela-criticaldata/"
.text:0000000000001760                 mov     [rbp+var_10], rax
.text:0000000000001764                 mov     rdx, [rbp+var_8]
.text:0000000000001768                 mov     rax, [rbp+var_10]
.text:000000000000176C                 mov     rsi, rdx
.text:000000000000176F                 mov     rdi, rax
.text:0000000000001772                 call    process_directory
```

`bhUlIshutrea98liOp` looks suspiciously like a key. Running through the instructions in the `main` function here:

1. The binary loads two memory addresses into `$rax`, with each address storing a string:
    - `"bhUlIshutrea98liOp"`
    - `"/forela-criticaldata/"`
2. The `process_directory` function is then called, presumably using the directory indicated by the `/forela-criticaldata/` string to walk the directory,
using the string to encrypt any matching files.

#### Decryption

With the Task 1 content (likely) in hand, it’s apparent that most of the other tasks are going to require decrypted files. I couldn’t find a direct symbolic
reference to the encryption *method*, but we might as well start by running something through an XOR function.

So, using Cyberchef with the string `bhUlIshutrea98liOp` as the key, we can test one of the encrypted files:

![Untitled](/img/lockpick_img/Untitled.png)

That’s Task 1 confirmed, but I’ll decrypt the other files to make upcoming tasks a little easier.

It’s a little tedious to feed each file into Cyberchef by hand, so we can imitate the script to rerun the XOR function with a Python script to decrypt any
encrypted files. I exclude anything with a  `.txt` extension as the malware dropped a ransom note for each file it encrypts (and encrypted content uses a
`.24bes` extension), so we won’t run the function for the ransom notes.

```python
from itertools import cycle
import os

KEY = b"bhUlIshutrea98liOp"
DIR = "./forela-criticaldata/"
text = b"test_str"

def xor(data: bytes, key: str) -> bytes:
    ## xor `data` with `key`, returning resulting bytes
    return bytes(a ^ b for a, b in zip(data, cycle(key)))

def main():
    for filename in os.listdir(DIR):
        print(filename)
        file: str = DIR + filename

        if not file.endswith(".txt"):
            with open(file, "rb") as en, open(f"{file}.dec", "wb") as de:
                ## for each encrypted file, write XOR'd content to new file
                encr = en.read()
                decr = xor(encr, KEY)

                print(f"[DECRYPTED: {file}]")
                de.write(decr)

main()
```

The result is the following output

```python
PS C:\\Users\\please\\Desktop\\lockpick1> python cycle.py
co2_London
[DECRYPTED FILE ./forela-criticaldata/co2_London]
complaints.csv.24bes
[DECRYPTED FILE ./forela-criticaldata/complaints.csv.24bes]
complaints.csv.24bes_note.txt
customer-feedback.json.24bes
[DECRYPTED FILE ./forela-criticaldata/customer-feedback.json.24bes]
customer-feedback.json.24bes_note.txt
forela_uk_applicants.sql.24bes
[DECRYPTED FILE ./forela-criticaldata/forela_uk_applicants.sql.24bes]
forela_uk_applicants.sql.24bes_note.txt
it_assets.xml.24bes
[DECRYPTED FILE ./forela-criticaldata/it_assets.xml.24bes]
it_assets.xml.24bes_note.txt
sales_forecast.xlsx.24bes
[DECRYPTED FILE ./forela-criticaldata/sales_forecast.xlsx.24bes]
sales_forecast.xlsx.24bes_note.txt
trading-firebase_bkup.json.24bes
[DECRYPTED FILE ./forela-criticaldata/trading-firebase_bkup.json.24bes]
trading-firebase_bkup.json.24bes_note.txt
```

![Untitled](/img/lockpick_img/Untitled%201.png)

### Task 2

Task 2-4 are kind of just `ctrl+f` jobs, so nothing particularly interesting to see here, but I’ll go through each anyway for the sake of completionism.

For Task 2, a simple search can be performed with in the decrypted applicants database file to find the email address `wbevansn1@cocolog-nifty.com`.

![Untitled](/img/lockpick_img/Untitled%202.png)

### Task 3

Again, we can do a quick search to find `Hart Manifould` in the `it_assets.xml` spreadsheet:

![Untitled](/img/lockpick_img/Untitled%203.png)

### Task 4

The attacker’s email is in the ransom note:

![Untitled](/img/lockpick_img/Untitled%204.png)

### Task 5

Task 5 requires us to confirm the email address and profit percentage of the person with the highest profit margin in a single trade. The trading database is
backed up to JSON, so we can pretty easily use Python dictionary references to find the inside trader:

```python
import json

FILENAME = "trading-firebase_bkup.json.24bes.dec"

## dict to hold the highest trader's email and profit percent
highest_profit = {"email": "N", "trade_profit": 0}

def check_high(trade_profit: str) -> bool | None:
    global highest_profit

    if float(trade_profit) > float(highest_profit["trade_profit"]):
        print(f"new high: {trade_profit}")
        return True

def main(file: str) -> None:
    global highest_profit

    with open(file, "r") as f:
        ## we essentially perform a bubble sort to get the highest-profit trade

        json_content = json.loads(f.read())

        for trader in json_content:
            if check_high(json_content[trader]["profit_percentage"]):
                highest_profit = {
                    "email": json_content[trader]["email"],
                    "trade_profit": str(json_content[trader]["profit_percentage"]),
                }
    print(f"highest -> {highest_profit}")

main(FILENAME)
```

Frustratingly, Python's float precision isn't high enough to store the entire profit percentage needed to get the correct answer for this task. I tried to force this to stay put
by converting the value to a string instead, but this obviously doesn’t work probably on account of the fact that the interpreter still has to load the value as a float into memory
at some point, where it is probably truncated.

Rather than continue to waste time on this one relatively small issue, I copied the email string used `ctrl+f` with VS C*de to find the correct profit percentage:

![Untitled](/img/lockpick_img/Untitled%205.png)

![Untitled](/img/lockpick_img/Untitled%206.png)

### Task 6

We find the IP address for Karylin O'Hederscoll in `sales_forecast.xlsx` - this is unfortunately *not* a quick `ctrl+f` as Office files store their
content in what is essentially a compressed zip archive (note the magic bytes `PK..`):

![Untitled](/img/lockpick_img/Untitled%207.png)

It’s always handy to have Office around for malware analysis, so I wind up downloading & installing MS365 - allowing me to (get this) find Karylin’s IP with `ctrl+f`:

![Untitled](/img/lockpick_img/Untitled%208.png)

### Task 7

The extensions targeted by the binary require us to jump back into IDA - there's a section of contiguous memory that stores a sequence of strings (I think the kids call this an "array") - these are very clearly file extensions -
the binary calls these as part of the `process_directory` function, and we can see that 24bes isn’t looking to target `.ppt` files:

![Untitled](/img/lockpick_img/Untitled%209.png)

### Task 8, 9, and 10

And finally, we can just run `md5sum` the requested decrypted files (Task 8 is `applications.sql`, 9 is `firebase_bkup.json`, and 10 is `complaints.csv`) to get the hashes for the final three tasks:

![Untitled](/img/lockpick_img/Untitled%2010.png)
