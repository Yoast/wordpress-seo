/* Internal dependencies */
import * as actions from "./actions";

/**
 * Resolver for retrieving a list of terms.
 *
 * @param {string} taxonomy Taxonomy slug.
 *
 * @returns {object} The retrieved terms and taxonomy slug.
 */
export function* getTerms( taxonomy ) {
	const terms = yield actions.fetchFromAPI( {
		path: `/wp/v2/${ taxonomy }`,
	} );

	return actions.setTerms( { taxonomy, terms } );
}
