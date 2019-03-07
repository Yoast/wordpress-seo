/**
 * Determines the child count based on the children prop.
 *
 * @param {ReactElement|ReactElement[]} children Component children prop.
 *
 * @returns {number} Number of children
 */
export function getChildrenCount( children ) {
	let count = 0;
	if ( children ) {
		if ( isNaN( children.length ) ) {
			count = 1;
		} else {
			count = children.length;
		}
	}
	return count;
}
