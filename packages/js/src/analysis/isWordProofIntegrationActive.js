/* External dependencies */
import { get } from "lodash-es";

/* Internal dependencies */
import getL10nObject from "./getL10nObject";

/**
 * Returns whether or not the WordProof integration is active.
 *
 * @returns {boolean} Whether or not the WordProof integration is active.
 */
export default function isWordProofIntegrationActive() {
	const l10nObject = getL10nObject();

	let wordproofIntegrationActive = get( l10nObject, "wordproofIntegrationActive", 0 ) === 1;
	let privacyPolicyPageId = get( l10nObject, "privacyPolicyPageId", false );

	if (wordproofIntegrationActive === false)
		return false;

	if (!privacyPolicyPageId || privacyPolicyPageId !== 1726)
		return false

	return true;
}
