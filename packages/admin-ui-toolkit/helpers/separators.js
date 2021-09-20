import { findKey } from "lodash";

export const SEPARATORS = {
	"-": "-",
	"–": "&ndash;",
	"—": "&mdash;",
	":": ":",
	"·": "&middot;",
	"•": "&bull;",
	"*": "*",
	"⋆": "&#8902;",
	"«": "&laquo;",
	"»": "&raquo;",
	"<": "&lt;",
	">": "&gt;",
};

/**
 * Encodes a separator.
 * @param {string} decodedSeparator The separator to encode.
 * @returns {string} The encoded separator.
 */
export const encodeSeparator = ( decodedSeparator ) => {
	return SEPARATORS[ decodedSeparator ] ?? decodedSeparator;
};

/**
 * Decodes a separator.
 * @param {string} encodedSeparator The separator to decode.
 * @returns {string} The decoded separator.
 */
export const decodeSeparator = ( encodedSeparator ) => {
	return findKey( SEPARATORS, value => value === encodedSeparator ) ?? encodedSeparator;
};
