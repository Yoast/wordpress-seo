/* External dependencies */
import forEach from "lodash/forEach";
import omit from "lodash/omit";

/* Internal dependencies */
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import decodeHTML from "yoast-components/composites/OnboardingWizard/helpers/htmlDecoder";

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

export function createLabelFromName( name ) {
	// Strip "ct_" or "cf_".
	if ( [ "ct_", "cf_" ].includes( name.substr( 0, 3 ) ) ) {
		name = name.slice( 3 );
	}

	// Remove "desc_" and append " description".
	if ( name.indexOf( "desc_" ) !== -1 ) {
		name = name.slice( 5 ) + " description";
	}

	// Replace all '_' with spaces
	name.replace( "_", " " );

	// Capitalize first letter
	return name[ 0 ].toUpperCase() + name.slice( 1 );
}

/**
 * Decodes the separator replacement variable to a displayable symbol.
 *
 * @param {Object} replacementVariables   The object with replacement variables.
 *
 * @returns {Object} replacementVariables The object with replacement variables with a decoded separator.
 */
export function decodeSeparatorVariable( replacementVariables ) {
	if( replacementVariables[ "sep" ] ) {
		replacementVariables[ "sep" ] = decodeHTML( replacementVariables[ "sep" ] );
	}

	return replacementVariables;
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
