/* eslint-disable complexity */
import { select } from "@wordpress/data";
import { STORES } from "../../shared-admin/constants";

/**
 * Prepare twitter title to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
const prepareSocialTitle = ( value ) => {
	if ( value.trim() === select( STORES.editor ).getSocialTitleTemplate().trim() ) {
		return "";
	}
	return value;
};

/**
 * Prepare twitter and facebook description to be saved in hidden field.
 * @param {string} value The value to be saved.
 * @returns {string} The value to be saved.
 */
const prepareSocialDescription = ( value ) => {
	if ( value.trim() === select( STORES.editor ).getSocialDescriptionTemplate().trim() ) {
		return "";
	}
	return value;
};

/**
 * Prepare value to be saved in hidden field.
 *
 * @param {string} key The key of the value.
 * @param {string} value The value to be saved.
 *
 * @returns {string} The value to be saved.
 */
export const transformMetaValue = ( key, value ) => {
	switch ( key ) {
		case "content_score":
		case "linkdex":
		case "inclusive_language_score":
		case "estimated-reading-time-minutes":
		case "open_graph-image-id":
		case "twitter-image-id":
			return ( value && value >= 0 ) ? String( value ) : "0";
		case "is_cornerstone":
		case "wordproof_timestamp":
			return value ? "1" : "0";
		case "meta-robots-adv":
			return Array.isArray( value ) ? value : "";
		case "twitter-title":
		case "opengraph-title":
		case "title":
			return prepareSocialTitle( value );
		case "twitter-description":
		case "opengraph-description":
		case "desc":
		case "metadesc":
			return prepareSocialDescription( value );
	}

	if ( key.startsWith( "primary_" ) ) {
		return ( value > 0 ) ? String( value ) : "";
	}

	return value;
};
