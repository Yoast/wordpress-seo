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
	const integerKeys = [
		"open_graph-image-id",
		"twitter-image-id",
		"content_score",
		"linkdex",
		"inclusive_language_score",
		"estimated-reading-time-minutes",
	];
	const booleanKeys = [ "is_cornerstone", "wordproof_timestamp" ];

	const arrayKeys = [
		"meta-robots-adv",
	];

	const titleKeys = [ "twitter-title", "opengraph-title", "title" ];
	const descriptionKeys = [ "twitter-description", "opengraph-description", "desc", "metadesc" ];

	switch ( true ) {
		case integerKeys.includes( key ):
		case key.startsWith( "primary_" ):
			if ( value && value >= 0 ) {
				return String( value );
			}
			return "0";
		case booleanKeys.includes( key ):
			return value ? "1" : "0";
		case arrayKeys.includes( key ):
			return Array.isArray( value ) ? value.join() : value;
		case titleKeys.includes( key ):
			return prepareSocialTitle( value );
		case descriptionKeys.includes( key ):
			return prepareSocialDescription( value );
		default:
			return value;
	}
};
