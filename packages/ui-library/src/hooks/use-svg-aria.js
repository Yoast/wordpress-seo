import { useMemo } from "react";

/**
 * Creates aria attributes for an SVG.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles/img_role
 * @see https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-hidden
 * @see https://www.w3.org/TR/SVGTiny12/interact.html#focusable-attr
 *
 * @param {boolean|null} [isFocusable] Boolean value to indicate if it should be focusable.
 *
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
