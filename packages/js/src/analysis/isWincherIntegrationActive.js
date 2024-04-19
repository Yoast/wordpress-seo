/* External dependencies */
import { get } from "lodash";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns whether or not the Wincher integration is active.
 *
 * @returns {boolean} Whether or not the Wincher integration is active.
 */
export default function isWincherIntegrationActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "wincherIntegrationActive", false ) === true;
}
