import { potentiallyHarmful, potentiallyHarmfulUnless, preferredDescriptorIfKnown } from "./feedbackStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";

const learnMoreUrl = "https://yoa.st/inclusive-language-appearance";

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternatives: "<i>people with albinism, albino people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "anAlbino",
		nonInclusivePhrases: [ "an albino" ],
		inclusiveAlternatives: "<i>people with albinism, albino people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese", "overweight" ],
		inclusiveAlternatives: "<i>has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "obesity",
		nonInclusivePhrases: [ "person with obesity", "people with obesity", "fat person", "fat people" ],
		inclusiveAlternatives: "<i>person/people who has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternatives: "<i>cleft lip, cleft palate</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
];

export default appearanceAssessments;
