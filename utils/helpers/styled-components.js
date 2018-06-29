/**
 * Returns a function that returns the correct style based on if the current
 * theme is right to left.
 *
 * This is determined by the `isRtl` property in the styled components theme.
 *
 * @param {string} left  Style to return if the theme is left to right.
 * @param {string} right Style to return if the theme is right to left.
 *
 * @returns {Function} A function that returns the right styled based on the
 * 					   theme in the props.
 */
export function getRtlStyle( left, right ) {
	return ( props ) => {
		return ( props.theme.isRtl ? right : left );
	};
}
