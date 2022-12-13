import { SCORES } from "./scores";

const otherAssessments = [
	{
		identifier: "minorities",
		nonInclusivePhrases: [ "minorities" ],
		inclusiveAlternatives: [ "<i>marginalized groups</i>", "<i>underrepresented groups</i>", "<i>gender and sexuality minorities</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially overgeneralizing. " +
						"Consider using an alternative, such as %2$s, %3$s or specific minorities, such as %4$s.",
	},
	{
		identifier: "normal",
		nonInclusivePhrases: [ "normal person", "normal people", "normal behaviour", "normal behavior", "mentally" +
		" normal", "behaviorally normal", "behaviourally normal", "psychologically normal"  ],
		inclusiveAlternatives: [ "<i>typical</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>normal</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s or a specific characteristic or experience if it is known.",
	},
	{
		identifier: "abnormal",
		nonInclusivePhrases: [ "abnormal person", "abnormal people", "abnormal behaviour", "abnormal behavior", "mentally" +
		" abnormal", "behaviorally abnormal", "behaviourally abnormal", "psychologically abnormal"  ],
		inclusiveAlternatives: [ "<i>atypical</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>abnormal</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s or a specific characteristic or experience if it is known.",
	},
];

otherAssessments.forEach( assessment => {
	assessment.category = "other";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-other";
} );

export default otherAssessments;
