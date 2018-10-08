/**
 * Determines the parent term slug(s) for the passed term ID.
 *
 * @param {number} termID  The term ID to determine the parents for.
 * @param {Array}  terms The currently available terms.
 *
 * @returns {Array} The parent term slugs.
 */
export default function( termID, terms ) {
	const parents = [];
	const term = terms.find( term => term.id === termID );

	if ( ! term ) {
		return parents;
	}

	let currentAncestor = term.parent;

	while ( currentAncestor !== 0 ) {
		const ancestor = terms.find( term => term.id === currentAncestor );

		parents.unshift( ancestor.slug );

		currentAncestor = ancestor.parent;
	}

	return parents;
}
