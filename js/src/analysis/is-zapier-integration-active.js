/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./get-l10n-object";

/**
 * Returns whether the Zapier integration is active.
 *
 * @returns {boolean} Whether the Zapier integration is active.
 */
export default function isZapierIntegrationActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "zapierIntegrationActive", 0 ) === 1;
}
