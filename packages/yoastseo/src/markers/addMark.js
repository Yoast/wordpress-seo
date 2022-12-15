/**
 * Marks a text with HTML tags
 * @category Markers
 * @param {string} text The unmarked text.
 * @returns {string} The marked text.
 */
export default function( text ) {
	return "<yoastmark class='yoast-text-mark'>" + text + "</yoastmark>";
}
