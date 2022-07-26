import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";

const sesAssessments = [
	{
		identifier: "illegalImmigrants",
		nonInclusivePhrases: [ "illegal immigrants", "illegal aliens" ],
		inclusiveAlternatives: "people who are undocumented, undocumented people",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "povertyStricken",
		nonInclusivePhrases: [ "poverty stricken" ],
		inclusiveAlternatives: "people whose income is below the poverty threshold, people with low-income",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "welfareReliant",
		nonInclusivePhrases: [ "welfare reliant" ],
		inclusiveAlternatives: "receiving welfare",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "prostitute",
		nonInclusivePhrases: [ "prostitute" ],
		inclusiveAlternatives: "sex worker",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default sesAssessments;
