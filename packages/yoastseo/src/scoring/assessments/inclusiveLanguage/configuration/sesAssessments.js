import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";

const sesAssessments = [
	{
		identifier: "illegalImmigrants",
		nonInclusivePhrases: [ "illegal immigrants", "illegal aliens" ],
		inclusiveAlternatives: "<i>undocumented people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "povertyStricken",
		nonInclusivePhrases: [ "poverty stricken" ],
		inclusiveAlternatives: "<i>people whose income is below the poverty threshold, people with low-income</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "welfareReliant",
		nonInclusivePhrases: [ "welfare reliant" ],
		inclusiveAlternatives: "<i>receiving welfare</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "prostitute",
		nonInclusivePhrases: [ "prostitute" ],
		inclusiveAlternatives: "<i>sex worker</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
];

sesAssessments.forEach( assessment => {
	assessment.category = "ses";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-ses";
} );

export default sesAssessments;
