/* eslint-disable complexity */
import { isArray, isNumber, isString, reduce } from "lodash";
import { POST_META_KEY_PREFIX } from "../../shared-admin/constants";
import { META_FIELDS } from "./fields";

const INVERSE_META_FIELDS = reduce( META_FIELDS, ( fields, { key }, field ) => {
	fields[ key ] = field;
	return fields;
}, {} );

/**
 * Transforms a field name to a metadata key.
 * @param {string} field The field name.
 * @returns {?string} The metadata key, or null.
 */
export const transformFieldToMetadataKey = ( field ) => {
	if ( field in META_FIELDS ) {
		return POST_META_KEY_PREFIX + META_FIELDS[ field ].key;
	}
	return null;
};

/**
 * Transforms a metadata key to a field name.
 * @param {string} metadataKey The metadata key.
 * @returns {?string} The name, or null.
 */
export const transformMetadataKeyToField = ( metadataKey ) => {
	if ( ! metadataKey.startsWith( POST_META_KEY_PREFIX ) ) {
		return null;
	}
	const key = metadataKey.slice( POST_META_KEY_PREFIX.length );
	if ( key in INVERSE_META_FIELDS ) {
		return INVERSE_META_FIELDS[ key ];
	}
	return null;
};

/**
 * Transforms the dispatchers to work with the Yoast store dispatchers.
 *
 * @param {Object<string,Function>} dispatchers The dispatchers.
 * @param {Object<string,Function>} selectors The selectors.
 *
 * @returns {*} The transformed dispatchers.
 */
export const transformDispatchers = ( dispatchers, selectors ) => reduce( dispatchers, ( transformed, dispatcher, field ) => {
	switch ( field ) {
		case "facebookImageUrl":
		case "twitterImageUrl":
			transformed[ field ] = ( url ) => dispatcher( { url } );
			break;

		case "facebookImageId":
		case "twitterImageId":
			transformed[ field ] = ( id ) => dispatcher( { id } );
			break;

		case "seoScore":
			transformed[ field ] = ( score ) => dispatcher( score, selectors.focusKeyphrase() );
			break;

		case "seoTitle":
			transformed[ field ] = ( title ) => dispatcher( { title } );
			break;
		case "seoDescription":
			transformed[ field ] = ( description ) => dispatcher( { description } );
			break;

		default:
			transformed[ field ] = dispatcher;
	}

	return transformed;
}, {} );

/**
 * Transforms a Yoast editor store value to a metadata value.
 * The metadata values are stored as strings, so we need to convert them from the types to strings.
 *
 * @param {string} field The field name.
 * @param {*} value The store value.
 *
 * @returns {*} value The metadata value.
 */
export const transformToMetadataValue = ( field, value ) => {
	switch ( field ) {
		// Number to string.
		case "seoScore":
		case "readabilityScore":
		case "inclusiveLanguageScore":
		case "readingTime":
			return value >= 0 ? String( value ) : "0";

		// Boolean to string "true" or "false".
		case "isCornerstone":
			return value ? "true" : "false";

		// Array to comma-separated string, fallback to empty string.
		case "robotsAdvanced":
			if ( isArray( value ) ) {
				return value.join( "," );
			}
			return isString( value ) ? value : "";

		// Number to string.
		case "primaryProductCategory":
			// Should be a positive number.
			if ( isNumber( value ) && value <= 0 ) {
				return "";
			}
			return String( value );

		default:
			return value;
	}
};

/**
 * Transforms a metadata value to a Yoast editor store value.
 * The metadata values are stored as strings, so we need to convert them to the actual types (when we use those in our UI).
 *
 * @param {string} field The field name.
 * @param {*} value The metadata value.
 *
 * @returns {*} value The store value.
 */
export const transformFromMetadataValue = ( field, value ) => {
	let newValue;

	switch ( field ) {
		// String to number.
		case "seoScore":
		case "readabilityScore":
		case "inclusiveLanguageScore":
		case "readingTime":
			newValue = Number( value );
			return newValue >= 0 ? newValue : 0;

		// String "true" to true, rest to false.
		case "isCornerstone":
			return value === "true";

		// Comma-separated string to array, fallback to empty array.
		case "robotsAdvanced":
			if ( isString( value ) ) {
				return value.split( "," );
			}
			return isArray( value ) ? value : [];

		// String to number.
		case "primaryProductCategory":
			// Empty string or "default" should be -1.
			if ( value === "" ) {
				return -1;
			}
			newValue = Number( value );
			return newValue <= 0 ? -1 : newValue;

		default:
			return value;
	}
};
