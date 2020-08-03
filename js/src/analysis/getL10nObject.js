import { get } from "lodash-es";

/**
 * Returns the l10n object for the current page, either term or post.
 *
 * @returns {Object} The l10n object for the current page.
 */
export default function getL10nObject() {
	// Returns the metabox object from wpseoScriptData if that exists. Else; return "null-object".
	return get( window, "wpseoScriptData.metabox", { intl: {}, isRtl: false } );
}
