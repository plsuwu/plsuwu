import assert from "node:assert";

export type PointerCoordinates = {
	x: number;
	y: number;
	startX: number;
	startY: number;
};

const clamp = (value: number, min: number, max: number) =>
	Math.min(Math.max(value, min), max);

function setup(dialog: HTMLDialogElement) {
	if (dialog.dataset.bound === "true") {
		return;
	}

	dialog.dataset.bound = "true";

	const img = dialog.querySelector<HTMLImageElement>(".image-modal-img")!;
	const closeButton =
		dialog.querySelector<HTMLButtonElement>(".image-modal-close")!;

	const targetSelector = dialog.dataset.target ?? "body";
	const clickScale = Number(dialog.dataset.clickScale) || 2.5;
	const maxScale = Number(dialog.dataset.maxScale) || 5;

	let scale = 1;
	let tx = 0;
	let ty = 0;

	const pointers = new Map<number, PointerCoordinates>();
	let pinch: { dist: number; midX: number; midY: number } | null = null;
	let pan: { x: number; y: number; tx: number; ty: number } | null = null;
	let moved = false;

	const apply = () => {
		img.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
		img.classList.toggle("is-zoomed", scale > 1.01);
	};

	const reset = () => {
		scale = 1;
		tx = 0;
		ty = 0;

		apply();
	};

	const layoutOrigin = () => ({ x: img.offsetLeft, y: img.offsetTop });

	const constrain = () => {
		const origin = layoutOrigin();
		const width = img.offsetWidth * scale;
		const height = img.offsetHeight * scale;
		const vw = window.innerWidth;
		const vh = window.innerHeight;

		tx =
			width <= vw
				? (vw - width) / 2 - origin.x
				: clamp(tx, vw - width - origin.x, -origin.x);

		ty =
			height <= vh
				? (vh - height) / 2 - origin.y
				: clamp(ty, vh - height - origin.y, -origin.y);
	};

	const zoomAt = (clientX: number, clientY: number, next: number) => {
		const origin = layoutOrigin();
		const px = (clientX - origin.x - tx) / scale;
		const py = (clientY - origin.y - ty) / scale;

		scale = clamp(next, 1, maxScale);
		tx = clientX - origin.x - px * scale;
		ty = clientY - origin.y - py * scale;

		constrain();
		apply();
	};

	/**
	 * open/close handlers
	 */

	const open = (source: HTMLImageElement) => {
		const gutter = window.innerWidth - document.documentElement.clientWidth;
		document.documentElement.style.setProperty(
			"--modal-gutter",
			`${gutter}px`
		);

		img.classList.remove("is-animated");
		img.src = source.currentSrc || source.src;
		img.alt = source.alt;

		reset();
		dialog.showModal();
	};

	const onDocumentClick = (event: MouseEvent) => {
		if (!dialog.isConnected) {
			document.removeEventListener("click", onDocumentClick);
			return;
		}

		if (dialog.open) {
			return;
		}

		const source = (event.target as Element | null)?.closest?.("img");
		if (!source || !source.closest(targetSelector)) {
			return;
		}

		event.preventDefault();
		open(source as HTMLImageElement);
	};
	document.addEventListener("click", onDocumentClick);

	closeButton.addEventListener("click", () => dialog.close());
	dialog.addEventListener("click", (event) => {
		if (event.target === dialog) {
			// modal should close on backdrop click
			dialog.close();
		}
	});

	dialog.addEventListener("close", () => {
		reset();
		// prevent stale image flash when the next image is opened
		img.removeAttribute("src");
	});

	/**
	 * zoom/pan handlers
	 */

	img.addEventListener("pointerdown", (event) => {
		event.preventDefault();

		img.classList.remove("is-animated");
		img.setPointerCapture(event.pointerId);

		pointers.set(event.pointerId, {
			x: event.clientX,
			y: event.clientY,
			startX: event.clientX,
			startY: event.clientY,
		});

		moved = false;

		if (pointers.size === 2) {
			// NOTE this branch shouldn't yield falsy a/b vals, but typescript is (i assume)
			// foolish, and so doesn't recognise the inherent precondition
			const [a, b] = [...pointers.values()];
			assert(a && b);

			pinch = {
				dist: Math.hypot(a.x - b.x, a.y - b.y),
				midX: (a.x + b.x) / 2,
				midY: (a.y + b.y) / 2,
			};

			pan = null;
		} else if (pointers.size === 1 && scale > 1) {
			pan = { x: event.clientX, y: event.clientY, tx, ty };
		}
	});

	img.addEventListener("pointermove", (event) => {
		const pointer = pointers.get(event.pointerId);
		if (!pointer) {
			return;
		}

		pointer.x = event.clientX;
		pointer.y = event.clientY;

		const drift = Math.hypot(
			pointer.x - pointer.startX,
			pointer.y - event.clientY
		);

		if (drift > 4) {
			moved = true;
		}

		if (pointers.size === 2 && pinch) {
			const [a, b] = [...pointers.values()];
			assert(a && b);

			const dist = Math.hypot(a.x - b.x, a.y - b.y);
			const midX = (a.x + b.x) / 2;
			const midY = (a.y + b.y) / 2;

			tx += midX - pinch.midX;
			ty += midY - pinch.midY;

			zoomAt(midX, midY, scale * (dist / pinch.dist));

			pinch = { dist, midX, midY };
			moved = true;
		} else if (pointers.size === 1 && pan) {
			const dx = event.clientX - pan.x;
			const dy = event.clientY - pan.y;
			if (Math.hypot(dx, dy) > 4) {
				moved = true;
			}

			tx = pan.tx + dx;
			ty = pan.ty + dy;

			constrain();
			apply();
		}
	});

	const release = (event: PointerEvent) => {
		pointers.delete(event.pointerId);
		if (pointers.size < 2) {
			pinch = null;
		}

		// continues an existing pan action when one finger is lifted
		if (pointers.size === 1 && scale > 1) {
			const [p] = [...pointers.values()];
			assert(p);

			pan = { x: p.x, y: p.y, tx, ty };
		} else if (pointers.size === 0) {
			pan = null;
		}
	};

	img.addEventListener("pointerup", release);
	img.addEventListener("pointercancel", release);

	img.addEventListener("click", (event) => {
		// avoid toggling zoom directly after a drag/pinch action
		if (moved) {
			moved = false;
			return;
		}

		img.classList.add("is-animated");
		scale > 1.01
			? reset()
			: zoomAt(event.clientX, event.clientY, clickScale);
	});

	window.addEventListener("resize", () => {
		if (!dialog.open) {
			return;
		}

		constrain();
		apply();
	});
}

export const init = () => {
	document
		.querySelectorAll<HTMLDialogElement>("dialog.image-modal")
		.forEach((dialog) => {
			//
			setup(dialog);
			const selector = dialog.dataset.target;
			if (!selector) {
				return;
			}

			// hint that content image can be clicked
			document
				.querySelectorAll<HTMLElement>(`:is(${selector}) img`)
				.forEach((el) => (el.style.cursor = "zoom-in"));
		});
};
