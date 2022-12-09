import { potentiallyHarmful,
	potentiallyHarmfulUnless,
	preferredDescriptorIfKnown,
} from "./feedbackStrings";
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
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese", "overweight" ],
		inclusiveAlternatives: "<i>has a higher weight, " +
			"higher-weight person, person in higher weight body, heavier person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
	},
	{
		identifier: "obesitySingular",
		nonInclusivePhrases: [ "person with obesity", "fat person" ],
		inclusiveAlternatives: "<i>person who has a higher weight, " +
			"higher-weight person, person in higher weight body, heavier person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnown ].join( " " ),
	},
	{
		identifier: "obesityPlural",
		nonInclusivePhrases: [ "people with obesity", "fat people" ],
		inclusiveAlternatives: "<i>people who have a higher weight, " +
			"higher-weight people, people in higher weight bodies, heavier people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless ].join( " " ),
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
		identifier: "midgets",
		nonInclusivePhrases: [ "midgets" ],
		inclusiveAlternatives: "<i>little people, have short stature, people with dwarfism</i>",
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
