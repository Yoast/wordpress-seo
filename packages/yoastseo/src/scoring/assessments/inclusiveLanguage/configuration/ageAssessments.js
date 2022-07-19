import { potentiallyHarmful, potentiallyHarmfulUnless, potentiallyHarmfulUnlessNonInclusive } from "./feedbackStrings";
import { isPrecededByException } from "../helpers/isPrecededByException";
import { isFollowedByException } from "../helpers/isFollowedByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";

const specificAgeGroup = "Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\").";
const characteristicIfKnown = "Consider using an alternative, such as a specific characteristic or experience if it is known.";

const assessments = [
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizen", "senior citizens" ],
		inclusiveAlternatives: "older persons/older people, older citizen(s)",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: "older persons/older people",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnlessNonInclusive, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: "part of the older population, older persons/older people",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "senile",
		nonInclusivePhrases: [ "senile" ],
		inclusiveAlternatives: "specify the mental disorder (e.g. has Alzheimer's)",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, characteristicIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "senility",
		nonInclusivePhrases: [ "senility" ],
		inclusiveAlternatives: "dementia",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "seniors",
		nonInclusivePhrases: [ "seniors" ],
		inclusiveAlternatives: "older persons/people",
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
