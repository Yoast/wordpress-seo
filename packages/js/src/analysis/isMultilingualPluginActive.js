/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns the information on whether or not a multilingual plugin is currently active.
 *
 * @returns {boolean} Whether or not a multilingual plugin is currently active.
 */
export default function isMultilingualPluginActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "multilingualPluginActive", false );
}

