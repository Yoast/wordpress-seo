var getSubheadings = require( "../stringProcessing/getSubheadings.js" );

/**
 * Checks if there is a subheading present in the text
 * @param {Paper} paper The Paper object to get the text from.
 * @returns {number} Number of headings found.
 */
module.exports = function( paper ) {
	var text = paper.getText();
	var headings = getSubheadings( text ) || [];
	return headings.length;
};
