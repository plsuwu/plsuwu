import { c as create_ssr_component } from "./ssr.js";
const metadata = {
  "title": "Tragedy Redux",
  "description": "We found this file as part of an attack chain that seemed to manipulate file contents to stage a payload. Can you make any sense of it?",
  "author": "huntress",
  "date": "2023-10-16",
  "published": true
};
const Tragedy_redux = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-1m3t94e">Tragedy Redux</h1> <aside data-svelte-h="svelte-1pa12vn">👻 We found this file as part of an attack chain that seemed to manipulate file contents to stage a payload. Can you make any sense of it?</aside> <p data-svelte-h="svelte-1ypp1vx">Unzipping the challenge, we are given a single file - running <code>file tragedy_redux</code> on this indicates that it’s a Zip archive:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">$ <span class="token function">ls</span> <span class="token parameter variable">-la</span>
total <span class="token number">56</span>
drwxr-xr-x  <span class="token number">2</span> pls pls  <span class="token number">4096</span> Oct <span class="token number">16</span> <span class="token number">20</span>:00 <span class="token builtin class-name">.</span>
drwxr-xr-x <span class="token number">18</span> pls pls  <span class="token number">4096</span> Oct <span class="token number">16</span> <span class="token number">19</span>:59 <span class="token punctuation">..</span>
-rw-------  <span class="token number">1</span> pls pls <span class="token number">24518</span> Oct <span class="token number">15</span> <span class="token number">23</span>:29 tragedy_redux
-rwxr-xr-x  <span class="token number">1</span> pls pls <span class="token number">21810</span> Oct <span class="token number">16</span> <span class="token number">19</span>:59 tragedy_redux.7z

$ <span class="token function">file</span> tragedy_redux
tragedy_redux: Zip archive data, made by v4.5, extract using at least v2.0, last modified, last modified Sun, Jan 01 <span class="token number">1980</span> 00:00:00, uncompressed size <span class="token number">1453</span>, <span class="token assign-left variable">method</span><span class="token operator">=</span>deflate</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-5y64iy">Extracting the contents, we are given some <code>XML</code> documents and a handful of references to Microsoft Word and Visual Basic:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">$ <span class="token function">unzip</span> tragedy_redux
Archive:  tragedy_redux
<span class="token function">file</span> <span class="token comment">#1:  bad zipfile offset (local header sig):  0</span>
  inflating: _rels/.rels
  inflating: word/document.xml
  inflating: word/_rels/document.xml.rels
  inflating: word/vbaProject.bin
  inflating: word/theme/theme1.xml
  inflating: word/_rels/vbaProject.bin.rels
  inflating: word/vbaData.xml
  inflating: word/settings.xml
  inflating: word/styles.xml
  inflating: word/webSettings.xml
  inflating: word/fontTable.xml
  inflating: docProps/core.xml
  inflating: docProps/app.xml</code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-1o1cbsg">My assumption here is that this is a VBA Macro for Word, though loading this into Word’s VB editor throws an error, and loading <code>word/vbaProject.bin</code> by itself yields bad UTF-8 characters and the script cannot be run.</p> <p data-svelte-h="svelte-1rbs7nu"><img src="/img/tragedy_redux_img/Untitled.png" alt="Untitled"></p> <p data-svelte-h="svelte-ooin1a"><img src="/img/tragedy_redux_img/Untitled%201.png" alt="Untitled"></p> <p data-svelte-h="svelte-38tv3n">The right hand side contains what seems like a file header - <code>ÐÏà¡±á</code>. This is the <a href="https://sceweb.sce.uhcl.edu/abeysekera/itec3831/labs/FILE%20SIGNATURES%20TABLE.pdf" rel="nofollow">mangled hex file header for Object Linking and Embedding (OLE) Compound Files</a>. There are also numerous references to the <code>OLE</code> file format scattered throughout the compiled <code>tragedy_redux</code> code - now under the assumption that this script has been compiled or something, a quick Google search returns a <a href="https://fishtech.group/cybersecurity/extracting-and-analyzing-malicious-word-macros-for-threat-hunting/" rel="nofollow">method to extract and analyze the script’s contents</a> using <a href="https://blog.didierstevens.com/programs/oledump-py/" rel="nofollow">OLEDump.py.</a></p> <p data-svelte-h="svelte-1rl83rc">Downloading OLEDump.py’s Zip archive, extracting it, and then running it on <code>vbaProject.bin</code> yields the following output:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">$ python <span class="token punctuation">..</span>/oledump.py vbaProject.bin
  <span class="token number">1</span>:       <span class="token number">410</span> <span class="token string">'PROJECT'</span>
  <span class="token number">2</span>:        <span class="token number">71</span> <span class="token string">'PROJECTwm'</span>
  <span class="token number">3</span>: M    <span class="token number">6164</span> <span class="token string">'VBA/NewMacros'</span>
  <span class="token number">4</span>: m     <span class="token number">954</span> <span class="token string">'VBA/ThisDocument'</span>
  <span class="token number">5</span>:      <span class="token number">3067</span> <span class="token string">'VBA/_VBA_PROJECT'</span>
  <span class="token number">6</span>:      <span class="token number">3003</span> <span class="token string">'VBA/__SRP_0'</span>
  <span class="token number">7</span>:       <span class="token number">226</span> <span class="token string">'VBA/__SRP_1'</span>
  <span class="token number">8</span>:      <span class="token number">2334</span> <span class="token string">'VBA/__SRP_2'</span>
  <span class="token number">9</span>:       <span class="token number">526</span> <span class="token string">'VBA/__SRP_3'</span>
 <span class="token number">10</span>:       <span class="token number">571</span> <span class="token string">'VBA/dir'</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-15xslbu">Files containing VBA macros are shown through the <code>M</code> flag in the above output; we can run OLEDump.py with the <code>-s &lt;stream-no.&gt;</code>  argument against <code>vbaProject.bin</code>, which must be identified with the <code>-v</code> argument here to decompress the macro - otherwise we get raw hex content. I’m going to also pipe the output to <code>tee</code> and write it to a file so I can open it in an IDE:</p> <pre class="language-visual-basic"><!-- HTML_TAG_START -->${`<code class="language-visual-basic"><span class="token operator">$</span> python <span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token operator">/</span>oledump<span class="token punctuation">.</span>py <span class="token operator">-</span>s <span class="token number">3</span> <span class="token operator">-</span>v vbaProject<span class="token punctuation">.</span>bin | tee vbaDecomp<span class="token punctuation">.</span>txt
