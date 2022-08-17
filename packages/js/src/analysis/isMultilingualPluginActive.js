/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns whether or not the SEMrush integration is active.
 *
 * @returns {boolean} Whether or not the SEMrush integration is active.
 */
export default function isMultilingualPluginActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "multilingualPluginActive", false );
}

