// External dependencies.
import get from "lodash/get";

// Internal dependencies.
import getL10nObject from "./getL10nObject";


/**
 * Retrieves the content locale for the current page.
 *
 * @returns {string} The content locale. Defaults to en_US.
 */
export default function getContentLocale() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "contentLocale", "en_US" );
}
