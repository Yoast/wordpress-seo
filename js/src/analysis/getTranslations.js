var getL10nObject = require( "./getL10nObject" );

var isUndefined = require( "lodash/isUndefined" );

/**
 * Retrieves translations for YoastSEO.js for the current page, either term or post.
 *
 * @returns {Object} The translations object for the current page.
 */
function getTranslations() {
	var l10nObject = getL10nObject();
	var translations = l10nObject.translations;

	if ( ! isUndefined( translations ) && ! isUndefined( translations.domain ) ) {
		translations.domain = "js-text-analysis";
		translations.locale_data[ "js-text-analysis" ] = translations.locale_data[ "wordpress-seo" ];
		delete( translations.locale_data[ "wordpress-seo" ] );
	}

	return translations;
}

module.exports = getTranslations;
