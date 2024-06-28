---
title: "vlookup-hot-singles"
link: "#"
description: "looks like this is some kind of dating site for nerds? weird, figure out who the admin is and access their panel"
from: "jellyCTF"
date: "2024-06-24"
type: "ctf"
tags: ["web"]
---

# vlookup-hot-singles

This challenge is actually two challenges, but I've condensed it into the one writeup because the first one was stupid easy and
I kind of want to go over it for the sake of being thorough and complete.

<!-- <a href="##vlookup-hot-singles_(2)">jump to the second challenge</a> -->

## vlookup-hot-singles_(1)

<aside>
<a href="https://jellyc.tf/challenges#vlookup_hot_singles-8">vlookup-hot-singles 1 @ {from}</a><br/>
looks like this is some kind of dating site for nerds? weird, figure out who the admin is and access their panel.
</aside>

Presented with a challenge URL ('[https://vlookup-hot-singles.jellyc.tf/](https://vlookup-hot-singles.jellyc.tf/)') and a zip archive containing the
site's source code, we are shown a little Bootstrap template chat webapp:

![site-initial](/img/vlookup_hot_singles_img/site_init.png)

We know from the challenge description that we want to get to the `/admin` endpoint (a link to which is also the only interactive element on the page),
but we are forbade from accessing the endpoint without authentication:

![admin-endpoint](/img/vlookup_hot_singles_img/admin_endpoint_init.png)

A quick look at the source code not only tells us that proof of identity is supplied to the server via a JWT cookie, but also the secret used to sign
the token alongside the credentials we will need to supply (`user: starknight` -> `user: jelly`):

![source-jwt-endpoint-function](/img/vlookup_hot_singles_img/source_code_token.png)

