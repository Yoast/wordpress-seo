import { SCORES } from "./scores";

const sexualOrientationAssessments = [
	{
		identifier: "homosexuals",
		nonInclusivePhrases: [ "homosexuals" ],
		inclusiveAlternatives: "<i>gay men, queer people, lesbians</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it may overgeneralize or be harmful. " +
			"Instead, be specific about the group you are referring to (e.g. %2$s).",
	},
];

sexualOrientationAssessments.forEach( assessment => {
	assessment.category = "sexualOrientation";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-orientation";
} );

export default sexualOrientationAssessments;
