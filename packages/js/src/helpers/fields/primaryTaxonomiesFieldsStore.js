import { get, reduce } from "lodash";
import { select } from "@wordpress/data";
import { STORES } from "../../shared-admin/constants";

/**
 * Retrieves primary terms from store methods.
 *
 * @returns {object} An object with taxonomies keys and their primary term id.
 */
export const getPrimaryTerms = () => {
	const primaryTerms = get( window, "wpseoPrimaryCategoryL10n.taxonomies", {} );
	return reduce( primaryTerms, ( primaryTermGetters, value, key ) => {
		primaryTermGetters[ `primary_${key}` ] = () => {
			return select( STORES.editor ).getPrimaryTaxonomyId( key );
		};
	}, {} );
};