Attribute VB_Name <span class="token operator">=</span> <span class="token string">"NewMacros"</span>
<span class="token keyword">Function</span> Pears<span class="token punctuation">(</span>Beets<span class="token punctuation">)</span>
    Pears <span class="token operator">=</span> Chr<span class="token punctuation">(</span>Beets <span class="token operator">-</span> <span class="token number">17</span><span class="token punctuation">)</span>
<span class="token keyword">End</span> <span class="token keyword">Function</span>

<span class="token keyword">Function</span> Strawberries<span class="token punctuation">(</span>Grapes<span class="token punctuation">)</span>
    Strawberries <span class="token operator">=</span> Left<span class="token punctuation">(</span>Grapes<span class="token punctuation">,</span> <span class="token number">3</span><span class="token punctuation">)</span>
<span class="token keyword">End</span> <span class="token keyword">Function</span>

<span class="token keyword">Function</span> Almonds<span class="token punctuation">(</span>Jelly<span class="token punctuation">)</span>
    Almonds <span class="token operator">=</span> Right<span class="token punctuation">(</span>Jelly<span class="token punctuation">,</span> Len<span class="token punctuation">(</span>Jelly<span class="token punctuation">)</span> <span class="token operator">-</span> <span class="token number">3</span><span class="token punctuation">)</span>
<span class="token keyword">End</span> <span class="token keyword">Function</span>

