import { c as create_ssr_component } from "./ssr.js";
const metadata = {
  "title": "Rock, Paper, Psychic",
  "description": "Wanna play a game of rock, paper, scissors against a computer that can read your mind? Sounds fun, right?",
  "author": "huntress",
  "date": "2023-10-16",
  "published": true
};
const Rock_paper_psychic = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<h1 data-svelte-h="svelte-cbcfwk">Rock, Paper, Psychic</h1> <aside data-svelte-h="svelte-rff3uz">👻 Wanna play a game of rock, paper, scissors against a computer that can read your mind? Sounds fun, right?</aside> <p data-svelte-h="svelte-9qkt7x">We are presented with a <code>.7z</code> file containing an<code>.exe</code> binary. After extracting, I tried a few simple classics (buffer overflow/format string stuff) - though nothing wound up sticking.</p> <p data-svelte-h="svelte-5udlac">Loading the binary into IDA, we are able to perform a quick search for the term <code>flag</code> and make a quick note of any functions or subroutines:</p> <p data-svelte-h="svelte-1wnogtr"><img src="/img/rock_paper_psychic_img/Untitled.png" alt="Interesting functions"></p> <p data-svelte-h="svelte-ii144j">Interesting functions</p> <p data-svelte-h="svelte-dnryvy">Checking out our <code>printFlag</code> function, I’m not <em>entirely</em> sure what’s going on here (on account of the weird Nim machine code), but we can glean a bit of info regardless:</p> <ul data-svelte-h="svelte-blemeo"><li>The program seems to have been written in Nim,</li> <li>The binary uses this function when a player wins to load a memory address (represented by the variable <code>TM__V45tF8B8NBcxFcjfe7lhBw_38</code>, which contains a string) into <code>$rcx</code> before running a <code>copyString</code> function on it<ul><li>This operation is run a second time, though on a different address (the string at <code>TM__V45tF8B8NBcxFcjfe7lhBw_39</code>).</li></ul></li> <li>The <code>fromRC4</code> function seems to be the recipient of these strings - my assumption is that we’re deciphering RC4-encrypted text, which will probably hold our flag.</li></ul> <p data-svelte-h="svelte-2dr4fr"><img src="/img/rock_paper_psychic_img/Untitled%201.png" alt="IDA graph view"></p> <p data-svelte-h="svelte-qzoedj">IDA graph view</p> <p data-svelte-h="svelte-13cg4g5"><img src="/img/rock_paper_psychic_img/Untitled%202.png" alt="Text view"></p> <p data-svelte-h="svelte-109i36g">Text view</p> <p data-svelte-h="svelte-1f3ev6v">The addresses of <code>TM__V45tF8B8NBcxFcjfe7lhBw_38</code> &amp; <code>TM__V45tF8B8NBcxFcjfe7lhBw_39</code> point to sequential sections in <code>.rdata</code>, and contain the following values respectively (note that each byte uses one <code>.rdata</code> address, so these were technically not represented like this in memory, though this is what we want to use for decryption):</p> <pre class="language-nasm"><!-- HTML_TAG_START -->${`<code class="language-nasm"><span class="token label function">.rdata:</span>000000000041D9E0 TM__V45tF8B8NBcxFcjfe7lhBw_39 db  <span class="token number">4Ch</span> <span class="token comment">; L</span>
<span class="token label function">.rdata:</span>000000000041D9E0                                         <span class="token comment">; DATA XREF: printFlag__main_6+14↑o</span>
<span class="token label function">.rdata:</span>000000000041D9E1                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E2                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E3                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E4                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E5                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E6                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E7                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9E8                 db  <span class="token number">4Ch</span> <span class="token comment">; L</span>
<span class="token label function">.rdata:</span>000000000041D9E9                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9EA                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9EB                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9EC                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9ED                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9EE                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041D9EF                 db  <span class="token number">40h</span> <span class="token comment">; @D1E2A0D9FA89CABED207EDF4F55C688E04EBE20F077351BDAA1E110D5A74805C916AF12F054C</span>
<span class="token label function">.rdata:</span> .....truncated addresses.....
<span class="token label function">.rdata:</span>000000000041DA3C                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA3D                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA3E                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA3F                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA40 TM__V45tF8B8NBcxFcjfe7lhBw_38 db  <span class="token number">50h</span> <span class="token comment">; P</span>
<span class="token label function">.rdata:</span>000000000041DA40                                         <span class="token comment">; DATA XREF: printFlag__main_6+8↑o</span>
<span class="token label function">.rdata:</span>000000000041DA41                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA42                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA43                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA44                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA45                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA46                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA47                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA48                 db  <span class="token number">50h</span> <span class="token comment">; P</span>
<span class="token label function">.rdata:</span>000000000041DA49                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA4A                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA4B                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA4C                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA4D                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA4E                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DA4F                 db  <span class="token number">40h</span> <span class="token comment">; @gnnhexnyjkwpaghynzfthadollhtrhballsdmhhnbjppewgjkhnlhspwjswqoxtgdykxrhwlabblekxj</span>
<span class="token label function">.rdata:</span> .....truncated addresses.....
<span class="token label function">.rdata:</span>000000000041DAA0                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA1                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA2                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA3                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA4                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA5                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA6                 db    <span class="token number">0</span>
<span class="token label function">.rdata:</span>000000000041DAA7                 db    <span class="token number">0</span></code>`}<!-- HTML_TAG_END --></pre> <p data-svelte-h="svelte-nnxnvp">Our values used in the decryption process use the strings <code>P P @gnnhexnyjkwpaghynzfthadollhtrhballsdmhhnbjppewgjkhnlhspwjswqoxtgdykxrhwlabblekxj</code> and <code>L L @D1E2A0D9FA89CABED207EDF4F55C688E04EBE20F077351BDAA1E110D5A74805C916AF12F054C</code> to decipher and print a flag.</p> <p data-svelte-h="svelte-jk3oqu">Digging a little into the RC4 decryption function, we will find some child functions necessary to understand how we should ultimately be performing a decryption:</p> <ul data-svelte-h="svelte-aq2yo3"><li><code>genKeystream__OOZOnimbleZpkgsZ8267524548O49O48Z826752_2</code>,</li> <li><code>fromHex__OOZOnimbleZpkgsZ8267524548O49O48Z826752_83</code>.</li></ul> <p data-svelte-h="svelte-1imzrpl"><img src="/img/rock_paper_psychic_img/Untitled%203.png" alt="Untitled"></p> <p data-svelte-h="svelte-108bjom"><img src="/img/rock_paper_psychic_img/Untitled%204.png" alt="Untitled"></p> <p data-svelte-h="svelte-1j9zbgg"><code>genKeystream</code> seems to just utilize a plaintext value, and it is fairly safe to assume <code>fromHex</code> will convert a string from its hex representation to ASCII. My other assumption was that <code>fromRC4</code> uses the string prefixed with <code>P P @</code> as the “passphrase”/key, and the hexadecimal string labeled <code>L L @</code> as its encrypted input.</p> <p data-svelte-h="svelte-1233it9">With these assumptions, we can discard the weirdness at the start of our cipher strings, and we can run this through Cyberchef’s RC4 decrypt function to get our flag:</p> <p data-svelte-h="svelte-1y9mxnj"><img src="/img/rock_paper_psychic_img/Untitled%205.png" alt="Untitled"></p>`;
});
export {
  Rock_paper_psychic as default,
  metadata
};
