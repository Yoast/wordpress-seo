import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";

const specificAgeGroup = "Or, if possible, be specific about the group you are referring to (e.g. \"people older than 70\").";
const characteristicIfKnown = "Consider using a specific characteristic or experience if it is known.";

const assessments = [
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizen", "senior citizens" ],
		inclusiveAlternatives: "older persons/older people, older citizen(s)",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: "older persons/older people",
		score: 3,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: "part of the older population; older persons/older people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, specificAgeGroup ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "senile",
		nonInclusivePhrases: [ "senile" ],
		inclusiveAlternatives: "specify the mental disorder (e.g. has Alzheimer's)",
		score: 3,
		feedbackFormat: [ potentiallyHarmful, characteristicIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "senility",
		nonInclusivePhrases: [ "senility" ],
		inclusiveAlternatives: "dementia",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default assessments;
