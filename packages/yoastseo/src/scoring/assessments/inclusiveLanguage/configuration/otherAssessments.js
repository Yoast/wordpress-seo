import { SCORES } from "./scores";
import {
	harmfulNonInclusive,
	harmfulPotentiallyNonInclusive,
	potentiallyHarmful,
	potentiallyHarmfulUnlessAnimalsObjects,
} from "./feedbackStrings";

const otherAssessments = [
	{
		identifier: "minorities",
		nonInclusivePhrases: [ "minorities" ],
		inclusiveAlternatives: [ "<i>members of the LGBTQ+ community</i>", "<i>Indigenous peoples</i>", "<i>marginalized groups</i>",
			"<i>religious minorities</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ harmfulPotentiallyNonInclusive, "Consider using an alternative" +
			" by being specific about which group(s) of people you are referring to. For example: %2$s, %3$s, %4$s. " +
			"In case an alternative is not available, make sure to specify the type of minorities you are referring to, e.g., %5$s." ].join( " " ),
	},
	{
		identifier: "normalPerson",
		nonInclusivePhrases: [ "normal person" ],
		inclusiveAlternatives: [ "<i>typical person, average person</i> or describing the specific characteristic, " +
		"experience, or behavior" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "normalPeople",
		nonInclusivePhrases: [ "normal people", "Normal people" ],
		inclusiveAlternatives: [ "<i>typical people, average people</i> or describing the specific characteristics, " +
		"experiences, or behaviors" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		caseSensitive: true,
	},
	{
		identifier: "mentallyNormal",
		nonInclusivePhrases: [ "mentally normal" ],
		inclusiveAlternatives: [ "<i>people without mental health conditions</i>, <i>people with a good mental health</i>," +
		" <i>mentally healthy people</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ harmfulNonInclusive, "Consider using an alternative, such as %2$s. If possible, be more specific," +
		" for example <i>people who don’t have anxiety disorders</i>, <i>people who haven’t experienced trauma</i>, etc." +
		" Be careful when using mental health descriptors to describe specific people, and try to avoid making assumptions" +
		" about someone’s mental health or attempting to diagnose them." ].join( " " ),
	},
	{
		identifier: "behaviorallyNormal",
		nonInclusivePhrases: [ "behaviorally normal", "behaviourally normal" ],
		inclusiveAlternatives: [ "<i>showing typical behavior</i> or describing the specific behavior" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessAnimalsObjects,
	},
	{
		identifier: "abnormalPerson",
		nonInclusivePhrases: [ "abnormal person" ],
		inclusiveAlternatives: [ "describing the person's specific characteristic, experience, or behavior" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "abnormalPeople",
		nonInclusivePhrases: [ "abnormal people" ],
		inclusiveAlternatives: [ "describing the people's specific characteristics, experiences, or behaviors" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "mentallyAbnormal",
		nonInclusivePhrases: [ "mentally abnormal" ],
		inclusiveAlternatives: [ "<i>people with a mental health condition</i>, <i>people with mental health problems</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ harmfulNonInclusive, "Consider using an alternative, such as %2$s. If possible, be more specific," +
		" for example <i>people who have anxiety disorders, people who have experienced trauma</i>, etc." +
		" Be careful when using mental health descriptors to describe specific people, and try to avoid making assumptions" +
		" about someone’s mental health or attempting to diagnose them." ].join( " " ),
	},
	{
		identifier: "behaviorallyAbnormal",
		nonInclusivePhrases: [ "behaviorally abnormal", "behaviourally abnormal" ],
		inclusiveAlternatives: [ "<i>showing atypical behavior, showing dysfunctional behavior</i> " +
		"or describing the specific behavior" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessAnimalsObjects,
	},
	{
		identifier: "abnormalBehavior",
		nonInclusivePhrases: [ "abnormal behavior", "abnormal behaviour" ],
		inclusiveAlternatives: [ "<i>atypical behavior, unusual behavior</i> " +
		"or describing the specific behavior" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessAnimalsObjects,
	},
];

otherAssessments.forEach( assessment => {
	assessment.category = "other";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-other";
} );

export default otherAssessments;
