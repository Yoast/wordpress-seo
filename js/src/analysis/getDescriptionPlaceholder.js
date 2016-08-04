var getL10nObject = require( './getL10nObject' );

/**
 * Returns the description placeholder for use in the description forms.
 *
 * @returns {string}
 */
function getDescriptionPlaceholder( l10n ) {
	var descriptionPlaceholder = '';
	var l10nObject = getL10nObject();

	if ( l10nObject ) {
		descriptionPlaceholder = l10nObject.metadesc_template;
	}

	return descriptionPlaceholder;
}

module.exports = getDescriptionPlaceholder;
