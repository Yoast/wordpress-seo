import { potentiallyHarmful, potentiallyHarmfulUnless, potentiallyHarmfulUnlessNonInclusive, harmfulNonInclusive } from "./feedbackStrings";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { isFollowedByException } from "../helpers/isFollowedByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";

const specificAgeGroup = "Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\").";
const characteristicIfKnown = "Consider using an alternative, such as a specific characteristic or experience if it is known (e.g. <i>has Alzheimer's</i>).";

const assessments = [
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizen", "senior citizens" ],
		inclusiveAlternatives: "\"older citizen(s)\"",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: "\"older people\"",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnlessNonInclusive, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: "\"older people\"",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "senile",
		nonInclusivePhrases: [ "senile" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ harmfulNonInclusive, characteristicIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "senility",
		nonInclusivePhrases: [ "senility" ],
		inclusiveAlternatives: "\"dementia\"",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "seniors",
		nonInclusivePhrases: [ "seniors" ],
		inclusiveAlternatives: "\"older people\"",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
		rule: ( words, inclusivePhrases ) => {
			return includesConsecutiveWords( words, inclusivePhrases )
				.filter( isPrecededByException( words, [ "high school", "college", "graduating", "juniors and" ] ) )
				.filter( isFollowedByException( words, inclusivePhrases, [ "in high school", "in college", "who are graduating" ] ) );
		},
	},
];

export default assessments;
