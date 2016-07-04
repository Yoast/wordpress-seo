/* global wpseoPostScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the l10n object for the current page, either term or post.
 *
 * @returns {Object}
 */
function getL10nObject() {
	var l10nObject = null;

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		l10nObject = window.wpseoPostScraperL10n;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		l10nObject = window.wpseoTermScraperL10n;
	}

	return l10nObject;
}

module.exports = getL10nObject;
