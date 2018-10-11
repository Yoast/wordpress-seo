/**
 * Finds a term by it's ID in the collection of terms.
 *
 * @param {number} id    The ID to search for.
 * @param {Array}  terms The terms to search through.
 *
 * @returns {Object} The term.
 */
function findTermByID( id, terms ) {
	return terms.find( term => term.id === id );
}

/**
 * Determines the parent term slug(s) for the passed term ID.
 *
 * @param {number} termID The term ID to determine the parents for.
 * @param {Array}  terms  The currently available terms.
 *
 * @returns {Array} The parent term slugs.
 */
export default function( termID, terms ) {
	const parents = [];
	const term = findTermByID( termID, terms );

	if ( ! term ) {
		return parents;
	}

	let currentParentID = term.parent;

	while ( currentParentID !== 0 ) {
		const foundParent = findTermByID( currentParentID, terms );

		parents.unshift( foundParent.slug );

		currentParentID = foundParent.parent;
	}

	return parents;
}
