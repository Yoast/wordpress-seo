import { uniqBy, isUndefined } from "lodash-es";

/**
 * Removes duplicate marks from an array.
 * If the marks object have position information, however,
 * we don't want to remove the duplicated objects with the same original strings.
 *
 * @param {Array} marks The marks to remove duplications from.
 *
 * @returns {Array} A list of de-duplicated marks.
 */
function removeDuplicateMarks( marks ) {
	if ( !! marks && ( marks.length === 0 || ! isUndefined( marks[ 0 ].hasPosition() ) ) ) {
		return marks;
	}

	return uniqBy( marks, function( mark ) {
		return mark.getOriginal();
	} );
}

export default removeDuplicateMarks;
