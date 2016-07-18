/* global wpseoPostScraperL10n, wpseoTermScraperL10n */

var getL10nObject = require( './getL10nObject' );

/**
 * Returns the title placeholder for use in the title forms.
 *
 * @returns {string}
 */
function getTitlePlaceholder() {
	var titlePlaceholder = '';
	var l10nObject = getL10nObject();

	if ( l10nObject ) {
		titlePlaceholder = l10nObject.title_template;
	}

	if ( titlePlaceholder === '' ) {
		titlePlaceholder = '%%title%% - %%sitename%%';
	}

	return titlePlaceholder;
}

module.exports = getTitlePlaceholder;
