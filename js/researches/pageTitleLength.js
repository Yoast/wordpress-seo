/**
 * Check the length of the title.
 * @param {Paper} paper The paper object containing the title.
 * @returns {number} The length of the title.
 */
module.exports = function( paper ) {
	return paper.getTitle().length;
};
