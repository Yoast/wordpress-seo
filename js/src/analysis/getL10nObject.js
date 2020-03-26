import { isUndefined } from "lodash-es";

/**
 * Returns the l10n object for the current page, either term or post.
 *
 * @returns {Object} The l10n object for the current page.
 */
function getL10nObject() {
	var l10nObject = null;

	if ( ! isUndefined( window.wpseoScriptData ) && ! isUndefined( window.wpseoScriptData.metabox ) ) {
		l10nObject = window.wpseoScriptData.metabox;
	}

	return l10nObject;
}

module.exports = getL10nObject;
