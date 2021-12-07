/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";
import { isFeatureEnabled } from "@yoast/feature-flag";

/**
 * Returns whether or not the Wincher integration is active.
 *
 * @returns {boolean} Whether or not the Wincher integration is active.
 */
export default function isWincherIntegrationActive() {
	const l10nObject = getL10nObject();

	if ( ! isFeatureEnabled( "WINCHER_INTEGRATION" ) ) {
		return false;
	}
	return get( l10nObject, "wincherIntegrationActive", 0 ) === 1;
}
