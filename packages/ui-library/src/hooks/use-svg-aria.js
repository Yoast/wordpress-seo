import { useMemo } from "@wordpress/element";

/**
 * Creates aria attributes for an SVG.
 * @param {boolean|null} [isFocusable] The base ID.
 * @returns {Object} Object with `role` and `aria-hidden` and optionally `focusable`.
 */
const useSvgAria = ( isFocusable = null ) => {
	return useMemo( () => {
		const aria = {
			role: "img",
			"aria-hidden": "true",
		};
		if ( isFocusable !== null ) {
			aria.focusable = isFocusable ? "true" : "false";
		}
		return aria;
	}, [ isFocusable ] );
};

export default useSvgAria;
