var getL10nObject = require( './getL10nObject' );

var isUndefined = require( 'lodash/isUndefined' );

/**
 * Returns whether or not the content analysis is active
 */
function isKeywordAnalysisActive() {
	var l10nObject = getL10nObject();

	return ! isUndefined( l10nObject ) && l10nObject.keywordAnalysisActive === '1'
}

module.exports = isKeywordAnalysisActive;
