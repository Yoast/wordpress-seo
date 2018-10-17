// External dependencies.
import get from "lodash/get";

/**
 * Retrieves the content locale for the current page.
 *
 * @returns {string} The content locale. Defaults to en_US.
 */
export default function getDefaultQueryParams() {
	return get( window, [ "wpseoAdminL10n", "default_query_params" ], {} );
}