<span class="token keyword">Function</span> Nuts<span class="token punctuation">(</span>Milk<span class="token punctuation">)</span>
    <span class="token keyword">Do</span>
    OatMilk <span class="token operator">=</span> OatMilk <span class="token operator">+</span> Pears<span class="token punctuation">(</span>Strawberries<span class="token punctuation">(</span>Milk<span class="token punctuation">)</span><span class="token punctuation">)</span>
    Milk <span class="token operator">=</span> Almonds<span class="token punctuation">(</span>Milk<span class="token punctuation">)</span>
    <span class="token keyword">Loop</span> <span class="token keyword">While</span> Len<span class="token punctuation">(</span>Milk<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span>
    Nuts <span class="token operator">=</span> OatMilk
<span class="token keyword">End</span> <span class="token keyword">Function</span>

<span class="token keyword">Function</span> Bears<span class="token punctuation">(</span>Cows<span class="token punctuation">)</span>
    Bears <span class="token operator">=</span> StrReverse<span class="token punctuation">(</span>Cows<span class="token punctuation">)</span>
<span class="token keyword">End</span> <span class="token keyword">Function</span>

<span class="token keyword">Function</span> Tragedy<span class="token punctuation">(</span><span class="token punctuation">)</span>

    <span class="token keyword">Dim</span> Apples <span class="token keyword">As</span> <span class="token keyword">String</span>
    <span class="token keyword">Dim</span> Water <span class="token keyword">As</span> <span class="token keyword">String</span>

    <span class="token keyword">If</span> ActiveDocument<span class="token punctuation">.</span>Name <span class="token operator">&lt;</span><span class="token operator">></span> Nuts<span class="token punctuation">(</span><span class="token string">"131134127127118131063117128116"</span><span class="token punctuation">)</span> <span class="token keyword">Then</span>
        <span class="token keyword">Exit</span> <span class="token keyword">Function</span>
    <span class="token keyword">End</span> <span class="token keyword">If</span>

    Apples <span class="token operator">=</span> <span class="token string">"1291281361181311321211181251250490621181271160490910881071321061041160... # and so on
    Water = Nuts(Apples)

    GetObject(Nuts("</span><span class="token number">136122127126120126133132075</span><span class="token string">")).Get(Nuts("</span><span class="token number">104122127068067112097131128116118132132</span>"<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">.</span>Create Water<span class="token punctuation">,</span> Tea<span class="token punctuation">,</span> Coffee<span class="token punctuation">,</span> Napkin

<span class="token keyword">End</span> <span class="token keyword">Function</span>

<span class="token keyword">Sub</span> AutoOpen<span class="token punctuation">(</span><span class="token punctuation">)</span>
    Tragedy
<span class="token keyword">End</span> <span class="token keyword">Sub</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-3v0wbp">Visual Basic looks insane and confusing, but the functions here are (reasonably) simple:</p> <ul data-svelte-h="svelte-hpd6dp"><li><code>Pears(Beets)</code> takes a number as an argument, subtracts 17, and returns the corresponding ASCII character.</li> <li><code>Strawberries(Grapes)</code> takes a string and returns <em>only</em> its first 3 characters</li> <li><code>Almonds(Jelly)</code> takes a string and returns everything <em>except</em> its first 3 characters</li> <li><code>Nuts(Milk)</code> loops through a string in 3-character sections, subtracts 17 from the ASCII value of each character, and then concatenates them together.</li> <li><code>Bears(Cows)</code> accepts a string and returns it in reverse</li></ul> <p data-svelte-h="svelte-388t3n">Ultimately, the program here is using the number strings to perform a series of decryptions. <code>Tea</code>, <code>Coffee</code>and <code>Napkin</code> aren’t instantiated in this section of the script, but even after removing these I found myself unable to get this to run as a Visual Basic script, so I instead converted the script to python:</p> <pre class="language-python"><!-- HTML_TAG_START -->${`<code class="language-python"><span class="token keyword">def</span> <span class="token function">pears</span><span class="token punctuation">(</span>beets<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> <span class="token builtin">chr</span><span class="token punctuation">(</span>beets <span class="token operator">-</span> <span class="token number">17</span><span class="token punctuation">)</span>

<span class="token keyword">def</span> <span class="token function">strawberries</span><span class="token punctuation">(</span>grapes<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> grapes<span class="token punctuation">[</span><span class="token punctuation">:</span><span class="token number">3</span><span class="token punctuation">]</span>

<span class="token keyword">def</span> <span class="token function">almonds</span><span class="token punctuation">(</span>jelly<span class="token punctuation">)</span><span class="token punctuation">:</span>
    <span class="token keyword">return</span> jelly<span class="token punctuation">[</span><span class="token number">3</span><span class="token punctuation">:</span><span class="token punctuation">]</span>

<span class="token keyword">def</span> <span class="token function">nuts</span><span class="token punctuation">(</span>milk<span class="token punctuation">)</span><span class="token punctuation">:</span>
    oat_milk <span class="token operator">=</span> <span class="token string">""</span>
    <span class="token keyword">while</span> <span class="token builtin">len</span><span class="token punctuation">(</span>milk<span class="token punctuation">)</span> <span class="token operator">></span> <span class="token number">0</span><span class="token punctuation">:</span>
        oat_milk <span class="token operator">+=</span> pears<span class="token punctuation">(</span><span class="token builtin">int</span><span class="token punctuation">(</span>strawberries<span class="token punctuation">(</span>milk<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        milk <span class="token operator">=</span> almonds<span class="token punctuation">(</span>milk<span class="token punctuation">)</span>
    <span class="token keyword">return</span> oat_milk

<span class="token comment"># the other strings didn't deobfuscate into anything particularly useful</span>
apples <span class="token operator">=</span> <span class="token string">"1291281361181311321211181251250490621181271160490910881071321061041160740901261..."</span> <span class="token comment"># u get the picture</span>
<span class="token keyword">print</span><span class="token punctuation">(</span>nuts<span class="token punctuation">(</span>apples<span class="token punctuation">)</span><span class="token punctuation">)</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-gyh4p6">The script here converts the <code>apples</code> string into <code>powershell -enc JGZsYWc9ImZsYWd7NjNkY2M4MmMzMDE5Nzc2OGY0ZDQ1OGRhMTJmNjE4YmN9Ig==</code>; decoding the base64 portion of this output gives us the flag:</p> <pre class="language-bash"><!-- HTML_TAG_START -->${`<code class="language-bash">$ <span class="token builtin class-name">echo</span> <span class="token string">'JGZsYWc9ImZsYWd7NjNkY2M4MmMzMDE5Nzc2OGY0ZDQ1OGRhMTJmNjE4YmN9Ig=='</span> <span class="token operator">|</span> base64 <span class="token parameter variable">-d</span>
<span class="token variable">$flag</span><span class="token operator">=</span><span class="token string">"flag&#123;6******************************c&#125;"</span></code>`}<!-- HTML_TAG_END --></pre>`;
});
export {
  Tragedy_redux as default,
  metadata
};
