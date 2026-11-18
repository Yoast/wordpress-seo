import { uniqBy } from "lodash";

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
	/*
	 * We don't remove duplicates when mark has position information, for the reasons below:
	 * 1. Not removing duplicates is simpler than removing the duplicates by looking at the value of mark.getPosition().
	 * 2. Our current approach of creating a mark object with position information eliminates the chance of having duplicates.
	 */
	if ( !! marks && ( marks.length === 0 || !! marks[ 0 ].hasPosition() ) ) {
		return marks;
	}

	return uniqBy( marks, function( mark ) {
		return mark.getOriginal();
	} );
}

export default removeDuplicateMarks;
