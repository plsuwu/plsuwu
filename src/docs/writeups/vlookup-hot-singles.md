---
title: "vlookup-hot-singles"
link: "#"
description: "looks like this is some kind of dating site for nerds? weird, figure out who the admin is and access their panel"
author: "jellyCTF"
date: "2024-06-24"
published: true
area: "ctf"
tags: ["web"]
---

# vlookup-hot-singles

This challenge is actually two challenges, but I've condensed it into the one writeup because the first one was stupid easy but
it kind of feels like it has to be briefly explained for the sake of completeness.

<!-- <a href="##vlookup-hot-singles_(2)">jump to the second challenge</a> -->

## vlookup-hot-singles_(1)

<aside>
<a href="https://jellyc.tf/challenges#vlookup_hot_singles-8">vlookup-hot-singles 1 @ {author}</a><br/>
looks like this is some kind of dating site for nerds? weird, figure out who the admin is and access their panel.
</aside>

Presented with a challenge URL ('[https://vlookup-hot-singles.jellyc.tf/](https://vlookup-hot-singles.jellyc.tf/)') and a zip archive containing the site's source code, we are shown a little
Bootstrap template chat webapp:

![site-initial](/img/vlookup_hot_singles_img/site_init.png)

We know from the challenge description that we want to get to the `/admin` endpoint, but we are not allowed to do so without authentication:

![admin-endpoint](/img/vlookup_hot_singles_img/admin_endpoint_init.png)

A quick look at the source code not only tells us that proof of identity is supplied to the server via a JWT cookie, but also the secret to use alongside the credentials expected to access the
`/admin` endpoint:

![source-jwt-endpoint-function](/img/vlookup_hot_singles_img/source_code_token.png)

