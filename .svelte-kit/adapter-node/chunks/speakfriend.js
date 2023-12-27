import { c as create_ssr_component } from "./ssr.js";
const metadata = {
  "title": "Speakfriend",
  "description": "It seems like this website was compromised. We found this file that seems to be related... can you make any sense of these and uncover a flag?",
  "author": "huntress",
  "date": "2023-10-21",
  "published": true
};
const Speakfriend = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-116xnk4">Speakfriend</h1> <aside data-svelte-h="svelte-p77bc">👻 It seems like this website was compromised. We found this file that seems to be related... can you make any sense of these and uncover a flag?</aside> <p data-svelte-h="svelte-1bbeyo3">We are given a <code>main.7z</code> and a URL to a webpage, though I suspect there is nothing surface-level to see here - a cursory glance through the source and various pages indicates that this assumption is <em>probably</em> correct.</p> <p data-svelte-h="svelte-1b97jn1"><img src="/img/speakfriend_img/Untitled.png" alt="Standard Bootstrap template stuff"></p> <p data-svelte-h="svelte-1rstr9p">Standard Bootstrap template stuff</p> <pre class="language-html"><!-- HTML_TAG_START -->${`<code class="language-html">$ curl --insecure 'https://chal.ctf.games:32032'
<span class="token doctype"><span class="token punctuation">&lt;!</span><span class="token doctype-tag">DOCTYPE</span> <span class="token name">html</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>html</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>head</span><span class="token punctuation">></span></span>
  <span class="token comment">&lt;!-- Basic --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">charset</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>utf-8<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">http-equiv</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>X-UA-Compatible<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>IE=edge<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token comment">&lt;!-- Mobile Metas --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>viewport<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>width=device-width, initial-scale=1, shrink-to-fit=no<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token comment">&lt;!-- Site Metas --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>keywords<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>description<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>meta</span> <span class="token attr-name">name</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>author<span class="token punctuation">"</span></span> <span class="token attr-name">content</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span><span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>shortcut icon<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/static/images/favicon.png<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>image/x-icon<span class="token punctuation">"</span></span><span class="token punctuation">></span></span>

  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>title</span><span class="token punctuation">></span></span>Guarder<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>title</span><span class="token punctuation">></span></span>

  <span class="token comment">&lt;!-- bootstrap core css --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token attr-name">type</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>text/css<span class="token punctuation">"</span></span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/static/css/bootstrap.css<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>

  <span class="token comment">&lt;!-- fonts style --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>https://fonts.googleapis.com/css?family=Open+Sans:400,700|Poppins:400,6&amp;di ... <span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>

  <span class="token comment">&lt;!-- Custom styles for this template --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/static/css/style.css<span class="token punctuation">"</span></span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>
  <span class="token comment">&lt;!-- responsive style --></span>
  <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>link</span> <span class="token attr-name">href</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>/static/css/responsive.css<span class="token punctuation">"</span></span> <span class="token attr-name">rel</span><span class="token attr-value"><span class="token punctuation attr-equals">=</span><span class="token punctuation">"</span>stylesheet<span class="token punctuation">"</span></span> <span class="token punctuation">/></span></span>

 <span class="token comment">&lt;!-- ...etc .... --></span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-va09oj">Extracting the <code>7z</code> archive, we can run some basic file identification with <code>file</code> / <code>strings</code> / <code>objdump</code> commands:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">$ <span class="token function">file</span> main
main: ELF <span class="token number">64</span>-bit LSB pie executable, x86-64, version <span class="token number">1</span> <span class="token punctuation">(</span>SYSV<span class="token punctuation">)</span>, dynamically linked, interpreter /lib64/ld-linux-x86-64.so.2, <span class="token punctuation"></span><span class="token punctuation"></span>
BuildID<span class="token punctuation">[</span>sha1<span class="token punctuation">]</span><span class="token operator">=</span>f020f8b12bc1a0b0f3122413b698344bfbfd1d9d, <span class="token keyword">for</span> GNU/Linux <span class="token number">3.2</span>.0, not stripped

