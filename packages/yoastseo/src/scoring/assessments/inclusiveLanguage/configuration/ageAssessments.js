import { potentiallyHarmful, potentiallyHarmfulUnless, potentiallyHarmfulUnlessNonInclusive, harmfulNonInclusive } from "./feedbackStrings";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { isFollowedByException, isNotFollowedByException } from "../helpers/isFollowedByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";
import { nonNouns } from "../../../../languageProcessing/languages/en/config/functionWords";
import { isFollowedByParticiple } from "../helpers/isFollowedByParticiple";
import { punctuationRegexString } from "../../../../languageProcessing/helpers/sanitize/removePunctuation";

const specificAgeGroup = "Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>).";
const characteristicIfKnown = "Consider using an alternative, such as a specific characteristic or experience if it is known" +
	" (e.g. <i>has Alzheimer's</i>).";

const learnMoreUrl = "https://yoa.st/inclusive-language-age";

const punctuationList = punctuationRegexString.split( "" );

const assessments = [
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizen", "senior citizens" ],
		inclusiveAlternatives: "<i>older citizen(s)</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: "<i>older people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnlessNonInclusive, specificAgeGroup ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: "<i>older people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "senile",
		nonInclusivePhrases: [ "senile" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ harmfulNonInclusive, characteristicIfKnown ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "senility",
		nonInclusivePhrases: [ "senility" ],
		inclusiveAlternatives: "<i>dementia</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "seniors",
		nonInclusivePhrases: [ "seniors" ],
		inclusiveAlternatives: "<i>older people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( isPrecededByException( words, [ "high school", "college", "graduating", "juniors and" ] ) )
				.filter( isFollowedByException( words, nonInclusivePhrases, [ "in high school", "in college", "who are graduating" ] ) );
		},
	},
	{
		identifier: "theAged",
		nonInclusivePhrases: [ "the aged" ],
		inclusiveAlternatives: "<i>older people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, specificAgeGroup ].join( " " ),
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( ( ( index ) => {
					return isNotFollowedByException( words, nonInclusivePhrases, nonNouns )( index ) ||
					isFollowedByParticiple( words, nonInclusivePhrases )( index ) ||
					isNotFollowedByException( words, nonInclusivePhrases, punctuationList )( index );
				} ) );
		},
	},
];

export default assessments;