We can perform the trivial task of dumping our `token` cookie into an [online JWT decoder like this one](https://token.dev/) to
sign a modified with the secret (`singaQu5aeWoh1vuoJuD]ooJ9aeh2soh`) we saw in the server's source code:

![jwt-debug](/img/vlookup_hot_singles_img/jwt_decode.png)

Replacing our original token with the modified one, we can navigate to the `/admin` endpoint again for the first part of the challenge's flag:

![authed-admin-endpoint](/img/vlookup_hot_singles_img/flag_one.png)

## vlookup-hot-singles_(2)
<aside>
<a href="https://jellyc.tf/challenges#vlookup_hot_singles-8">vlookup-hot-singles-2 @ {author}</a><br/>
oh. it's her. well, see if you can get the flag at /app/flag.txt and then get out of there
</aside>

The functionality of above endpoint made me quickly jump to the idea of XXE injection, given the prompt for a spreadsheet.
We can quickly test out the response we should expect to see from the site if we provide a known-good `xlsx` sheet, which we can get easily by downloading
a blank spreadsheet from Google Docs and uploading it to gauge the server's response:

![openoffice-location-recorded-xlsx](/img/vlookup_hot_singles_img/test_upload_blank.png)
> website output...


Based on the above response and source code, the file we download is an edited spreadsheet with some additional columns appended to the end. There are also a few base cases that return us to the `/admin`
endpoint if we don't supply a file or the file doesn't have a filename:

```python
@app.route("/spreadsheet", methods=["POST"])
def spreadsheet():
    if not is_admin(request.cookies.get('token')):
        return "Unauthorized"

    if "file" not in request.files:
        return redirect(url_for("admin"))

    file = request.files["file"]
    if file.filename == "":
        return redirect(url_for("admin"))

    if file:
        wb = load_workbook(filename=file)
        ws = wb.active
        ws.append(["Username", "Email", "Socials", "Real Name", "Age", "Height", "Country", "MBTI", "Job", "Income", "Relationship status", "Favorite Sanrio Character", "Favorite Minecraft Version"])
        resp_sheet = BytesIO()
        wb.save(resp_sheet)
        resp_sheet.seek(0)
        return send_file(
            resp_sheet,
            download_name="your_location_has_been_recorded.xlsx",
            as_attachment=True,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            )
```
> ...and the server `xlsx` handler code.

![burp-output](/img/vlookup_hot_singles_img/burpsuite_post.png)
> the request in burpsuite, with the headers and data that Chrome automatically populates.

Given the above request snippet with the burpsuite output, we need to make a POST request with a non-empty file and non-empty filename in order to trigger the part of this function that actually processes
the XML data. Given this, we might be able to craft an `xlsx` file that contains an entity that calls a system function to read the contents of a file and place that text back into the element containing that entity.

I initially tried [this PayloadsAllTheThings XXE payload](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XXE%20Injection#xxe-inside-xlsx-file) with a slight modifcation to
avoid having to start `ngrok` + fileservers to facilitate the remote machine reaching out to fetch the malicious DTD. We know the flag filepath is `/app/flag.txt` given the challenge's description, though
this information is also in the `Dockerfile` in the situation that we weren't explicitly given this info.

```xml
<!-- inside `workbook.xml` -->
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE cdl [<!ELEMENT cdl ANY ><!ENTITY asd SYSTEM "file:///app/flag.txt"> ]>
<cdl>&asd;</cdl>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
```

We can unzip a `spreadsheet.xlsx` into a new directory using `7zip`; I copy the blank Google Sheets document to a payload file and extract its contents to `./XXE/`:
```bash
cp Untitled\ spreadsheet.xlsx spreadsheet.xlsx
7z x -oXXE spreadsheet.xlsx
cd XXE
```

We can then edit the data in some kind of editor (the payload above indicates that we will have the best results with either `workbook.xml` or `sharedStrings.xml`),
and then update the original `spreadsheet.xlsx` archive:

```bash
7z u ../spreadsheet.xlsx *
```

Uploading this spreadsheet, we get a promising (but broken) response, maybe indicating that we're on the right track:

![resulting-response-p1](/img/vlookup_hot_singles_img/werkzeug_debug.png)

When this didn't work as expected, I tried a similar payload inside `sharedStrings.xml`:
```xml
<!-- inside `sharedStrings.xml` -->
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE cdl [<!ELEMENT t ANY ><!ENTITY asd SYSTEM "file:///app/flag.txt"> ]>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="10" uniqueCount="10"><si><t>&asd;</t></si><si><t>testA2</t></si></sst>
```

This gave us the same result, indicating that our injected entity didn't exist.

I'll spare exact descriptions of what I tried here (which included where I called the entity from, where I defined the entity, remote DTD exfiltration, posting XML directly, and probably more), but
I was continually gated by `lxml`'s XML parser despite any changes I would make to the way in which I called the entity or which `xml` doc I included the payload in. I had an _inkling_ that this could be
due to where I acquired the initial `.xlsx` (i.e, Google Sheets vs. Microsoft Office) and the possible format differentials between the two, but I kind of decided on metagaming - "_surely_ this would be
doable for those without access to Micros*ft Office", I thought to myself (I use Arch btw) - so I tried to see if I could find my way into the debug mode console.

![debugger](/img/vlookup_hot_singles_img/shit.png)

This was a rabbit hole that didn't really yield any meaningful results, so after a number of excruciating hours I turned to Google. According to [this report @ bugs.debian.org](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=854442),
this version of `openpyxl` (2.4.1) was definitely vulnerable external entity inclusion via this `file:///path/to/file` method, but the MS Office `xlsx` format includes this `docProps` directory, with our
example payload including its injected entity in `docProps/core.xml`:

![oh-mb](/img/vlookup_hot_singles_img/cve_payload.png)

Modifying this to use `file:///app/flag.txt`, updating the spreadsheet's payload with `7z u ../blank_password.xlsx *`, and then uploading this to the server downloads the `your_location_has_been_recorded.xlsx`:

![downloaded-file](/img/vlookup_hot_singles_img/payload_result.png)

We don't see a visible plaintext flag when we open the file normally, but once extracted we can open `docProps/core.xml` to find our flag:

![oo-sheet-extracted](/img/vlookup_hot_singles_img/flag_two.png)


Ultimately: thank you `lxml` for reminding me that I hate microsoft and foster nothing but microsoft hate this is a microsoft hate writeup die

