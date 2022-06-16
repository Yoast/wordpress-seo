import getL10nObject from "./getL10nObject";

import { get } from "lodash-es";

/**
 * Returns whether or not the analysis is active for taxonomies.
 *
 * @returns {boolean} Whether or not the taxonomy analysis is active.
 */
export default function isTaxonomyAnalysisActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "isTerm", 0 ) === 1;
}
