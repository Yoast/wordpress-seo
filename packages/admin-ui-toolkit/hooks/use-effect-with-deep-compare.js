import { useEffect, useRef } from "@wordpress/element";
import { isEqual } from "lodash";

/**
 * Hook to memoize a value, and update it only if changed.
 *
 * @param {*} value The value to check.
 *
 * @returns {*} The value.
 */
function useDeepCompareMemoize( value ) {
	const ref = useRef();

	if ( ! isEqual( value, ref.current ) ) {
		ref.current = value;
	}

	return ref.current;
}

/**
 * Use effect hook with a deep compare on the dependencies.
 *
 * This is handy for objects and arrays for which the content did not change.
 *
 * @param {function} callback The effect to run.
 * @param {array} dependencies The dependencies to check.
 *
 * @returns {void}
 */
export default function useEffectWithDeepCompare( callback, dependencies ) {
	useEffect(
		callback,
		dependencies.map( useDeepCompareMemoize ),
	);
}
