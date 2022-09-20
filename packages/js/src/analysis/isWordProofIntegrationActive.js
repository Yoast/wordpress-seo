/* External dependencies */
import { get } from "lodash";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns whether or not the WordProof integration is active.
 *
 * @returns {boolean} Whether or not the WordProof integration is active.
 */
export default function isWordProofIntegrationActive() {
	const l10nObject = getL10nObject();

	return get( l10nObject, "wordproofIntegrationActive", 0 ) === 1;
}