$ strings main
/lib64/ld-linux-x86-64.so.2
libcurl-gnutls.so.4
__gmon_start__
<span class="token comment"># ...</span>
curl_easy_cleanup
curl_easy_init
curl_easy_setopt
curl_easy_perform
curl_global_init
libc.so.6
<span class="token comment"># ...</span>
Mozilla/H
<span class="token number">5.0</span> 93beH
d45b-7b7H
<span class="token number">0</span>-4097-9H
<span class="token number">279</span>-98a4H
aef0353eH
<span class="token punctuation">[</span><span class="token punctuation">]</span>A<span class="token punctuation"></span><span class="token punctuation"></span>A<span class="token punctuation">]</span>A^A_
%s:%s
:*3$"
GCC: <span class="token punctuation">(</span>Ubuntu <span class="token number">9.4</span>.0-1ubuntu1~20.04.1<span class="token punctuation">)</span> <span class="token number">9.4</span>.0
crtstuff.c
<span class="token comment"># ...</span>
_curl_easy_setopt_err_long
_curl_easy_setopt_err_curl_off_t
_curl_easy_setopt_err_string
_curl_easy_setopt_err_write_callback
_curl_easy_setopt_err_resolver_start_callback
_curl_easy_setopt_err_read_cb
_curl_easy_setopt_err_ioctl_cb
_curl_easy_setopt_err_sockopt_cb
<span class="token comment"># ... etc</span>

$ objdump <span class="token parameter variable">-s</span> ./main

./main:     <span class="token function">file</span> <span class="token function">format</span> elf64-x86-64

Contents of section .dynstr:
 0560 006c6962 6375726c 2d676e75 746c732e  .libcurl-gnutls.
 0570 736f2e34 005f5f67 6d6f6e5f <span class="token number">73746172</span>  so.4.__gmon_star
 0580 745f5f00 5f49544d 5f646572 <span class="token number">65676973</span>  t__._ITM_deregis
 0590 <span class="token number">74657254</span> 4d436c6f 6e655461 626c6500  terTMCloneTable.
 05a0 5f49544d 5f726567 <span class="token number">69737465</span> 72544d43  _ITM_registerTMC
 05b0 6c6f6e65 5461626c <span class="token number">65006375</span> 726c5f65  loneTable.curl_e
<span class="token comment"># ...</span>
 0680 322e322e <span class="token number">35004355</span> 524c5f47 4e55544c  <span class="token number">2.2</span>.5.CURL_GNUTL             <span class="token comment"># -- interesting!</span>
 0690 535f3300                             S_3.
<span class="token comment"># ...</span>
<span class="token number">1480</span> <span class="token number">48898530</span> feffff48 b84d6f7a 696c6c61  H<span class="token punctuation">..</span><span class="token number">0</span><span class="token punctuation">..</span>.H.Mozilla
 <span class="token number">1490</span> 2f48ba35 2e302039 <span class="token number">33626548</span> 898540fe  /H.5.0 93beH<span class="token punctuation">..</span>@.
 14a0 ffff4889 9548feff ff48b864 3435622d  <span class="token punctuation">..</span>H<span class="token punctuation">..</span>H<span class="token punctuation">..</span>.H.d45b-
 14b0 <span class="token number">37623748</span> ba302d34 3039372d <span class="token number">39488985</span>  7b7H.0-4097-9H<span class="token punctuation">..</span>
 14c0 50feffff <span class="token number">48899558</span> feffff48 b8323739  P<span class="token punctuation">..</span>.H<span class="token punctuation">..</span>X<span class="token punctuation">..</span>.H.279
 14d0 2d393861 3448ba61 <span class="token number">65663033</span> <span class="token number">35336548</span>  <span class="token parameter variable">-98a4H.aef0353eH</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-1udcm6y">Notable are the <code>curl</code> and <code>Mozilla</code> strings - the <code>H</code> strings might also refer to <code>curl</code>’s <code>-H</code> header argument - so it could be making some kind of request with <code>curl</code>, and pretending to be a Firefox client or something?</p> <p data-svelte-h="svelte-kpggr7">Lets just run the binary:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">pls@RUBY~$ ./main

