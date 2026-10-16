import { useLayoutEffect, useState } from "react";

/**
 * Tracks whether an element is narrower than a given width.
 *
 * Measures the element rather than the viewport, so it responds to the room the element actually gets.
 * Returns a callback ref, so it also picks up an element that only mounts later, for example after a loading state.
 *
 * A hidden element (`display: none`, like an inactive tab panel) measures 0 wide. That is no width at all, so it keeps
 * the last known value instead: otherwise hiding and showing the element would flip the result back and forth.
 *
 * @param {number} [width] The width in pixels below which the element counts as narrow. Without it, never narrow.
 *
 * @returns {[Function, boolean]} The callback ref for the element, and whether it is narrow.
 */
const useIsNarrowerThan = ( width ) => {
	const [ element, setElement ] = useState( null );
	const [ isNarrow, setIsNarrow ] = useState( false );

	// A layout effect, so the first measurement lands before the first mount.
	useLayoutEffect( () => {
		if ( ! element || ! width ) {
			setIsNarrow( false );
			return;
		}
		const update = ( measuredWidth ) => {
			if ( measuredWidth > 0 ) {
				setIsNarrow( measuredWidth < width );
			}
		};
		update( element.getBoundingClientRect().width );

		if ( typeof window.ResizeObserver === "undefined" ) {
			return;
		}
		const observer = new window.ResizeObserver( ( [ entry ] ) => update( entry.contentRect.width ) );
		observer.observe( element );
		return () => observer.disconnect();
	}, [ element, width ] );

	return [ setElement, isNarrow ];
};

export default useIsNarrowerThan;
