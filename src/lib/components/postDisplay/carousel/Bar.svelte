<script lang="ts">
	interface Props {
		barWidth: string;
		isLastIndex: boolean;
	}

	let { barWidth, isLastIndex }: Props = $props();
</script>

<div class="bg-pink-dark/35 -z-50 w-full rounded-b-md relative">
	<div
		class="carousel-progress bg-pink-dark transition-ease -z-50 h-[6px] transition-all duration-300 delay-75 ease-in-out rounded-bl-md"
		style={`width: ${barWidth}; border-bottom-right-radius: ${isLastIndex ? "6px" : "0"};`}
	></div>
</div>
