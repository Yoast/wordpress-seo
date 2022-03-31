/**
 * Sorts array of objects alphabetically based on the object text content.
 * E.g. [ { name: "dogs" }, { name: "cats" } ] ->  [ { name: "cats" }, { name: "dogs" } ]
 *
 * @param {Object[]} array An array objects.
 *
 * @returns {Object[]} The alphabetically sorted array of objects.
 */
export const sortArrayOfObjects = ( array ) => {
	return array.sort( ( a, b ) => {
		const nameA = a.name.toLowerCase();
		const nameB = b.name.toLowerCase();
		if ( nameA < nameB ) {
			return -1;
		}
		if ( nameA > nameB ) {
			return 1;
		}
		return 0;
	} );
};
