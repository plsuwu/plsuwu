---
title: "Speakfriend"
description: "It seems like this website was compromised. We found this file that seems to be related... can you make any sense of these and uncover a flag?"
author: "huntress"
date: "2023-10-21"
published: true
tags: ["capture the flag", "huntress", "forensics", "reversing", "web", "networks"]
---

# Speakfriend

<aside>
It seems like this website was compromised. We found this file that seems to be related... can you make any sense of these and uncover a flag?
</aside>

We are handed a containerized webserver instance, and some required files in a zipped archive, `main.7z`. I suspect there is nothing surface-level to see on this website's frontend - a
cursory glance through the source and various pages indicates that this assumption is *probably* correct.

![Standard Bootstrap template stuff](/img/speakfriend_img/Untitled.png)

> Gunicorn aside (before you ask - yes!! it runs horrendously!!), this is pretty standard Bootstrap+jQuery template stuff

```html
$ curl --insecure 'https://chal.ctf.games:32032'
<!DOCTYPE html>
<html>

<head>
  <!-- Basic -->
  <meta charset="utf-8" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <!-- Mobile Metas -->
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
  <!-- Site Metas -->
  <meta name="keywords" content="" />
  <meta name="description" content="" />
  <meta name="author" content="" />
  <link rel="shortcut icon" href="/static/images/favicon.png" type="image/x-icon">

  <title>Guarder</title>

  <!-- bootstrap core css -->
  <link rel="stylesheet" type="text/css" href="/static/css/bootstrap.css" />

  <!-- fonts style -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:400,700|Poppins:400,6&di ... " />

  <!-- Custom styles for this template -->
  <link href="/static/css/style.css" rel="stylesheet" />
  <!-- responsive style -->
  <link href="/static/css/responsive.css" rel="stylesheet" />

 <!-- ... truncated (you get the idea I think) ... -->
```
> `curl` request output

Extracting the archive (via a quick `7z x main.7z` command), we can run some basic filetype identification commands - `file` / `strings` / `objdump`:

```bash
$ file main
main: ELF 64-bit LSB pie executable, x86-64, version 1 (SYSV), dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, \\
BuildID[sha1]=f020f8b12bc1a0b0f3122413b698344bfbfd1d9d, for GNU/Linux 3.2.0, not stripped
```
> `file` output ...


```bash
$ strings main
/lib64/ld-linux-x86-64.so.2
libcurl-gnutls.so.4
__gmon_start__
# ...
curl_easy_cleanup
curl_easy_init
curl_easy_setopt
curl_easy_perform
curl_global_init
libc.so.6
# ...
Mozilla/H
5.0 93beH
d45b-7b7H
0-4097-9H
279-98a4H
aef0353eH
[]A\\A]A^A_
%s:%s
:*3$"
GCC: (Ubuntu 9.4.0-1ubuntu1~20.04.1) 9.4.0
crtstuff.c
# ...
_curl_easy_setopt_err_long
_curl_easy_setopt_err_curl_off_t
_curl_easy_setopt_err_string
_curl_easy_setopt_err_write_callback
_curl_easy_setopt_err_resolver_start_callback
_curl_easy_setopt_err_read_cb
_curl_easy_setopt_err_ioctl_cb
_curl_easy_setopt_err_sockopt_cb
# ... etc
```
> ... `strings` output ...


```bash
$ objdump -s ./main

./main:     file format elf64-x86-64

Contents of section .dynstr:
 0560 006c6962 6375726c 2d676e75 746c732e  .libcurl-gnutls.
 0570 736f2e34 005f5f67 6d6f6e5f 73746172  so.4.__gmon_star
 0580 745f5f00 5f49544d 5f646572 65676973  t__._ITM_deregis
 0590 74657254 4d436c6f 6e655461 626c6500  terTMCloneTable.
 05a0 5f49544d 5f726567 69737465 72544d43  _ITM_registerTMC
 05b0 6c6f6e65 5461626c 65006375 726c5f65  loneTable.curl_e
# ...
 0680 322e322e 35004355 524c5f47 4e55544c  2.2.5.CURL_GNUTL
 0690 535f3300                             S_3.
# ...
1480 48898530 feffff48 b84d6f7a 696c6c61  H..0...H.Mozilla
 1490 2f48ba35 2e302039 33626548 898540fe  /H.5.0 93beH..@.
 14a0 ffff4889 9548feff ff48b864 3435622d  ..H..H...H.d45b-
 14b0 37623748 ba302d34 3039372d 39488985  7b7H.0-4097-9H..
 14c0 50feffff 48899558 feffff48 b8323739  P...H..X...H.279
 14d0 2d393861 3448ba61 65663033 35336548  -98a4H.aef0353eH
```
> ...and finally, `objdump` output.