We can now perform the painfully complicated task of dumping our `token` cookie into an [online JWT decoder like this one](https://token.dev/) so that we can
sign our modified token with the secret we saw in the server's source code (`singaQu5aeWoh1vuoJuD]ooJ9aeh2soh`):

![jwt-debug](/img/vlookup_hot_singles_img/jwt_decode.png)

We can then replace our issued token with the modified one and navigate to the `/admin` endpoint without issue, grasping the first `vlookup-hot-singles` challenge flag:

![authed-admin-endpoint](/img/vlookup_hot_singles_img/flag_one.png)

## vlookup-hot-singles_(2)
<aside>
<a href="https://jellyc.tf/challenges#vlookup_hot_singles-8">vlookup-hot-singles-2 @ {from}</a><br/>
oh. it's her. well, see if you can get the flag at /app/flag.txt and then get out of there
</aside>

I instantly jumped to the idea of a potential XXE injection vulnerability in this function given the prompt to upload a spreadsheet.
I think that it's best if we quickly test out the response we should expect given an unmodified/known-good `xlsx` file, which we can procure by downloading
a blank spreadsheet from Google Docs. Gauging the server's response:

![openoffice-location-recorded-xlsx](/img/vlookup_hot_singles_img/test_upload_blank.png)
> website output

... we can cross-reference this with the `/spreadsheet` route's source code:

```python
# ...

@app.route("/spreadsheet", methods=["POST"])
def spreadsheet():
    if not is_admin(request.cookies.get('token')):
        return "Unfromized"

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

# ...
```
> the `xlsx` handler code


The file we just downloaded is an edited spreadsheet with some additional columns appended to the end. There are also a few base cases that return us to `/admin`
if we don't supply a file or the file's name is empty.

![burp-output](/img/vlookup_hot_singles_img/burpsuite_post.png)
> the request in burpsuite, with the headers and data that Chrome automatically populates when we submit the form.

So my initial plan here seems reasonably straightfoward:
1. given that an `xlsx` is basically just a zip file, we inflate the spreadsheet to extract its internal XML files,
2. define a malcious entity and call it from an internal XML file that will be parsed by the server
3. re-compress the spreadsheet,
4. upload the spreadsheet, which will hopefully have the crafted content parsed by the `xlsx` parser
5. by parsing our entity, the server will write the content of the specified file back into the spreadsheet's internal XML,
6. maybe exfiltrate the flag in the returned `your_location_has_been_recorded.xlsx` sheet??

I initially opted for [this exotic `PayloadsAllTheThings` XXE payload](https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XXE%20Injection#xxe-inside-xlsx-file),
as it met my requirements almost exactly. With slight modifications to directly specify the file to include, we avoid having to deal
with `ngrok` + local fileservers and the headache that comes with facilitating remote callbacks over the open internet (plus, we don't care to be reading multiple files, just `flag.txt`).
We know the flag filepath is `/app/flag.txt` given the challenge's description (though this information is also in the `Dockerfile` in the situation that we weren't explicitly given this info).

We can unzip a `spreadsheet.xlsx` into a new directory using `7zip`; I copy the blank Google Sheets document to a payload file and extract its contents to `./XXE/`, placing the
payload below into `workbook.xml` (the `PayloadsAllTheThings` description indicates that `xml` parsers often touch either `workbook.xml` or `sharedStrings.xml`).

```bash
cp Untitled\ spreadsheet.xlsx spreadsheet.xlsx
7z x -oXXE spreadsheet.xlsx
cd XXE
```
> duplicate the blank spreadsheet, extract it to a new directory, and move into that directory

```xml
<!-- inside `workbook.xml` -->
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE cdl [<!ELEMENT cdl ANY ><!ENTITY asd SYSTEM "file:///app/flag.txt"> ]>
<cdl>&asd;</cdl>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
```
> the payload we will try


We can then edit in our payload in a text editor of your choosing (I use Neovim btw), and then update the original `spreadsheet.xlsx` archive with `7zip`:

```bash
7z u ../spreadsheet.xlsx *
```

Uploading this spreadsheet, we get a promising (but still broken) response, maybe indicating that we're on the right track:

![resulting-response-p1](/img/vlookup_hot_singles_img/werkzeug_debug.png)

When this didn't work as expected, I reset `workbook.xml` to its original state and tried a similar payload in `sharedStrings.xml`:
```xml
<!-- inside `sharedStrings.xml` -->
<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<!DOCTYPE cdl [<!ELEMENT t ANY ><!ENTITY asd SYSTEM "file:///app/flag.txt"> ]>
<sst xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" count="10" uniqueCount="10"><si><t>&asd;</t></si><si><t>testA2</t></si></sst>
```

This gave us the same result - apparently our injected entity didn't exist >:((

I'll spare the details of what I tried here, but over the course of a few days I
- tried changing where the entity was called from,
- where the entity was defined,
- the original remote DTD exfiltration method,
- posting XML directly from burpsuite,
- several other methods that have been wiped from my memory, possibly as a trauma response,

... But I was continually gated by `lxml`'s XML parser despite these changes. I had an _inkling_ that this could be due to where I acquired the initial `.xlsx`
(i.e, Google Sheets vs. Microsoft Office) and the possible format differentials between the two, but I kind of decided that this _surely_ isn't the case, so
I tried to see if I could find my way into the debug mode console.

![debugger](/img/vlookup_hot_singles_img/shit.png)

This was a rabbit hole that didn't yield a single meaningful result, so after a number of excruciating days and some rest, I turned to Google. According to [this report @ bugs.debian.org](https://bugs.debian.org/cgi-bin/bugreport.cgi?bug=854442),
the version of `openpyxl` (2.4.1) the server runs is definitely vulnerable external entity inclusion via the exact `file:///path/to/file` method we were trying,
but the MS Office `xlsx` format includes a `docProps` directory NOT present in the Google Sheets format.
The report seems to indicate that the `docProps/core.xml` file is pretty integral in getting `lxml` to actually parse our external entity:

![oh-mb](/img/vlookup_hot_singles_img/cve_payload.png)

Modifying this sheet to grab the file at `/app/flag.txt` instead, we can update our spreadsheet's payload and then uploading this to the server.

And we download the `your_location_has_been_recorded.xlsx`. Incredible.

![downloaded-file](/img/vlookup_hot_singles_img/payload_result.png)

We don't see a visible plaintext flag when we open the file normally, but this was kind of expected given where the entity is parsed. Extracting the spreadsheet and
opening `docProps/core.xml` again, we get our flag:

![oo-sheet-extracted](/img/vlookup_hot_singles_img/flag_two.png)

### addendum

thank you for reminding me that i hate microsoft and foster nothing but microsoft hate this is a microsoft hate writeup die die d
