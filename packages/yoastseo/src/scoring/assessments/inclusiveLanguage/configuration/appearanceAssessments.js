import { potentiallyHarmful, potentiallyHarmfulUnless, preferredDescriptorIfKnown } from "./feedbackStrings";

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternative: "a person with albinism; an albino person",
		score: 6,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "fatPerson",
		nonInclusivePhrases: [ "fat person", "fat people" ],
		inclusiveAlternative: "person/people who has/have a higher weight; " +
			"higher-weight person/people; person/people in higher weight body/bodies; heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese" ],
		inclusiveAlternative: "has/have a higher weight; " +
			"higher-weight person/people; person/people in higher weight body/bodies; heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "obesity",
		nonInclusivePhrases: [ "person/people with obesity" ],
		inclusiveAlternative: "person/people who has/have a higher weight; " +
			"higher-weight person/people; person/people in higher weight body/bodies; heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "overweight",
		nonInclusivePhrases: [ "overweight" ],
		inclusiveAlternative: "has/have a higher weight; " +
			"higher-weight person/people; person/people in higher weight body/bodies; heavier person/people",
		score: 6,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternative: "little person, has short stature, someone with dwarfism",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternative: "little person, has short stature, someone with dwarfism",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternative: "cleft lip, cleft palate",
		score: 3,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default appearanceAssessments;
