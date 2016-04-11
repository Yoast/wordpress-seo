/* global wpseoPostScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string}
 */
function getDescriptionPlaceholder( l10n ) {
	var descriptionPlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		descriptionPlaceholder = window.wpseoPostScraperL10n.metadesc_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		descriptionPlaceholder = window.wpseoTermScraperL10n.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;
