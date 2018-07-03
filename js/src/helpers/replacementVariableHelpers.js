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

/**
 * Handles ct_, cf_, and pt_ prefixes (and their desc_ variants).
 * It strips the prefix, and adds it in full-word form at the end of the name.
 *
 * @param {string} name The name for which the prefix should be handled.
 *
 * @returns {string} The handled name, stripped from prefixes.
 */
export function handlePrefixes( name ) {
	const prefixes = [ "ct_", "cf_", "pt_" ];

	// If there are no prefixes, replace underscores by spaces and return.
	if ( ! prefixes.includes( name.substr( 0, 3 ) ) ) {
		return name.replace( /_/g, " " );
	}

	// Strip "ct_", "cf_", or "pt_", and save it for the switch statement.
	let prefix = name.slice( 0, 3 );
	name = name.slice( 3 );

	// Remove "desc_" and append " description".
	if ( name.indexOf( "desc_" ) !== -1 ) {
		name = name.slice( 5 ) + " description";
	}

	// Appends the prefix in full-word form at the end of the name.
	switch( prefix ) {
		case "ct_":
			name += " (custom taxonomy)";
			break;
		case "cf_":
			name += " (custom field)";
			break;
		case "pt_":
			name = name.replace( "single", "singular" );
			name = "Post type (" + name + ")";
			break;
		default:
			break;
	}
	return name;
}

/**
 * Creates a "nicename" label from a replacementVariable name.
 *
 * @param {string} name The name from which a label should be created
 *
 * @returns {string} The label that was created for the replacementVariable.
 */
export function createLabelFromName( name ) {
	name = handlePrefixes( name );

	// Capitalize first letter
	return name[ 0 ].toUpperCase() + name.slice( 1 );
}

/**
 * Pushes a new replacement variable from an action into the replacementVariables array.
 * Creates a label from the replacement variable name when no label is supplied.
 *
 * @param {array}  replacementVariables The current replacement variable list
 * @param {Object} action               The UPDATE_REPLACEMENT_VARIABLE action.
 * @param {string} action.name          The name of the replacement variable.
 * @param {string} [action.label]       The label of the replacement variable (optional).
 * @param {*} action.value         The value of the replacement variable.
 *
 * @returns {array} The extended list of replacement variables.
 */
export function pushNewReplaceVar( replacementVariables, action ) {
	replacementVariables.push( {
		name: action.name,
		label: action.label || createLabelFromName( action.name ),
		value: action.value,
	} );
	return replacementVariables;
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
 * Replace spaces in a string with an underscore (default) or some other symbol/string.
 *
 * @param {string} string      The string in which to replace spaces.
 * @param {string} replacement The symbol or string to replace the spaces with (underscore by default).
 *
 * @returns {string} The string without spaces.
 */
function replaceSpaces( string, replacement = "_" ) {
	// Replace whitespaces with the replacement.
	return string.replace( /\s/g, replacement );
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
		key = replaceSpaces( key );
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
		key = replaceSpaces( key );
		customFieldReplaceVars[ `cf_${ key }` ] = value;
	} );

	return omit( {
		...replaceVars,
		...customFieldReplaceVars,
	}, "custom_fields" );
}
