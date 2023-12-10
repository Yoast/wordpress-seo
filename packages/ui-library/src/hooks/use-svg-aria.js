import { useMemo } from "react";

/**
 * Creates aria attributes for an SVG.
 * @param {boolean|null} [isFocusable] Boolean value to indicate if it should be focusable.
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
