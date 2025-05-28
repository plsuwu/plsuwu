<script lang="ts">
	import Nav from "../nav/Nav.svelte";
</script>

<div
	class="h-[95px] w-full mb-4 bg-gradient-to-r from-purple-dark/20 via-white via-25% to-blue-dark/20 to-80%"
>
	<div class="bg-pink-dark/50 h-[65px]">
		<span
			class="font-bold text-2xl flex flex-col h-full justify-center mx-12"
			><a
				href="/"
				class="hover:text-pink-med hover:brightness-125 w-max p-2 transition-colors duration-100 ease-out"
				>plsuwu</a
			></span
		>
	</div>

	<!-- navbar here when bothered -->
	<div
		class="bg-pink-semidark min-h-[20px] max-h-[35px] flex flex-col justify-center z-50"
	>
		<!-- ... -->
		<!-- <span class="flex flex-col h-full justify-center mx-12">h</span> -->
		<div class="my-10"><Nav /></div>
	</div>
	<!-- navbar -->
</div>
