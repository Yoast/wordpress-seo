/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns the Wincher website ID
 *
 * @returns {boolean} The Wincher website ID.
 */
export default function wincherWebsiteId() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "wincherWebsiteId", 0 );
}
