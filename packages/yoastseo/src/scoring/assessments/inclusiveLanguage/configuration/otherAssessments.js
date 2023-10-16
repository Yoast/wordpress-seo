import { SCORES } from "./scores";
import { potentiallyHarmfulUnlessAnimalsObjects } from "./feedbackStrings";

const otherAssessments = [
	{
		identifier: "minorities",
		nonInclusivePhrases: [ "minorities" ],
		inclusiveAlternatives: [ "<i>members of the LGBTQ+ community</i>", "<i>Indigenous peoples</i>", "<i>marginalized groups</i>",
			"<i>religious minorities</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially overgeneralizing. Consider using an alternative" +
			" by being specific about which group(s) of people you are referring to. For example: %2$s, %3$s, %4$s. " +
			"In case an alternative is not available, make sure to specify the type of minorities you are referring to, e.g., %5$s.",
	},
	{
		identifier: "normal",
		nonInclusivePhrases: [ "normal person", "normal people", "mentally normal", "psychologically normal" ],
		inclusiveAlternatives: [ "<i>typical</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>normal</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s or a specific characteristic or experience if it is known.",
	},
	{
		identifier: "behaviorallyNormal",
		nonInclusivePhrases: [ "behaviorally normal", "behaviourally normal" ],
		inclusiveAlternatives: [ "<i>showing typical behavior</i> or a specific characteristic or experience if it is known" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessAnimalsObjects,
	},
	{
		identifier: "abnormal",
		nonInclusivePhrases: [ "abnormal person", "abnormal people", "mentally abnormal", "psychologically abnormal" ],
		inclusiveAlternatives: [ "<i>atypical</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>abnormal</i> as it is potentially harmful. " +
			"Consider using an alternative, such as %2$s or a specific characteristic or experience if it is known.",
	},
	{
		identifier: "behaviorallyAbnormal",
		nonInclusivePhrases: [ "behaviorally abnormal", "behaviourally abnormal" ],
		inclusiveAlternatives: [ "<i>showing atypical behavior, showing dysfunctional behavior</i> " +
		"or a specific characteristic or experience if it is known" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessAnimalsObjects,
	},
	{
		identifier: "abnormalBehavior",
		nonInclusivePhrases: [ "abnormal behavior", "abnormal behaviour" ],
		inclusiveAlternatives: [ "<i>atypical behavior, unusual behavior</i> " +
		"or a specific characteristic or experience if it is known" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessAnimalsObjects,
	},
];

otherAssessments.forEach( assessment => {
	assessment.category = "other";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-other";
} );

export default otherAssessments;
