import { useCallback, useRef } from "@wordpress/element";
import { attempt, forEach } from "lodash";

/**
 * Returns a ref.
 *
 * @param {function} onChange Callback that runs whenever a resize is detected.
 *
 * @returns {function} The ref to use.
 */
export const useMeasuredRef = ( onChange ) => {
	const resizeObserver = useRef( null );

	const ref = useCallback( node => {
		attempt( () => resizeObserver.current && resizeObserver.current.disconnect() );
		if ( node === null ) {
			return;
		}
		resizeObserver.current = new ResizeObserver( entries => {
			forEach( entries, entry => onChange( entry ) );
		} );
		resizeObserver.current.observe( node );
	}, [ onChange ] );

	return ref;
};
