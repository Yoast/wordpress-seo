/* global wpseoPostScraperL10n, wpseoTermScraperL10n */

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string}
 */
function getTitlePlaceholder() {
	var titlePlaceholder = '';

	if ( ! isUndefined( window.wpseoPostScraperL10n ) ) {
		titlePlaceholder = window.wpseoPostScraperL10n.title_template;
	} else if ( ! isUndefined( window.wpseoTermScraperL10n ) ) {
		titlePlaceholder = window.wpseoTermScraperL10n.title_template;
	}

	if ( titlePlaceholder === '' ) {
		titlePlaceholder = '%%title%% - %%sitename%%';
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;
