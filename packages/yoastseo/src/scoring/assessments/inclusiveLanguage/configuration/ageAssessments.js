import { potentiallyHarmful, potentiallyHarmfulUnless, potentiallyHarmfulUnlessNonInclusive, harmfulNonInclusive } from "./feedbackStrings";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";

/*
 * The last sentence of strings for the non-inclusive terms for 'older people/person'.
 *
 * "Or, if possible, be specific about the group you are referring to (e.g. %3$s)."
 */
const specificAgeGroup = "Or, if possible, be specific about the group you are referring to (e.g. %3$s).";
/*
 * Used to suggest an alternative for 'senile'.
 *
 * "Consider using an alternative, such as a specific characteristic or experience if it is known (e.g. <i>has Alzheimer's</i>)."
 */
const characteristicIfKnown = "Consider using an alternative, such as a specific characteristic or experience if it is known" +
	" (e.g. <i>has Alzheimer's</i>).";

const ageAssessments = [
	{
		identifier: "seniorCitizen",
		nonInclusivePhrases: [ "senior citizen" ],
		inclusiveAlternatives: [ "<i>older person, older citizen</i>", "<i>person older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizens" ],
		inclusiveAlternatives: [ "<i>older people, older citizens</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnlessNonInclusive, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "senile",
		nonInclusivePhrases: [ "senile" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ harmfulNonInclusive, characteristicIfKnown ].join( " " ),
	},
	{
		identifier: "senility",
		nonInclusivePhrases: [ "senility" ],
		inclusiveAlternatives: "<i>dementia</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "seniors",
		nonInclusivePhrases: [ "seniors" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isPrecededByException( words, [ "high school", "college", "graduating", "juniors and" ] ) )
				.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "in high school", "in college", "who are graduating" ] ) );
		},
	},
	{
		identifier: "theAged",
		nonInclusivePhrases: [ "the aged" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, specificAgeGroup ].join( " " ),
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
];

ageAssessments.forEach( assessment => {
	assessment.category = "age";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-age";
} );

export default ageAssessments;
