import { reduce } from "lodash";
import { select } from "@wordpress/data";
import { STORES } from "../../shared-admin/constants";

/**
 * Retrieves primary terms from store methods.
 *
 * @returns {object} An object with taxonomies keys and their primary term id.
 */
export const getPrimaryTerms = () => {
	const primaryTerms = select( STORES.editor ).getPrimaryTaxonomies();
	return reduce( primaryTerms, ( acc, value, key ) => {
		acc[ `primary_${key}` ] = () => select( STORES.editor ).getPrimaryTaxonomyId( key );
		return acc;
	  }, {} );
};
