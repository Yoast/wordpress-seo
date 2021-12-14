/**
 * @typedef Shortcode
 *
 * @property {string} shortcode The shortcode (tag). HTML from the tag until the closing tag, e.g. [caption]Hello[/caption].
 * @property {string} output The HTML to output instead of the shortcode.
 */

import { dispatch } from "@wordpress/data";
import { addFilter, removeFilter } from "@wordpress/hooks";
import { SEO_STORE_NAME } from "@yoast/seo-integration";
import { filter, get, some, uniq } from "lodash";

const shortcodeNameMatcher = "[^<>&/\\[\\]\x00-\x20=]+?";
const shortcodeAttributesMatcher = "( [^\\]]+?)?";
const shortcodeStartRegex = new RegExp( "\\[" + shortcodeNameMatcher + shortcodeAttributesMatcher + "\\]", "g" );
const shortcodeEndRegex = new RegExp( "\\[/" + shortcodeNameMatcher + "\\]", "g" );

const shortcodeTags = get( window, "wpseoScriptData.analysis.plugins.shortcodes.wpseo_shortcode_tags", [] );
const keywordRegexString = "(" + shortcodeTags.join( "|" ) + ")";

// The regex for matching shortcodes based on the available shortcode keywords.
const keywordRegex = new RegExp( keywordRegexString, "g" );
const closingTagRegex = new RegExp( "\\[\\/" + keywordRegexString + "\\]", "g" );
const nonCaptureRegex = new RegExp( "\\[" + keywordRegexString + "[^\\]]*?\\]", "g" );

let parsedShortcodes = [];

/**
 * Retrieves the shortcodes from the API.
 *
 * @param {string[]} shortcodes shortcodes to be parsed.
 *
 * @returns {Promise<Shortcode[]>} The promise that contains shortcodes when fulfilled.
 */
const fetchShortcodes = shortcodes => new Promise( ( resolve, reject ) => {
	const url = get( window, "ajaxurl", false );
	const nonce = get( window, "wpseoScriptData.analysis.plugins.shortcodes.wpseo_filter_shortcodes_nonce", false );
	if ( ! url || ! nonce ) {
		console.error( "Shortcodes plugin: failed to retrieve needed variables" );
		reject();
	}

	jQuery.post(
		url,
		{
			action: "wpseo_filter_shortcodes",
			_wpnonce: nonce,
			data: shortcodes,
		},
	)
		.done( response => {
			try {
				resolve( JSON.parse( response ) );
			} catch ( e ) {
				console.error( "Shortcodes plugin: failed to parse shortcode response", e );
				reject();
			}
		} )
		.fail( () => {
			console.error( "Shortcodes plugin: failed to fetch shortcodes" );
			reject();
		} );
} );

/**
 * Matches the capturing shortcodes from a given piece of text.
 *
 * @param {string} text Text to get the capturing shortcodes from.
 *
 * @returns {string[]} The capturing shortcodes.
 */
const matchCapturingShortcodes = text => {
	let captures = [];

	// First identify which tags are being used in a capturing shortcode by looking for closing tags.
	const captureKeywords = ( text.match( closingTagRegex ) || [] ).join( " " ).match( keywordRegex ) || [];

	// Fetch the capturing shortcodes and strip them from the text, so we can easily match the non capturing shortcodes.
	for ( const captureKeyword of captureKeywords ) {
		const captureRegex = "\\[" + captureKeyword + "[^\\]]*?\\].*?\\[\\/" + captureKeyword + "\\]";
		const matches = text.match( new RegExp( captureRegex, "g" ) ) || [];

		captures = captures.concat( matches );
	}

	return captures;
};

/**
 * Gets the shortcodes from a given piece of text.
 *
 * @param {string} text Text to extract shortcodes from.
 *
 * @returns {string[]} The matched shortcodes (tags).
 */
const getShortcodes = text => {
	const captures = matchCapturingShortcodes( text );

	// Remove the capturing shortcodes from the text before trying to match the capturing shortcodes.
	for ( const capture of captures ) {
		text = text.replace( capture, "" );
	}

	const nonCaptures = text.match( nonCaptureRegex ) || [];

	return captures.concat( nonCaptures );
};

/**
 * Removes all unknown shortcodes.
 *
 * Not all plugins properly registered their shortcodes in the WordPress backend.
 * Since we cannot use the data from these shortcodes they must be removed.
 *
 * @param {string} text The text to remove unknown shortcodes.
 *
 * @returns {string} The text without unknown shortcodes.
 */
const removeUnknownShortCodes = text => text.replace( shortcodeStartRegex, "" ).replace( shortcodeEndRegex, "" );

/**
 * Parses shortcodes in a given text.
 *
 * @param {string} text The text to replace the shortcodes in.
 *
 * @returns {string} The text with parsed shortcodes.
 */
const parseShortcodes = text => {
	const foundShortcodes = getShortcodes( text );
	const unparsedShortcodes = uniq( filter(
		foundShortcodes,
		foundShortcode => ! some( parsedShortcodes, parsedShortcode => parsedShortcode.shortcode === foundShortcode ),
	) );

	if ( unparsedShortcodes.length > 0 ) {
		fetchShortcodes( unparsedShortcodes ).then( fetchedShortcodes => {
			parsedShortcodes = parsedShortcodes.concat( fetchedShortcodes );

			// Filters do not support async: request a new analysis after receiving the new shortcodes.
			dispatch( SEO_STORE_NAME ).analyze();
		} );
	}

	for ( const shortcode of parsedShortcodes ) {
		text = text.replace( shortcode.shortcode, shortcode.output );
	}

	return removeUnknownShortCodes( text );
};

/**
 * Registers the shortcodes to be used inside the analysis.
 *
 * @returns {function} Unregister function.
 */
const registerShortcodes = () => {
	const isPost = get( window, "wpseoScriptData.isPost", "" ) === "1";
	if ( ! isPost ) {
		return;
	}

	// Priority of 11 to run it after the replacement variables (priority 10). As a shortcode is not expected to have replacement variables.
	addFilter(
		"yoast.seoStore.analysis.preparePaper",
		"yoast/free/parseShortcodes",
		paper => ( {
			...paper,
			content: parseShortcodes( paper.content ),
		} ),
		11,
	);

	return () => removeFilter( "yoast.seoStore.analysis.preparePaper", "yoast/free/parseShortcodes" );
};

export default registerShortcodes;
