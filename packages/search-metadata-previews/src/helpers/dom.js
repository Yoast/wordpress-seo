/**
 * Gets the height of a DOM element.
 *
 * We use the max value between clientHeight, offsetHeight, and scrollHeight
 * so we always get the actual height in pixels. Inspired by jQuery.
 *
 * @param {HTMLElement} element The element to check.
 *
 * @returns {number} Height in pixels.
 */
export function getHeight( element ) {
	return Math.max(
		element.clientHeight,
		element.offsetHeight,
		element.scrollHeight
	);
}
