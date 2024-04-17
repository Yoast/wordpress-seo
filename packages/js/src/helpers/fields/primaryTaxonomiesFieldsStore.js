import { get, pickBy, forEach, defaultTo } from "lodash";
import { select } from "@wordpress/data";
import { STORE_NAME_EDITOR } from "../../shared-admin/constants";

/**
 * Retrieves primary terms from store methods.
 *
 * @returns {object} An object with taxonomies keys and their primary term id.
 */
const getPrimaryTerms = () => {
	const wpseoScriptDataMetaData = get( window, "wpseoScriptData.metabox.metadata", {} );
	const getPrimaryTermsStore = {};
	const primaryTerms = pickBy( wpseoScriptDataMetaData, ( value, key ) => key.startsWith( "primary_" ) );
	forEach( primaryTerms, ( value, key ) => {
		const taxonomy = key.replace( "primary_", "" );
		getPrimaryTermsStore[ `primary_${taxonomy}` ] = () => {
			const termId = String( defaultTo( select( STORE_NAME_EDITOR.free ).getPrimaryTaxonomyId( taxonomy ), "" ) );
			if ( termId === "0" || termId === "-1" ) {
				return "";
			}
			return termId;
		};
	} );
	return getPrimaryTermsStore;
};

export default getPrimaryTerms;
