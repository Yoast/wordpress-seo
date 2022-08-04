import { potentiallyHarmful, potentiallyHarmfulUnless, preferredDescriptorIfKnown } from "./feedbackStrings";
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
		inclusiveAlternatives: "<i>has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obesity",
		nonInclusivePhrases: [ "person with obesity", "people with obesity", "fat person", "fat people" ],
		inclusiveAlternatives: "<i>person/people who has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternatives: "<i>cleft lip, cleft palate</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default appearanceAssessments;