Notable are the `curl` and `Mozilla` strings - the `H` strings might also refer to `curl`’s `-H` header argument - so it could be making some kind of request with `curl`, and pretending to be a Firefox client or something?

Lets just see what happens when we run the binary:

```bash
pls@RUBY~$ ./main

pls@RUBY~$
```

Nothing happened at all!!

We could try passing some arguments to it - I go with `-h`, to see if it has a `help` command/usage info. Something is happening in the background as `stdin` gets
hijacked, but ultimately I wound up aborting here with `<C-c>`.

![Untitled](/img/speakfriend_img/Untitled%201.png)

Suspecting an internal call for some `curl` functionality - and therefore probably reaching out to the internet - we might get something on `Wireshark`:

![Untitled](/img/speakfriend_img/Untitled%202.png)

It’s a little tough to say exactly what is what traffic is outbound from what application as nothing is immediately obvious here. Also, the challenge uses TLS, so it’s possible for basically any of
these to be relevant, as opposed to the bright green packets of unencrypted HTTP. Turning on hostnames was also pretty unhelpful - I really should set up a proper internalised lab with REMnux
to limit network traffic when I get the chance.

So instead, maybe we can give it a specific point to reach out to - why don’t we try running a specific IP through it? In fact, we can grab the IP of the remote machine with the Network tab
of Chrome’s Dev Tools and throw it in as an argument to see if the binary produces any network activity when we filter Wireshark results to contain only the target machine's IP:

![Untitled](/img/speakfriend_img/Untitled%203.png)

```bash
pls@RUBY~$ ./main 34.123.197.237:32032
# ...
```

We can filter the Wireshark output for requests/responses containing that IP, and we see _exactly_ what we wanted to see.

It seems like the binary makes an unencrypted request to the server, meaning we can _also_ see the data attached to the request:

![Untitled](/img/speakfriend_img/Untitled%204.png)

![Untitled](/img/speakfriend_img/Untitled%205.png)

Let’s use those in our own curl request and see what happens:

```bash
pls@RUBY~$ curl 34.123.197.237:32032 -H 'GET / HTTP/1.1' \\
-H 'Host: 34.123.197.237:32032' \\
-H 'User-Agent: Mozilla/5.0 93bed45b-7b70-4097-9279-98a4aef0353e' \\
-H 'Accept: */*'
curl: (56) Recv failure: Connection reset by peer
```

Unlucky, maybe instead of an IP, we need to make a request to the URL itself (the server's SSL cert isn't valid, so we need to tell `curl` that it should disregard certificate
validity using the `--insecure` arg):

```bash
curl https://chal.ctf.games:32032 --insecure -H 'GET / HTTP/1.1' \\
-H 'Host: 34.123.197.237:32032' \\
-H 'User-Agent: Mozilla/5.0 93bed45b-7b70-4097-9279-98a4aef0353e' \\
-H 'Accept: */*'
<!doctype html>
<html lang=en>
<title>Redirecting...</title>
<h1>Redirecting...</h1>
<p>You should be redirected automatically to the target URL: <a href="/93bed45b-7b70-4097-9279-98a4aef0353e/c2">/93bed45b-7b70-4097-9279-98a4aef0353e/c2</a>. If not, click the link.
```

Add `-L` so `curl` will follow the redirect, and the server responds with the flag:

```sh
curl  https://chal.ctf.games:32032 --insecure -H 'GET / HTTP/1.1' \\
-H 'Host: 34.123.197.237:32032' \\
-H 'User-Agent: Mozilla/5.0 93bed45b-7b70-4097-9279-98a4aef0353e' \\
-H 'Accept: */*' -L
flag{redacted}
```
