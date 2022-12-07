import { SCORES } from "./scores";

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
];

otherAssessments.forEach( assessment => {
	assessment.category = "other";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-other";
} );

export default otherAssessments;
