/**
 * Returns a function that returns the correct style based on if the current
 * theme is right to left.
 *
 * This is determined by the `isRtl` property in the styled components theme.
 *
 * @param {string} leftToRightStyle  Style to return if the theme is left to right.
 * @param {string} rightToLeftStyle Style to return if the theme is right to left.
 *
 * @returns {Function} A function that returns the right styled based on the
 *                       theme in the props.
 */
export function getDirectionalStyle( leftToRightStyle, rightToLeftStyle ) {
	return ( props ) => {
		return ( props.theme.isRtl ? rightToLeftStyle : leftToRightStyle );
	};
}
