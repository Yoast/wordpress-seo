import { flatten } from "lodash-es";

/**
 * Sorts components by a prop `renderPriority`.
 *
 * The array is flattened before sorting to make sure that components inside of
 * a collection are also included. This is to allow sorting multiple fills of
 * which at least one includes an array of components.
 *
 * @param {wp.Element|array} components The component(s) to be sorted.
 *
 * @returns {wp.Element|array} The sorted component(s).
 */
export default function sortComponentsByRenderPriority( components ) {
	if ( typeof components.length === "undefined" ) {
		return components;
	}

	return flatten( components ).sort( ( a, b ) => {
		if ( typeof a.props.renderPriority === "undefined" ) {
			return 1;
		}
		return a.props.renderPriority - b.props.renderPriority;
	} );
}
