/**
 * Check the length of the description.
 * @param {Paper} paper The paper object containing the description.
 * @returns {number} The length of the description.
 */
export default function( paper ) {
	return paper.getDescription().length;
};
