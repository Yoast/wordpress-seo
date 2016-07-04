/**
 * Check the width of the title in pixels
 * @param {Paper} paper The paper object containing the title width in pixels.
 * @returns {number} The width of the title in pixels
 */
module.exports = function( paper ) {
	if( paper.hasTitle() ) {
		return paper.getTitleWidth();
	}
	return 0;
};
