/**
 * Builds a styled-components `attrs` callback that fills in the given defaults for any prop that is
 * not provided. React 19's automatic JSX runtime no longer applies `defaultProps` to function /
 * `forwardRef` components (styled components included), so applying the defaults here keeps them
 * working on both runtimes; `defaultProps` is kept as well for classic consumers.
 *
 * @param {Object} defaults The default prop values.
 *
 * @returns {function(Object): Object} An `attrs` callback returning only the missing defaults.
 */
export function withDefaults( defaults ) {
	return ( props ) => {
		const filled = {};
		Object.keys( defaults ).forEach( ( key ) => {
			if ( typeof props[ key ] === "undefined" ) {
				filled[ key ] = defaults[ key ];
			}
		} );
		return filled;
	};
}
