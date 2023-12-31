<script lang="ts">
    import Accordion from "$lib/components/Accordion.svelte";

    import PhGithubLogo from "virtual:icons/ph/github-logo";
    import PhSoundcloudLogo from "virtual:icons/ph/soundcloud-logo";

    interface Profile {
        name: string;
        profile: string;
    }

    const profiles: Profile[] = [
        {
            name: "hackthebox",
            profile: "https://app.hackthebox.com/profile/1555919",
        },
        {
            name: "tryhackme",
            profile: "https://tryhackme.com/p/owoplsuwu",
        },
        {
            name: "0x0539",
            profile: "https://0x0539.net/profile/pls",
        },
        {
            name: "huntress",
            profile:
                "https://www.huntress.com/blog/the-hackers-in-the-arena-the-huntress-ctf-retrospective",
        },
    ];
</script>

<div class="mt-14 w-full flex-col lg:mt-0">
    <div class="w-full self-center bg-cat-mantle pb-6">
        <div class="text-center font-bold text-cat-text">
            <div
                class="py-8 text-center text-3xl font-bold text-cat-overlay0 lg:text-3xl"
            >
                about
            </div>
        </div>

        <div
            class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text lg:max-w-[66%]"
        >
            <div
                class="mx-auto flex flex-col p-8 text-sm sm:text-xl lg:space-y-0"
            >
                <div
                    class="my-6 text-3xl font-semibold text-cat-overlay2 lg:my-0"
                >
                    Hello,
                </div>
                <div class="text-sm lg:text-lg">
                    <div class="my-6">
                        <span>
                            I'm Zachary but I also often use the handle `<span
                                class="font-mono rounded-xl py-1 px-2 bg-cat-mantle"
                                >pls</span
                            >` (or a slight variation of it) online. I'm
                            currently studying an undergraduate computer science
                            degree;
                        </span>

                        <div>
                            my main area of interest - and this site's primary
                            focus - is in cybersecurity, though I have two areas
                            I'm particularly interested in:
                            <ul
                                class="list-disc list-inside ml-6 md:mr-36 mt-3 space-y-1"
                            >
                                <li>
                                    <span
                                        class="text-cat-red italic font-semibold"
                                        >Red teaming</span
                                    > - identifying vulnerabilities or weaknesses
                                    in a system or security solution by performing
                                    simulated attacks,
                                </li>
                                <li>
                                    <span
                                        class="text-cat-blue italic font-semibold"
                                        >Malware analysis</span
                                    > - digging into malicious scripts or binaries
                                    & determining how a something functions, its
                                    purpose, and where it might originate from.
                                </li>
                            </ul>
                            <div class="my-4">
                                Of course, both are very expansive and technical
                                fields; I would still consider myself a
                                beginner, though I do feel pretty confident with
                                the basic toolsets and tradecraft. To that note,
                                it is also very rewarding to learn new things -
                                the hands-on, trial-and-error, "try/fail/try
                                harder" approach to learning new concepts makes
                                the end product much more rewarding; though
                                beyond this, it makes the newly-integrated
                                knowledge more comprehensive and robust.
                            </div>
                        </div>
                        <Accordion>
                            <span slot="head"
                                >Offensive Security Tools & Skills</span
                            >
                            <div
                                slot="content"
                                class="bg-cat-mantle rounded-xl"
                            >
                                <ul class="list-disc ml-6 p-3 lg:p-6">
                                    <li>
                                        Binary exploitation techniques, e.g -
                                        binary protections (NX, stack canaries,
                                        PIE, GOT, RELRO, ASLR), shellcode,
                                        return-oriented programming
                                    </li>
                                    <li>
                                        High-level understanding of Windows and
                                        *NIX command lines and configurations
                                    </li>
                                    <li>
                                        Common ports and their associated
                                        "default" services
                                    </li>
                                    <li>
                                        A broad range of offensive tools:
                                        <ul
                                            class="ml-4 list-[circle] list-inside text-cat-subtext0"
                                        >
                                            <li>nmap, dig, shodan, recon-ng</li>
                                            <li>
                                                dirbuster, ffuf, nikto, sqlmap,
                                                burp
                                            </li>
                                            <li>
                                                enum4linux, smbmap, rpcclient
                                            </li>
                                            <li>linpeas</li>
                                            <li>hydra</li>
                                            <li>hashcat, john</li>
                                            <li>curl, netcat, telnet</li>
                                            <li>impacket</li>
                                            <li>metasploit</li>
                                            <li>
                                                offensive python and shell
                                                scripting
                                            </li>
                                        </ul>
                                    </li>
                                    <li>
                                        A range of web technologies <span
                                            class="text-cat-overlay2"
                                            >(Javascript, PHP, Wordpress,
                                            Apache, Docker, etc.)</span
                                        >
                                        and a range of (fairly basic) associated
                                        vulnerabilities
                                        <span class="text-cat-overlay2"
                                            >(prototype pollution,
                                            deserialization, XSS, directory
                                            traversal, mounted sockets, etc.)</span
                                        >
                                    </li>
                                    <li>
                                        More generally, HTTP-based
                                        vulnerabilities <span
                                            class="text-cat-overlay2"
                                            >(IDOR, SSRF, method tampering &
                                            CORS misconfigurations, XML
                                            injection, DNS rebinding, etc.)
                                        </span>
                                    </li>
                                    <li>
                                        A range of local privilege escalation
                                        vectors and techniques
                                    </li>
                                    <li>
                                        Large language model "prompt hacking"
                                        e.g - defined dictionary attacks,
                                        payload splitting, token smuggling
                                    </li>
                                    <li>Docker breakout/escape techniques</li>
                                </ul>
                            </div>
                        </Accordion>
                        <Accordion>
                            <span slot="head"
                                >Malware & Forensics Tools & Skills</span
                            >
                            <div
                                slot="content"
                                class="bg-cat-mantle rounded-xl"
                            >
                                <ul class="list-disc ml-6 p-3 lg:p-6">
                                    <li>IDA, Ghidra, Cutter</li>
                                    <li>WinDBG, x64dbg, GDB (GEF)</li>
                                    <li>
                                        Python as a reverse engineering tool
                                        (program recreation, "debugging"
                                        binaries with
                                        pwntoolsclass="bg-cat-mantle
                                        rounded-xl")
                                    </li>
                                    <li>Sysinternals - Procmon, Procdump</li>
                                    <li>
                                        Virtual machines, including the use of
                                        Windows + REMnux to isolate and analyse
                                        malicious network activity
                                    </li>
                                    <li>The Volatility Framework</li>
                                    <li>
                                        Code and (dis)assembly deobfuscation;
                                        reverse engineering purposefully obtuse
                                        programs
                                    </li>
                                    <li>
                                        Foundational understanding of the x86_64
                                        instruction set architecture
                                    </li>
                                    <li>
                                        Foundational understanding of NT
                                        userland{"<->"}kernel communication,
                                        process hollowing, and DLL injection
                                    </li>
                                </ul>
                            </div></Accordion
                        >
                    </div>
                    <div>
                        I also have a respectable skillset more generally
                        applicable to programming and systems knowledge, though
                        I similarly would consider myself a beginner in many
                        aspects here as well.
                        <Accordion>
                            <span slot="head"
                                >General Systems & Programming Skills</span
                            >
                            <div
                                slot="content"
                                class="bg-cat-mantle rounded-xl"
                            >
                                <ul class="list-disc ml-6 p-3 lg:p-6">
                                    <li>
                                        Programming and scripting languages:
                                        <ul
                                            class="list-[circle] ml-4 list-inside text-cat-subtext0"
                                        >
                                            <li>Python</li>
                                            <li>Rust</li>
                                            <li>x86_64 assembly</li>
                                            <li>Haskell (fundamental)</li>
                                            <li>
                                                Web-based languages, e.g -
                                                Javascript, Typescript, Node,
                                                PHP, SQL (MySQL, Postgres)
                                            </li>
                                            <li>
                                                Web frameworks, e.g - Svelte,
                                                React, TailwindCSS, SCSS
                                            </li>
                                            <li>Bash/Powershell</li>
                                        </ul>
                                    </li>
                                    <li>
                                        Fundamental low-level computation - from
                                        long-term storage to instruction cycles
                                    </li>
                                    <li>
                                        Fundamental machine learning,
                                        specifically relating to LLM transformer
                                        inference and training, e.g -
                                        parameters, context windows,
                                        tokenization, quantization, datasets,
                                        and hardware
                                    </li>
                                    <li>
                                        Networking, TCP/IP & OSI network models
                                    </li>
                                    <li>Using & configuring SSH</li>
                                    <li>
                                        Cryptography, e.g - TLS, AES, RSA, as
                                        well as hashing algorithms like bcrypt,
                                        md5, NTLM
                                    </li>
                                    <li>
                                        Virtual machines,
                                        containerization/orchestration with
                                        Docker & Compose
                                    </li>
                                    <li>
                                        Windows and Linux permissions and system
                                        configuration
                                    </li>
                                    <li>
                                        Configuring and using a variety of IDEs
                                        and editors, primarily (Neo)Vim and VS
                                        Code, but also Nano, Visual Studio and a
                                        handful of others.
                                    </li>
                                </ul>
                            </div>
                        </Accordion>
                    </div>
                    <div class="mt-8">
                        <div class="my-4 text-center">
                            You can view some of my other projects and Arch
                            (btw) dotfiles @

                            <a
                                class="text-cat-blue transition-all duration-200 ease-out visited:text-cat-mauve hover:opacity-50"
                                href="https://github.com/plsuwu"
                            >
                                <PhGithubLogo class="inline-flex" />
                                <span class="inline-flex underline"
                                    >github.com/plsuwu</span
                                >
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
