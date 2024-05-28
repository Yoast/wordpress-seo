import { useEffect } from "@wordpress/element";

/**
 * Hook to use a mutation observer.
 *
 * @param {HTMLElement} observe The element to observe.
 * @param {function} callback The callback to call when a mutation is observed.
 * @param {MutationObserverInit} options The options to pass to the observer.
 *
 * @returns {void}
 */
export const useMutationObserver = ( observe, callback, options = { childList: true, subtree: true } ) => {
	useEffect( () => {
		const observer = new MutationObserver( callback );
		observer.observe( observe, options );
		return () => observer.disconnect();
	}, [ observe, callback ] );
};
