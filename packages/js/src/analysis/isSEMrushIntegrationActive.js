/* External dependencies */
import { get } from "lodash";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns whether or not the SEMrush integration is active.
 *
 * @returns {boolean} Whether or not the SEMrush integration is active.
 */
export default function isSEMrushIntegrationActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "semrushIntegrationActive", false ) === true;
}
