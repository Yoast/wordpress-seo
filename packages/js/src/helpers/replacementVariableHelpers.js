/* External dependencies */
import {
	forEach,
	omit,
	get,
	identity,
} from "lodash-es";

// @wordpress/sanitize loads directly from the wp-sanitize script handle.
import { stripTags } from "@wordpress/sanitize";

/* Internal dependencies */
import { updateReplacementVariable } from "../redux/actions/snippetEditor";
import { firstToUpperCase } from "./stringHelpers";

import { strings } from "@yoast/helpers";
const { stripHTMLTags } = strings;

export const nonReplaceVars = [ "slug", "content", "contentImage", "snippetPreviewImageURL" ];

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
	const prefix = name.slice( 0, 3 );
	name = name.slice( 3 );

	// Remove "desc_" and append " description".
	if ( name.indexOf( "desc_" ) !== -1 ) {
		name = name.slice( 5 ) + " description";
	}

	// Appends the prefix in full-word form at the end of the name.
	switch ( prefix ) {
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
 * Pushes a new replacement variable from an action into the replacementVariables array.
 * Creates a label from the replacement variable name when no label is supplied.
 *
 * @param {array}  replacementVariables The current replacement variable list
 * @param {Object} action               The UPDATE_REPLACEMENT_VARIABLE action.
 * @param {string} action.name          The name of the replacement variable.
 * @param {string} [action.label]       The label of the replacement variable (optional).
 * @param {*}      action.value         The value of the replacement variable.
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
 * Replace spaces in a string with an underscore (default) or some other symbol/string.
 *
 * @param {string} string      The string in which to replace spaces.
 * @param {string} replacement The symbol or string to replace the spaces with (underscore by default).
 *
 * @returns {string} The string without spaces.
 */
export function replaceSpaces( string, replacement = "_" ) {
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
export function prepareCustomFieldForDispatch( name ) {
	return {
		name: "cf_" + replaceSpaces( name ),
		label: firstToUpperCase( name + " (custom field)" ),
	};
}

/**
 * Prepare the custom taxonomy for dispatch to the redux store.
 * The main use here is to have control over the label, which needs to be created before spaces are replaced.
 *
 * @param {string} name The name of the custom taxonomy.
 * @returns {Object}    An object containing the replacement variable name and nice label, also for the description.
 */
export function prepareCustomTaxonomyForDispatch( name ) {
	const protoName = replaceSpaces( name );
	return {
		name: "ct_" + protoName,
		label: firstToUpperCase( name + " (custom taxonomy)" ),
		descriptionName: "ct_desc_" + protoName,
		descriptionLabel: firstToUpperCase( name + " description (custom taxonomy)" ),
	};
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
	if ( ! replaceVars.custom_taxonomies ) {
		return replaceVars;
	}

	forEach( replaceVars.custom_taxonomies, ( value, key ) => {
		const {
			name,
			label,
			descriptionName,
			descriptionLabel,
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
	if ( ! replaceVars.custom_fields ) {
		return replaceVars;
	}

	forEach( replaceVars.custom_fields, ( value, key ) => {
		const { name, label } = prepareCustomFieldForDispatch( key );
		store.dispatch( updateReplacementVariable( name, value, label ) );
	} );

	return omit( {
		...replaceVars,
	}, "custom_fields" );
}

/**
 * Extracts the excerpt from the given content.
 *
 * @param {string} content The content.
 * @param {number} limit   The amount of characters to extract.
 *
 * @returns {string} The generated excerpt.
 */
export function excerptFromContent( content, limit = 156 ) {
	content = stripTags( content );
	content = content.trim();

	// When the content is shorter than 156 characters, use the entire content.
	if ( content.length <= limit ) {
		return content;
	}

	// Retrieves the first 156 chars from the content.
	content = content.substring( 0, limit );

	// Check if the description has space and trim the auto-generated string to a word boundary.
	if ( /\s/.test( content ) ) {
		content = content.substring( 0, content.lastIndexOf( " " ) );
	}

	return content;
}

/**
 * Runs the legacy replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
const legacyReplaceUsingPlugin = function( data ) {
	const replaceVariables = get( window, [ "YoastSEO", "wp", "replaceVarsPlugin", "replaceVariables" ], identity );

	return {
		url: data.url,
		title: stripHTMLTags( replaceVariables( data.title ) ),
		description: stripHTMLTags( replaceVariables( data.description ) ),
	};
};

/**
 * Apply replaceVariables function on the data in the snippet preview.
 *
 * @param {Object} data             The snippet preview data object.
 * @param {string} data.title       The snippet preview title.
 * @param {string} data.url         The snippet preview url: baseUrl with the slug.
 * @param {string} data.description The snippet preview description.
 *
 * @returns {Object} Returns the data object in which the placeholders have been replaced.
 */
export const applyReplaceUsingPlugin = function( data ) {
	// If we do not have pluggable loaded, apply just our own replace variables.
	const pluggable = get( window, [ "YoastSEO", "app", "pluggable" ], false );
	if ( ! pluggable || ! get( window, [ "YoastSEO", "app", "pluggable", "loaded" ], false ) ) {
		return legacyReplaceUsingPlugin( data );
	}

	const applyModifications = pluggable._applyModifications.bind( pluggable );

	return {
		url: data.url,
		title: stripHTMLTags( applyModifications( "data_page_title", data.title ) ),
		description: stripHTMLTags( applyModifications( "data_meta_desc", data.description ) ),
	};
};
