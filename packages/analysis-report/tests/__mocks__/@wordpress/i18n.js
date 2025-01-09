/* eslint-disable jsdoc/require-jsdoc */

import { sprintf, setLocaleData } from "@wordpress/i18n";

function __( string ) {
	return string;
}

function _x( string ) {
	return string;
}

function isRTL() {
	return false;
}

// Mock works for English, because our source translations are in English.
function _n( single, plural, number ) {
	if ( number === 1 ) {
		return single;
	}

	return plural;
}

function _nx( single, plural, number ) {
	// eslint-disable-next-line no-restricted-syntax
	return _n( single, plural, number );
}

export {
	__,
	_x,
	isRTL,
	_n,
	_nx,
	setLocaleData,
	sprintf,
};
