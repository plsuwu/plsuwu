import type { Page } from '@sveltejs/kit';
import { writable, type Readable, type Writable } from 'svelte/store';
import { page } from '$app/stores';

/*
 * Image modal state and state toggle handler functions
 * */
export const modalState: Writable<boolean> = writable(false);
export const modalImgSrc: Writable<string> = writable('#');

export const toggleModalState = (src?: string) => {
    // undefined src means the modal was in an opened state
    modalState.update((currentState) => !currentState);
    if (src) {
        modalImgSrc.set(src);
    }
};

export const transformMarkup = (document: Document, currUrl: string) => {
    const images = document.querySelectorAll('img');
    const headers = document.querySelectorAll('h1, h2, h3, h4, h5, h6');

    images.forEach((img) => {
        const btn = document.createElement('button');
        img.className = 'hover:bg-l-darkpink/25 transition-all duration-300 ease-in-out';

        img.parentNode?.insertBefore(btn, img);
        btn.appendChild(img);
        btn.addEventListener('click', () => toggleModalState(img.src));
        btn.addEventListener('keydown', ((e) => { if (e.key === 'Escape') { toggleModalState() }}));
    });

    headers.forEach((head) => {
        console.log(head);

        const ref = head.textContent
            ?.toLowerCase()
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '');
        const btn = document.createElement('button');
        head.parentNode?.insertBefore(btn, head);

        btn.appendChild(head);
        btn.addEventListener('click', () =>
            pipeToClipboard(ref as string, currUrl)
        );
    });
};

export const pipeToClipboard = (ref: string, url: string) => {
    const string = `${url}#${ref}`;
    navigator.clipboard.writeText(string);
};

export const nodeCanToggle = (event: Event): boolean => {
    // console.log(modalState);

    if (event.target === event.currentTarget) {
        toggleModalState();
        return true;
    }

    event.stopPropagation();
    return false;
};

/*
 * Smooth scrolling function
 * */
export const scrollToTop = () => {
    if (typeof document != typeof undefined) {
        const pos = document.documentElement.scrollTop || document.body.scrollTop;
        if (pos > 0) {
            window.requestAnimationFrame(scrollToTop);
            window.scrollTo(0, pos - pos / 24);
        }
    }
};
