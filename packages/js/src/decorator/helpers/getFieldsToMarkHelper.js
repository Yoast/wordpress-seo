
import { flatten, isUndefined, uniq } from "lodash-es";

/**
 * A helper function to extract the fieldsToMark attribute from each Mark object.
 * @param {array} marks A list of Mark objects.
 * @returns {array} A list of strings containing being the fields to mark.
 */
function getFieldsToMarkHelper( marks ) {
	return uniq( flatten( marks.map( mark => {
		if ( ! isUndefined( mark.getFieldsToMark() ) ) {
			return mark.getFieldsToMark();
		}
	} ) ) );
}

export default getFieldsToMarkHelper;
