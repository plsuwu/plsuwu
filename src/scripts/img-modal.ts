import assert from "node:assert";

export type PanCoordinates = { x: number; y: number; tx: number; ty: number };
export type Pinch = { dist: number; midX: number; midY: number };

export type Coordinates = {
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

	const pointers = new Map<number, Coordinates>();

	let pinch: Pinch | null = null;
	let pan: PanCoordinates | null = null;

	let moved = false;
	let pointerPeak = 0;
	let downTarget: Element | null = null;

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

	const open = (source: HTMLImageElement) => {
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

	dialog.addEventListener("close", () => {
		reset();
		img.removeAttribute("src");
	});

	dialog.addEventListener("pointerdown", (event) => {
		if ((event.target as Element).closest(".image-modal-close")) {
			return;
		}
		event.preventDefault();
		img.classList.remove("is-animated");

		dialog.setPointerCapture(event.pointerId);
		pointers.set(event.pointerId, {
			x: event.clientX,
			y: event.clientY,
			startX: event.clientX,
			startY: event.clientY,
		});

		if (pointers.size === 1) {
			moved = false;
			pointerPeak = 1;
			downTarget = event.target as Element;

			if (scale > 1) {
				pan = { x: event.clientX, y: event.clientY, tx, ty };
			}
		} else if (pointers.size === 2) {
			pointerPeak = 2;

			const [a, b] = [...pointers.values()];
			assert(a && b);

			pinch = {
				dist: Math.hypot(a.x - b.x, a.y - b.y),
				midX: (a.x + b.x) / 2,
				midY: (a.y + b.y) / 2,
			};

			pan = null;
		} else {
			pointerPeak = Math.max(pointerPeak, pointers.size);
		}
	});

	dialog.addEventListener("pointermove", (event) => {
		const pointer = pointers.get(event.pointerId);
		if (!pointer) {
			return;
		}

		pointer.x = event.clientX;
		pointer.y = event.clientY;

		const drift = Math.hypot(
			pointer.x - pointer.startX,
			pointer.y - pointer.startY
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
			tx = pan.tx + (event.clientX - pan.x);
			ty = pan.ty + (event.clientY - pan.y);

			constrain();
			apply();
		}
	});

	const release = (event: PointerEvent) => {
		if (!pointers.has(event.pointerId)) {
			return;
		}

		pointers.delete(event.pointerId);
		if (pointers.size < 2) {
			pinch = null;
		}

		if (pointers.size === 1 && scale > 1) {
			const [p] = [...pointers.values()];
			assert(p);

			pan = { x: p.x, y: p.y, tx, ty };
			return;
		}

		if (pointers.size > 0) {
			return;
		}

		pan = null;
		if (!(!moved && pointerPeak === 1 && event.type === "pointerup")) {
			return;
		}

		if (downTarget?.closest(".image-modal-img")) {
			img.classList.add("is-animated");
			scale > 1.01
				? reset()
				: zoomAt(event.clientX, event.clientY, clickScale);
		} else {
			dialog.close();
		}
	};

	dialog.addEventListener("pointerup", release);
	dialog.addEventListener("pointercancel", release);

	dialog.addEventListener(
		"touchmove",
		(event) => {
			if (event.touches.length > 1) {
				event.preventDefault();
			}
		},
		{ passive: false }
	);

	dialog.addEventListener("gesturestart", (event) => event.preventDefault());
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
			setup(dialog);
			const selector = dialog.dataset.target;
			if (!selector) {
                return;
            }

			document
				.querySelectorAll<HTMLElement>(`:is(${selector}) img`)
				.forEach((el) => (el.style.cursor = "zoom-in"));
		});
};
