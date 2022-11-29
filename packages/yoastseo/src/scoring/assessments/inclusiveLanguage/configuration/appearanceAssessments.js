import { potentiallyHarmful, potentiallyHarmfulUnless, preferredDescriptorIfKnown } from "./feedbackStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternatives: "<i>people with albinism, albino people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
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
	},
	{
		identifier: "obesity",
		nonInclusivePhrases: [ "person with obesity", "people with obesity", "fat person", "fat people" ],
		inclusiveAlternatives: "<i>person/people who has/have a higher weight, " +
			"higher-weight person/people, person/people in higher weight body/bodies, heavier person/people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnown ].join( " " ),
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternatives: "<i>cleft lip, cleft palate</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
];

appearanceAssessments.forEach( assessment => {
	assessment.category = "appearance";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-appearance";
} );

export default appearanceAssessments;