pls@RUBY~$</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-1p4pqdb">That didn’t do anything lol.</p> <p data-svelte-h="svelte-imz4ad">We could try passing some arguments to it, like <code>-h</code>, to see if it has a <code>help</code> command. This seems to make the program to hang; I have to <code>ctrl+c</code> out of it.</p> <p data-svelte-h="svelte-xhq37h"><img src="/img/speakfriend_img/Untitled%201.png" alt="Untitled"></p> <p data-svelte-h="svelte-mh1ao9">This is pretty interesting - this is a little hard to visualize, but the binary stays running, so it seems to be doing something, though silently. Considering it seems to include <code>curl</code>, and may want to try connecting to an endpoint, lets see whether its producing any network activity with <code>Wireshark</code>:</p> <p data-svelte-h="svelte-17uzfew"><img src="/img/speakfriend_img/Untitled%202.png" alt="Untitled"></p> <p data-svelte-h="svelte-294qk5">It’s a little tough to say exactly what is what traffic is outbound from what application - running some of these through Shodan returned pretty inconclusive results. Also, the challenge uses TLS, so it’s possible for basically any of these to be relevant. Turning on hostnames was also pretty unhelpful. Really should setup a proper lab after this….</p> <p data-svelte-h="svelte-1b94355">So, instead, why don’t we try running a specific IP through it and see if it kind of just functions like <code>curl</code>? We can grab the IP of our machine just with the Network tab of Chrome’s Dev Tools, and throw it in as an argument to see if the binary produces any network activity to this IP in Wireshark:</p> <p data-svelte-h="svelte-192t0bn"><img src="/img/speakfriend_img/Untitled%203.png" alt="Untitled"></p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">pls@RUBY~$ ./main <span class="token number">34.123</span>.197.237:32032
<span class="token comment"># ...</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-ewttf5">It seems like we make a non-TLS request to the server, which, upon inspection, has been made with some suspicious looking headers:</p> <p data-svelte-h="svelte-1itsbji"><img src="/img/speakfriend_img/Untitled%204.png" alt="Untitled"></p> <p data-svelte-h="svelte-3muefl"><img src="/img/speakfriend_img/Untitled%205.png" alt="Untitled"></p> <p data-svelte-h="svelte-1447tmm">Let’s use those in our own curl request and see what happens:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">pls@RUBY~$ <span class="token function">curl</span> <span class="token number">34.123</span>.197.237:32032 <span class="token parameter variable">-H</span> <span class="token string">'GET / HTTP/1.1'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'Host: 34.123.197.237:32032'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'User-Agent: Mozilla/5.0 93bed45b-7b70-4097-9279-98a4aef0353e'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'Accept: */*'</span>
curl: <span class="token punctuation">(</span><span class="token number">56</span><span class="token punctuation">)</span> Recv failure: Connection reset by peer</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-b62zcy">Ok, instead of the IP, let’s try making that request to the URL (using the <code>--insecure</code> arg to direct <code>curl</code> to disregard certificate validity):</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash"><span class="token function">curl</span> https://chal.ctf.games:32032 <span class="token parameter variable">--insecure</span> <span class="token parameter variable">-H</span> <span class="token string">'GET / HTTP/1.1'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'Host: 34.123.197.237:32032'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'User-Agent: Mozilla/5.0 93bed45b-7b70-4097-9279-98a4aef0353e'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'Accept: */*'</span>
<span class="token operator">&lt;</span><span class="token operator">!</span>doctype html<span class="token operator">></span>
<span class="token operator">&lt;</span>html <span class="token assign-left variable">lang</span><span class="token operator">=</span>en<span class="token operator">></span>
<span class="token operator">&lt;</span>title<span class="token operator">></span>Redirecting<span class="token punctuation">..</span>.<span class="token operator">&lt;</span>/title<span class="token operator">></span>
<span class="token operator">&lt;</span>h<span class="token operator"><span class="token file-descriptor important">1</span>></span>Redirecting<span class="token punctuation">..</span>.<span class="token operator">&lt;</span>/h<span class="token operator"><span class="token file-descriptor important">1</span>></span>
<span class="token operator">&lt;</span>p<span class="token operator">></span>You should be redirected automatically to the target URL: <span class="token operator">&lt;</span>a <span class="token assign-left variable">href</span><span class="token operator">=</span><span class="token string">"/93bed45b-7b70-4097-9279-98a4aef0353e/c2"</span><span class="token operator">></span>/93bed45b-7b70-4097-9279-98a4aef0353e/c<span class="token operator"><span class="token file-descriptor important">2</span>&lt;</span>/a<span class="token operator">></span>. If not, click the link.</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-1hptkll">Add <code>-L</code> so <code>curl</code> will follow the redirect and we’re done:</p> <pre class="language-sh"><!-- HTML_TAG_START -->${`<code class="language-sh"><span class="token function">curl</span>  https://chal.ctf.games:32032 <span class="token parameter variable">--insecure</span> <span class="token parameter variable">-H</span> <span class="token string">'GET / HTTP/1.1'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'Host: 34.123.197.237:32032'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'User-Agent: Mozilla/5.0 93bed45b-7b70-4097-9279-98a4aef0353e'</span> <span class="token punctuation"></span><span class="token punctuation"></span>
<span class="token parameter variable">-H</span> <span class="token string">'Accept: */*'</span> <span class="token parameter variable">-L</span>
flag<span class="token punctuation">&#123;</span><span class="token number">3</span>******************************0<span class="token punctuation">&#125;</span></code>`}<!-- HTML_TAG_END --></pre>`;
});
export {
  Speakfriend as default,
  metadata
};
