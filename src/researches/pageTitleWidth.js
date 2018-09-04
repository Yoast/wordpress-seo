/**
 * Check the width of the title in pixels
 * @param {Paper} paper The paper object containing the title width in pixels.
 * @returns {number} The width of the title in pixels
 */
export default function( paper ) {
	if( paper.hasTitle() ) {
		return paper.getTitleWidth();
	}
	return 0;
};
