import { potentiallyHarmful, potentiallyHarmfulUnless, preferredDescriptorIfKnown } from "./feedbackStrings";

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternatives: "a person with albinism, an albino person",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "fatPerson",
		nonInclusivePhrases: [ "fat person", "fat people" ],
		inclusiveAlternatives: "person/people who has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese" ],
		inclusiveAlternatives: "has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obesity",
		nonInclusivePhrases: [ "person with obesity", "people with obesity" ],
		inclusiveAlternatives: "person/people who has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "overweight",
		nonInclusivePhrases: [ "overweight" ],
		inclusiveAlternatives: "has/have a higher weight; " +
			"higher-weight person/people; person/people in higher weight body/bodies; heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternatives: "little person, has short stature, someone with dwarfism",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternatives: "little person, has short stature, someone with dwarfism",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternatives: "cleft lip, cleft palate",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default appearanceAssessments;
