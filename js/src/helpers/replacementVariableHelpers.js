import forEach from "lodash/forEach";
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import omit from "lodash/omit";

export const nonReplaceVars = [ "slug", "content" ];

/**
 * Fills the redux store with the newly acquired data.
 *
 * @param {Object} data  The data object.
 * @param {Object} store The redux store.
 *
 * @returns {void}
 */
export function fillReplacementVariables( data, store ) {
	forEach( data, ( value, name ) => {
		if ( nonReplaceVars.includes( name ) ) {
			return;
		}
		store.dispatch( updateReplacementVariable( name, value ) );
	} );
}

/**
 * Map the custom_taxonomies field in the replacevars to a format suited for redux.
 *
 * @param {Object} replaceVars       The original replacevars.
 *
 * @returns {Object}                 The restructured replacevars object without custom_taxonomies.
 */
export function mapCustomTaxonomies( replaceVars ) {
	if( ! replaceVars.custom_taxonomies ) {
		return replaceVars;
	}

	let customTaxonomyReplaceVars = {};
	forEach( replaceVars.custom_taxonomies, ( value, key ) => {
		customTaxonomyReplaceVars[ `ct_${ key }` ] = value.name;
		customTaxonomyReplaceVars[ `ct_desc_${ key }` ] = value.description;
	} );

	return omit( {
		...replaceVars,
		...customTaxonomyReplaceVars,
	}, "custom_taxonomies" );
}

/**
 * Map the custom_fields field in the replacevars to a format suited for redux.
 *
 * @param {Object} replaceVars       The original replacevars.
 *
 * @returns {Object}                 The restructured replacevars object without custom_fields.
 */
export function mapCustomFields( replaceVars ) {
	if( ! replaceVars.custom_fields ) {
		return replaceVars;
	}

	let customFieldReplaceVars = {};
	forEach( replaceVars.custom_fields, ( value, key ) => {
		customFieldReplaceVars[ `cf_${ key }` ] = value;
	} );

	return omit( {
		...replaceVars,
		...customFieldReplaceVars,
	}, "custom_fields" );
}
