import { potentiallyHarmful,
	potentiallyHarmfulUnless,
	preferredDescriptorIfKnown,
} from "./feedbackStrings";
import { SCORES } from "./scores";

const learnMoreUrl = "https://yoa.st/inclusive-language-appearance";

// This string says "Alternatively, if talking about a specific person, use their preferred descriptor if known, for example <i>plus-size</i>.
const preferredDescriptorIfKnownPlusSize = [ preferredDescriptorIfKnown.slice( 0, -1 ) + ", for example <i>plus-size</i>." ];

const appearanceAssessments = [
	{
		identifier: "albinos",
		nonInclusivePhrases: [ "albinos" ],
		inclusiveAlternatives: "people with albinism, albino people",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "obese",
		nonInclusivePhrases: [ "obese", "overweight" ],
		inclusiveAlternatives: "<i>has a higher weight, " +
			"higher-weight person, person in higher weight body, heavier person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful, preferredDescriptorIfKnownPlusSize ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "obesitySingular",
		nonInclusivePhrases: [ "person with obesity", "fat person" ],
		inclusiveAlternatives: "<i>person who has a higher weight, " +
			"higher-weight person, person in higher weight body, heavier person</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, preferredDescriptorIfKnownPlusSize ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "obesityPlural",
		nonInclusivePhrases: [ "people with obesity", "fat people" ],
		inclusiveAlternatives: "<i>people who have a higher weight, " +
			"higher-weight people, people in higher weight bodies, heavier people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless ].join( " " ),
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
