import { isFollowedByException } from "./isFollowedByException";
import { isFollowedByParticiple } from "./isFollowedByParticiple";
import { nonNouns } from "../../../../languageProcessing/languages/en/config/functionWords";
import { punctuationList } from "../../../../languageProcessing/helpers/sanitize/removePunctuation";

/**
 * A
 * @param {string[]} words A
 * @param {string[]} nonInclusivePhrase A
 * @returns {function} A
 */
export default function notInclusiveWhenStandalone( words, nonInclusivePhrase ) {
	return ( index ) => {
		return isFollowedByException( words, nonInclusivePhrase, nonNouns )( index ) ||
        isFollowedByParticiple( words, nonInclusivePhrase )( index ) ||
        isFollowedByException( words, nonInclusivePhrase, punctuationList )( index );
	};
}
