import { SCORES } from "./scores";
import { potentiallyHarmful, potentiallyHarmfulCareful } from "./feedbackStrings";

const otherAssessments = [
	{
		identifier: "homosexuals",
		nonInclusivePhrases: [ "homosexuals" ],
		inclusiveAlternatives: "gay men, queer people, lesbians",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using \"%1$s\" as it may overgeneralize or be harmful. " +
						"Instead, be specific about the group you are referring to (e.g. \"%2$s\").",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "minorities",
		nonInclusivePhrases: [ "minorities" ],
		inclusiveAlternatives: [ "underrepresented groups", "gender and sexuality minorities" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using \"%1$s\" as it is potentially overgeneralizing. " +
						"Consider using an alternative, such as \"%2$s\" or specific minorities, such as \"%3$s\" instead.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "ex-con",
		nonInclusivePhrases: [ "ex-con", "ex-cons" ],
		inclusiveAlternatives: "people who have had felony convictions, people who have been incarcerated",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "felon",
		nonInclusivePhrases: [ "felon", "felons" ],
		inclusiveAlternatives: "people with felony convictions, people who have been incarcerated",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "ex-offender",
		nonInclusivePhrases: [ "ex-offender", "ex-offenders" ],
		inclusiveAlternatives: "formally incarcerated person",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default otherAssessments;
