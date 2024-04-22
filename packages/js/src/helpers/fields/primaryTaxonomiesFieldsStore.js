import { get, forEach } from "lodash";
import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * Retrieves primary terms from store methods.
 *
 * @returns {object} An object with taxonomies keys and their primary term id.
 */
const getPrimaryTerms = () => {
	const primaryTerms = get( window, "wpseoPrimaryCategoryL10n.taxonomies", {} );
	const getPrimaryTermsStore = {};
	forEach( primaryTerms, ( value, key ) => {
		getPrimaryTermsStore[ `primary_${key}` ] = () => {
			const termId = String( select( STORE_NAME_EDITOR.free ).getPrimaryTaxonomyId( key ) );
			if ( termId === "0" || termId === "-1" ) {
				return "";
			}
			return termId;
		};
	} );

	return getPrimaryTermsStore;
};

export default getPrimaryTerms;
