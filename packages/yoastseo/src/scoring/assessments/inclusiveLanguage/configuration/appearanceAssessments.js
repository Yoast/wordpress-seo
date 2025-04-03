import { redHarmful,
	orangeUnlessSomeoneWants,
	preferredDescriptorIfKnown,
} from "./feedbackStrings/generalFeedbackStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";
import { nonInclusiveWhenStandalone } from "../helpers/createRuleDescriptions";

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternatives: "<i>people with albinism, albino people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "anAlbino",
		nonInclusivePhrases: [ "an albino" ],
		inclusiveAlternatives: "<i>person with albinism, albino person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
		ruleDescription: nonInclusiveWhenStandalone,
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese", "overweight" ],
		inclusiveAlternatives: "<i>has a higher weight, " +
			"higher-weight person, person in higher weight body, heavier person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, preferredDescriptorIfKnown ].join( " " ),
	},
	{
		identifier: "obesitySingular",
		nonInclusivePhrases: [ "person with obesity", "fat person" ],
		inclusiveAlternatives: "<i>person who has a higher weight, " +
			"higher-weight person, person in higher weight body, heavier person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, preferredDescriptorIfKnown ].join( " " ),
	},
	{
		identifier: "obesityPlural",
		nonInclusivePhrases: [ "people with obesity", "fat people" ],
		inclusiveAlternatives: "<i>people who have a higher weight, " +
			"higher-weight people, people in higher weight bodies, heavier people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants ].join( " " ),
	},
	{
		identifier: "verticallyChallenged",
		nonInclusivePhrases: [ "vertically challenged" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "midget",
		nonInclusivePhrases: [ "midget" ],
		inclusiveAlternatives: "<i>little person, has short stature, someone with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "midgets",
		nonInclusivePhrases: [ "midgets" ],
		inclusiveAlternatives: "<i>little people, have short stature, people with dwarfism</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "harelip",
		nonInclusivePhrases: [ "harelip" ],
		inclusiveAlternatives: "<i>cleft lip, cleft palate</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
];

appearanceAssessments.forEach( assessment => {
	assessment.category = "appearance";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-appearance";
} );

export default appearanceAssessments;
