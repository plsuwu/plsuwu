<div class="my-8 grid w-full grid-cols-8">
	<div
		class="col-span-4 col-start-3 w-1/3 whitespace-nowrap p-2 font-mono text-cat-text opacity-50"
	>
		<div>Program received signal SIGSEGV, Segmentation fault.</div>
		<div>
			<span class="text-cat-blue">0x41414141</span> in <span class="text-cat-peach">??</span> ()
		</div>
		<div>
			[ Legend: <span class="font-bold text-cat-red">Modified register</span> |
			<span class="text-cat-red">Code</span>
			| <span class="text-cat-green">Heap</span> | <span class="text-cat-pink">Stack</span> |
			<span class="text-cat-yellow">String</span> ]
		</div>
		<div>
			<span class="text-cat-overlay0"
				>───────────────────────────────────────────────────────────────────────────────────────────────────────────────</span
			> <span class="text-cat-teal">registers</span> <span class="text-cat-overlay0">────</span>
		</div>
		<div>
			<span class="font-bold text-cat-red">$eax</span> :
			<span class="text-cat-pink">0xffffcd68</span>
			→
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="font-bold text-cat-red">$ebx</span> : 0x41414141 ("<span class="text-cat-yellow"
				>AAAA</span
			>"?)
		</div>
		<div><span class="font-bold text-cat-red">$ecx</span> : 0xf7e228ac → 0x00000000</div>
		<div><span class="text-cat-blue">$edx</span> : 0x0</div>
		<div>
			<span class="font-bold text-cat-red">$esp</span> :
			<span class="text-cat-pink">0xffffcda0</span>
			→
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="font-bold text-cat-red">$ebp</span> : 0x41414141 ("<span class="text-cat-yellow"
				>AAAA</span
			>"?)
		</div>
		<div>
			<span class="font-bold text-cat-red">$esi</span> :
			<span class="text-cat-pink">0xffffce6c</span>
			→ <span class="text-cat-pink">0xffffd076</span> →
			<span class="text-cat-yellow">"ALACRITTY_LOG=/tmp/Alacritty-7406.log"</span>
		</div>
		<div><span class="font-bold text-cat-red">$edi</span> : 0xf7ffcb80 → 0x00000000</div>
		<div>
			<span class="font-bold text-cat-red">$eip</span> : 0x41414141 ("<span class="text-cat-yellow"
				>AAAA</span
			>"?)
		</div>
		<div>
			<span class="font-bold text-cat-red">$eflags:</span> [zero carry
			<span class="font-bold">PARITY</span>
			adjust <span class="font-bold">SIGN</span> trap <span class="font-bold">INTERRUPT</span>
			direction overflow <span class="font-bold">RESUME</span> virtualx86 identification]
		</div>
		<div>
			<span class="text-cat-blue">$cs</span>: 0x23 <span class="text-cat-blue">$ss</span>: 0x2b
			<span class="text-cat-blue">$ds</span>: 0x2b <span class="text-cat-blue">$es</span>: 0x2b
			<span class="text-cat-blue">$fs</span>: 0x00 <span class="font-bold text-cat-red">$gs</span>:
			0x63
		</div>
		<div>
			<span class="text-cat-overlay0"
				>───────────────────────────────────────────────────────────────────────────────────────────────────────────────────</span
			> <span class="text-cat-teal">stack</span> <span class="text-cat-overlay0">────</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcda0</span>│+0x0000:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
			<span class="font-bold text-cat-blue">← $esp</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcda4</span>│+0x0004:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcda8</span>│+0x0008:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcdac</span>│+0x000c:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcdb0</span>│+0x0010:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcdb4</span>│+0x0014:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcdb8</span>│+0x0018:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-teal">0xffffcdbc</span>│+0x001c:
			<span class="text-cat-yellow">"AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA[...]"</span>
		</div>
		<div>
			<span class="text-cat-overlay0"
				>─────────────────────────────────────────────────────────────────────────────────────────────────────────────</span
			> <span class="text-cat-teal">code:x86:32</span> <span class="text-cat-overlay0">────</span>
		</div>
		<div><span class="font-bold text-cat-red">[!]</span> Cannot disassemble from $PC</div>
		<div>
			<span class="font-bold text-cat-red">[!]</span> Cannot access memory at address 0x41414141
		</div>
		<div>
			<span class="text-cat-overlay0"
				>─────────────────────────────────────────────────────────────────────────────────────────────────────────────────</span
			> <span class="text-cat-teal">threads</span> <span class="text-cat-overlay0">────</span>
		</div>
		<div>
			[<span class="text-cat-green">#0</span>] Id 1, Name: "pls uwu",
			<span class="font-bold text-cat-red">stopped</span>
			<span class="text-cat-blue">0x41414141</span>
			in <span class="text-cat-peach">??</span> (), reason:
			<span class="font-bold text-cat-pink">SIGSEGV</span>
		</div>
	</div>
	<div></div>
</div>
