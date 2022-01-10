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

	const wordproofIntegrationActive = get( l10nObject, "wordproofIntegrationActive", 0 ) === 1;
	const currentPostIsPrivacyPolicyPage = get( l10nObject, "currentPostIsPrivacyPolicyPage", 0 ) === 1;

	if (wordproofIntegrationActive === true && currentPostIsPrivacyPolicyPage === true)
		return true;

	return false;
}
