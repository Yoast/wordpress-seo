/* External dependencies */
import forEach from "lodash/forEach";
import omit from "lodash/omit";

/* Internal dependencies */
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import decodeHTML from "yoast-components/composites/OnboardingWizard/helpers/htmlDecoder";
import { firstToUpperCase } from "./stringHelpers";


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
	return firstToUpperCase( name );
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
 * Prepare the custom field for dispatch to the redux store.
 * The main use here is to have control over the label, which needs to be created before spaces are replaced.
 *
 * @param {string} name The name of the custom field.
 * @returns {Object}    An object containing the replacement variable name and nice label.
 */
function prepareCustomFieldForDispatch( name ) {
	return {
		name: "cf_" + replaceSpaces( name ),
		label: firstToUpperCase( name + " (custom field)" ),
	}
}

/**
 * Prepare the custom taxonomy for dispatch to the redux store.
 * The main use here is to have control over the label, which needs to be created before spaces are replaced.
 *
 * @param {string} name The name of the custom taxonomy.
 * @returns {Object}    An object containing the replacement variable name and nice label, also for the description.
 */
function prepareCustomTaxonomyForDispatch( name ) {
	const protoName = replaceSpaces( name );
	return {
		name: "ct_" + protoName,
		label: firstToUpperCase( name + " (custom taxonomy)" ),
		descriptionName: "ct_desc_" + protoName,
		descriptionLabel: firstToUpperCase( name + " description (custom taxonomy)" ),
	}
}

/**
 * Map the custom_taxonomies field in the replacevars to a format suited for redux.
 *
 * @param {Object} replaceVars       The original replacevars.
 * @param {Object} store             The redux store.
 *
 * @returns {Object}                 The restructured replacevars object without custom_taxonomies.
 */
export function mapCustomTaxonomies( replaceVars, store ) {
	if( ! replaceVars.custom_taxonomies ) {
		return replaceVars;
	}

	forEach( replaceVars.custom_taxonomies, ( value, key ) => {
		const {
			name,
			label,
			descriptionName,
			descriptionLabel
		} = prepareCustomTaxonomyForDispatch( key );

		store.dispatch( updateReplacementVariable( name, value.name, label ) );
		store.dispatch( updateReplacementVariable( descriptionName, value.description, descriptionLabel ) );
	} );

	return omit( {
		...replaceVars,
	}, "custom_taxonomies" );
}

/**
 * Map the custom_fields field in the replacevars to a format suited for redux.
 *
 * @param {Object} replaceVars       The original replacevars.
 * @param {Object} store             The redux store.
 *
 * @returns {Object}                 The restructured replacevars object without custom_fields.
 */
export function mapCustomFields( replaceVars, store ) {
	if( ! replaceVars.custom_fields ) {
		return replaceVars;
	}

	// let customFieldReplaceVars = {};
	forEach( replaceVars.custom_fields, ( value, key ) => {
		const { name, label } = prepareCustomFieldForDispatch( key );
		store.dispatch( updateReplacementVariable( name, value, label ) );
	} );

	return omit( {
		...replaceVars,
	}, "custom_fields" );
}
