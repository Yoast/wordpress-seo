import { useEffect, useRef } from "@wordpress/element";
import { isEqual } from "lodash";

/**
 * Use effect hook with a compare on the dependencies.
 *
 * This is handy for objects and arrays for which the content did not change.
 *
 * @param {function} callback The effect to run.
 * @param {array} dependencies The dependencies to check.
 * @param {function} [compare] The compare function. Defaults to Lodash's isEqual.
 *
 * @returns {void}
 */
const useEffectWithCompare = ( callback, dependencies, compare = isEqual ) => {
	const ref = useRef();

	if ( ! compare( dependencies, ref.current ) ) {
		ref.current = dependencies;
	}

	useEffect( callback, ref.current );
};

export default useEffectWithCompare;
