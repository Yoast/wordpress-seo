var getTranslations = require( './getTranslations' );
var isEmpty = require( 'lodash/isEmpty' );
var Jed = require( 'jed' );

/**
 * Returns a Jed object usable in YoastSEO.js
 *
 * @returns {Jed} A usable i18n translations object.
 */
function getI18n() {
	"use strict";

	var translations = getTranslations();
	var i18n = new Jed( translations );

	if ( isEmpty( translations ) ) {
		i18n = new Jed( {
			"domain": "js-text-analysis",
			"locale_data": {
				"js-text-analysis": {
					"": {}
				}
			}
		} );
	}

	return i18n;
}

module.exports = getI18n;
