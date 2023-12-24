<script lang="ts">
	import PhGithubLogo from 'virtual:icons/ph/github-logo';
	import PhSoundcloudLogo from 'virtual:icons/ph/soundcloud-logo';

	interface Profile {
		name: string;
		profile: string;
	}

	const profiles: Profile[] = [
		{
			name: 'hackthebox',
			profile: 'https://app.hackthebox.com/profile/1555919'
		},
		{
			name: 'tryhackme',
			profile: 'https://tryhackme.com/p/owoplsuwu'
		},
		{
			name: '0x0539',
			profile: 'https://0x0539.net/profile/pls'
		},
		{
			name: 'huntress',
			profile:
				'https://www.huntress.com/blog/the-hackers-in-the-arena-the-huntress-ctf-retrospective'
		}
	];
</script>

<div class="mt-14 w-full flex-col lg:mt-0">
	<div class="w-full self-center bg-cat-mantle pb-6">
		<div class="text-center font-bold text-cat-text">
			<div class="py-8 text-center text-3xl font-bold text-cat-overlay0 lg:text-3xl">about</div>
		</div>

		<div class="mx-auto w-full rounded-xl bg-cat-crust text-cat-text lg:max-w-[66%]">
			<div class="mx-auto flex flex-col p-8 text-sm sm:text-xl lg:space-y-0">
				<div class="my-6 text-3xl font-semibold text-cat-overlay2 lg:my-0">hello,</div>
				<div class="text-sm lg:text-lg">
					<div class="my-2">my name is zac.</div>

					<div class="mb-6">
						<span> this is more or less a blog of sorts and has been built mostly with</span>
						<ul class="my-1 list-inside indent-6 text-cat-overlay2">
							<li>[<span class="text-cat-peach">*</span>] &nbsp; sveltekit (typescript),</li>
							<li>[<span class="text-cat-blue">*</span>] &nbsp; tailwindcss, &</li>
							<li>[<span class="text-cat-text">*</span>] &nbsp; mdsvex,</li>
						</ul>
						and then SEALED away in a docker container on google cloud.

						<div class="my-4">
							i am prioritizing building functionality over adding the entirety of my writeup
							backlog, so i am currently just hosting a smaller selection of writeups for challenges
							i have done from sites/competitions, including
							<span>
								{#each profiles as site, idx}
									{idx > 0 && idx === profiles.length - 1 ? 'and ' : ''}
									<a
										class="text-cat-blue underline transition-opacity duration-200 ease-out hover:opacity-50"
										href={site.profile}
									>
										<!-- NOTE: separating the following 3 elements introduces incorrect dom formatting. -->
										{site.name}</a
									>{idx < profiles.length - 1 ? ', ' : '. '}
								{/each}
							</span>
						</div>
						<div class="mt-8">
							u can find this project alongside a handful of my things that i have done @
							<a
								class="text-cat-blue transition-all duration-200 ease-out visited:text-cat-mauve hover:opacity-50"
								href="https://github.com/plsuwu"
							>
								<PhGithubLogo class="inline-flex" />
								<span class="inline-flex underline">my github</span>
							</a>
							and
							<a
								class="text-cat-blue transition-all duration-200 ease-out visited:text-cat-mauve hover:opacity-50"
								href="https://soundcloud.com/notpls"
							>
								<PhSoundcloudLogo class="inline-flex" />
								<span class="inline-flex underline">my soundcloud</span>
							</a>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
