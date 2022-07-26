import { potentiallyHarmful, potentiallyHarmfulNonInclusive, potentiallyHarmfulUnless, preferredDescriptorIfKnown } from "./feedbackStrings";
import { SCORES } from "./scores";

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternatives: "people with albinism, albino people",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese", "overweight" ],
		inclusiveAlternatives: "\"has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people\"",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obesity",
		nonInclusivePhrases: [ "person with obesity", "people with obesity", "fat person", "fat people" ],
		inclusiveAlternatives: "\"person/people who has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people\"",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternatives: "\"little person, has short stature, someone with dwarfism\"",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulNonInclusive,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternatives: "\"little person, has short stature, someone with dwarfism\"",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulNonInclusive,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternatives: "\"cleft lip, cleft palate\"",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulNonInclusive,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default appearanceAssessments;
