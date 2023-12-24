<script lang="ts">
  export let slug = '';
	const href = slug && `/writeups/${slug}`;
  import PhCaretDoubleRightBold from 'virtual:icons/ph/caret-double-right-bold'

</script>


<a class="group" {href}>
<article class="transition-colors duration-300 ease-in-out grid grid-cols-8 hover:bg-cat-base/25 bg-cat-base rounded-xl my-2">
    <div class="col-span-7 p-4 ">
  <slot />
  </div>
    <div class="col-span-1 rounded-e-xl inline-grid bg-cat-base border-l border-cat-surface0 group-hover:bg-cat-peach/10 transition-color duration-300 ease-in-out">
  <span class="self-center items-end mx-auto text-cat-yellow group-hover:text-cat-peach transition-color duration-300 ease-in-out text-end"> <PhCaretDoubleRightBold/> </span>
    </div>
</article>

</a>

