/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns whether the Zapier integration is connected.
 *
 * @returns {boolean} Whether the Zapier integration is connected.
 */
export default function isZapierConnected() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "zapierConnectedStatus", 0 ) === 1;
}
