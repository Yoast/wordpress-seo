import { SCORES } from "./scores";
import { potentiallyHarmful, potentiallyHarmfulCareful } from "./feedbackStrings";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";

const otherAssessments = [
	{
		identifier: "homosexuals",
		nonInclusivePhrases: [ "homosexuals" ],
		inclusiveAlternatives: "<i>gay men, queer people, lesbians</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it may overgeneralize or be harmful. " +
						"Instead, be specific about the group you are referring to (e.g. %2$s).",
	},
	{
		identifier: "minorities",
		nonInclusivePhrases: [ "minorities" ],
		inclusiveAlternatives: [ "<i>marginalized groups</i>", "<i>underrepresented groups</i>", "<i>gender and sexuality minorities</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially overgeneralizing. " +
						"Consider using an alternative, such as %2$s, %3$s or specific minorities, such as %4$s.",
	},
	{
		identifier: "ex-con",
		nonInclusivePhrases: [ "ex-con", "ex-cons" ],
		inclusiveAlternatives: "<i>people who have had felony convictions, people who have been incarcerated</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "felon",
		nonInclusivePhrases: [ "felon", "felons" ],
		inclusiveAlternatives: "<i>people with felony convictions, people who have been incarcerated</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
	},
	{
		identifier: "ex-offender",
		nonInclusivePhrases: [ "ex-offender", "ex-offenders" ],
		inclusiveAlternatives: "<i>formerly incarcerated person</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
];

otherAssessments.forEach( assessment => {
	assessment.category = "other";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-other";
} );

export default otherAssessments;
