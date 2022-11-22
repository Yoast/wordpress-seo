import { potentiallyHarmful, potentiallyHarmfulUnless, potentiallyHarmfulUnlessNonInclusive, harmfulNonInclusive } from "./feedbackStrings";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { isFollowedByException } from "../helpers/isFollowedByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";

const specificAgeGroup = "Or, if possible, be specific about the group you are referring to (e.g. <i>people older than 70</i>).";
const characteristicIfKnown = "Consider using an alternative, such as a specific characteristic or experience if it is known" +
	" (e.g. <i>has Alzheimer's</i>).";

const assessments = [
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizen", "senior citizens" ],
		inclusiveAlternatives: "<i>older citizen(s)</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: "<i>older people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnlessNonInclusive, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: "<i>older people</i>",
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
		inclusiveAlternatives: "<i>older people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		rule: ( words, inclusivePhrases ) => {
			return includesConsecutiveWords( words, inclusivePhrases )
				.filter( isPrecededByException( words, [ "high school", "college", "graduating", "juniors and" ] ) )
				.filter( isFollowedByException( words, inclusivePhrases, [ "in high school", "in college", "who are graduating" ] ) );
		},
	},
];

assessments.forEach( assessment => {
	assessment.id = "age";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-age";
} );

export default assessments;
