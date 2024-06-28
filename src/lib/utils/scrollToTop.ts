export const backToTop = () => {
    if (typeof document != undefined) {

	    const pos = document.documentElement.scrollTop || document.body.scrollTop;
	    if (pos > 0) {
	    	window.requestAnimationFrame(backToTop);
	    	window.scrollTo(0, pos - pos / 14);
	    }
    };
};
