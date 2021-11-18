import { useEffect, useRef } from "@wordpress/element";
import { cloneDeep, isEqual } from "lodash";

/**
 * Use effect hook with deep compare on the dependencies.
 *
 * This is handy for objects and arrays for which the content did not change.
 *
 * @param {function} callback The effect to run.
 * @param {array} dependencies The dependencies to check.
 *
 * @returns {void}
 */
export const useEffectWithDeepCompare = ( callback, dependencies ) => {
	const ref = useRef();

	if ( ! isEqual( dependencies, ref.current ) ) {
		ref.current = cloneDeep( dependencies );
	}

	useEffect( callback, ref.current );
};
