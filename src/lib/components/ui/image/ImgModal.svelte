<script lang="ts">
	// needs some implementation tweaks + serious tidying, but functional
    // (for the most part)
	//   - would also be good to have a doubletap-to-zoom
	//      function
	import HeroiconsXMark from '~icons/heroicons/x-mark';
	import SquareBraceButton from '../squarebrace/SquareBraceButton.svelte';
	import { expoIn, expoOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import {
		toggleModalState,
		modalState,
		nodeCanToggle,
		modalImgSrc,
	} from '$utils/interaction';

	const SCALE_INCREMENT = 0.1;
	const INITIAL_SCALE = 1;
	const MAX_SCALE_VALUE = 5;
	// let scaleOrigin: number; // get this scale origin garbage to work

	let imageContainer: HTMLElement;
	let rect: DOMRect;
	let isPanning = false;
	let scale = INITIAL_SCALE;
	let startX = 0;
	let startY = 0;
	let translateY = 0;
	let translateX = 0;

	const eventBuffer: PointerEvent[] = [];
	let prevDiff = -1;

	export const mouseUp = () => {
		isPanning = false;
	};

	function mouseDown(event: MouseEvent | TouchEvent) {
		event.stopPropagation();
		event.preventDefault();
		isPanning = true;
		let clientX;
		let clientY;

        // might not need this check as we use mostly custom PointerEvent handlers rather
        // than checking for TouchEvents
		if (event.type !== 'touchstart') {
			({ clientX, clientY } = event as MouseEvent);
		} else {
			({ clientX, clientY } = (event as TouchEvent).touches[0]);
		}

		startX = clientX - translateX;
		startY = clientY - translateY;
	}

	function mouseMove(event: MouseEvent | PointerEvent) {
		event.preventDefault();
		event.stopPropagation();
		if (!isPanning) return;

		let clientX;
		let clientY;
		if (event.type !== 'touchmove') {
			({ clientX, clientY } = event as MouseEvent);
		} else {
			({ clientX, clientY } = event as PointerEvent);
		}

		translateX = clientX - startX;
		translateY = clientY - startY;
	}

	function pointerDown(event: PointerEvent) {
		eventBuffer.push(event);
		if (eventBuffer.length < 2) {
			return;
		}

		isPanning = true;
	}

	function pointerUp() {
		// pointer event no longer interacting with DOM,
		// clean up buffers
		isPanning = false;
		eventBuffer.forEach((_) => {
			eventBuffer.pop();
		});

		if (eventBuffer.length < 2) {
			prevDiff = -1;
		}
	}

	function pointerMove(event: PointerEvent) {
		const index = eventBuffer.findIndex(
			(buffered) => buffered.pointerId === event.pointerId
		);

		eventBuffer[index] = event;

        // single touch - perform translation rather than scaling
		if (eventBuffer.length === 1) {
			mouseMove(event);
		} else
        if (eventBuffer.length === 2) {
			// translatePointer();
			const diff = Math.abs(eventBuffer[0].clientY - eventBuffer[1].clientY);

			if (prevDiff > 1) {
				// scale the diff up, round to smooth over float prescision, then
				// scale back to control translation speed
				const current = Math.ceil((diff - prevDiff) * 100);
				changeScale(undefined, current / 1000); // probably a better way to do this
			}

			// buffer the current clientY difference for the next translation event
			prevDiff = diff;
		}
	}

	function changeScale(event?: WheelEvent, diff?: number) {
		// need to adjust the origin based on the the scale, translation, and rect dimensions,
		// don't really know how atm
		rect = imageContainer.getBoundingClientRect();

		// increment scale percent higher/lower depending on deltaY diff
		if (event) {
			event.preventDefault();
			scale =
				event.deltaY > 0 ?
					Math.max(SCALE_INCREMENT, scale - SCALE_INCREMENT)
				:	Math.min(MAX_SCALE_VALUE, scale + SCALE_INCREMENT);
		}
        // same thing but we use the manually-calculated deltaY
		if (diff) {
			scale =
				diff < 0 ?
					Math.max(SCALE_INCREMENT, scale + diff * SCALE_INCREMENT)
				:	(scale = Math.min(MAX_SCALE_VALUE, scale + diff * SCALE_INCREMENT));
		}
	}

	function resetViewport() {
        // run the mouseUp handler func
		mouseUp();

		// pop all items from the buffer
		eventBuffer.forEach((_) => {
			eventBuffer.pop();
		});

        // initial values
		scale = INITIAL_SCALE;
		startX = 0;
		startY = 0;
		translateY = 0;
		translateX = 0;
	}

    // reactive style var for <img /> element
	$: imgStyle = `transform: translate(${translateX}px, ${translateY}px) scale(${scale}); transform-origin: 50%; border-radius: 6px;`;
</script>

{#key $modalState}
	{#if $modalState}
		<button
			in:fade={{ delay: 0, duration: 250, easing: expoIn }}
			out:fade={{ delay: 100, duration: 150, easing: expoIn }}
			on:mousedown={(event) => {
				if (!isPanning && event.target === event.currentTarget) {
					resetViewport();
					nodeCanToggle(event);
				}
			}}
			class="fixed left-0 top-0 z-[60] flex h-screen w-screen cursor-default flex-col items-center justify-center bg-black/75"
		>
			<div
				in:fade={{ delay: 150, duration: 250, easing: expoIn }}
				out:fade={{ delay: 0, duration: 150, easing: expoOut }}
				class="mt-6 flex flex-row items-center justify-center justify-items-center self-center"
			>
				<SquareBraceButton
					handleParentEvent={() => {
						if (!isPanning) {
							resetViewport();
							toggleModalState();
						}
					}}
					classMod="text-l-whitepink text-2xl mb-4"
					opacityMod={undefined}
				>
					<HeroiconsXMark class="-mx-1 inline text-base" />
				</SquareBraceButton>
			</div>
			<button
				bind:this={imageContainer}
				on:mousedown={mouseDown}
				on:mouseup={mouseUp}
				on:mousemove={mouseMove}
				on:touchstart={mouseDown}
				on:pointerdown={(event) => {
					pointerDown(event);
				}}
				on:pointermove={pointerMove}
				on:pointerup={pointerUp}
				on:touchend={mouseUp}
				on:wheel={changeScale}
				class="m-4 flex h-[80%] w-[95%] items-start justify-center overflow-hidden rounded-md border-2 border-l-pink bg-white/20 p-2 sm:mt-8 sm:h-[65%] sm:w-[65%]"
			>
				<img
					src={$modalImgSrc}
					alt="modal content"
					class="max-h-full max-w-full cursor-grab select-none active:cursor-grabbing"
					draggable="false"
					style={imgStyle}
				/>
			</button>
		</button>
	{/if}
{/key}
