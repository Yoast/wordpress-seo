import { redHarmful, orangeUnlessSomeoneWants } from "./feedbackStrings/generalFeedbackStrings";
import { specificAgeGroup } from "./feedbackStrings/ageAssessmentStrings";
import { isNotPrecededByException } from "../helpers/isPrecededByException";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { SCORES } from "./scores";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";
import { nonInclusiveWhenStandalone, notPrecededAndNotFollowed } from "../helpers/createRuleDescriptions";

const ageAssessments = [
	{
		identifier: "seniorCitizen",
		nonInclusivePhrases: [ "senior citizen" ],
		inclusiveAlternatives: [ "<i>older person, older citizen</i>", "<i>person older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "seniorCitizens",
		nonInclusivePhrases: [ "senior citizens" ],
		inclusiveAlternatives: [ "<i>older people, older citizens</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "agingDependants",
		nonInclusivePhrases: [ "aging dependants" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "elderly",
		nonInclusivePhrases: [ "elderly" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, specificAgeGroup ].join( " " ),
	},
	{
		identifier: "senile",
		nonInclusivePhrases: [ "senile" ],
		inclusiveAlternatives: "a specific characteristic or experience if it is known (e.g. <i>has Alzheimer's</i>)",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "senility",
		nonInclusivePhrases: [ "senility" ],
		inclusiveAlternatives: "<i>dementia</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "seniors",
		nonInclusivePhrases: [ "seniors" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, specificAgeGroup ].join( " " ),
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isNotPrecededByException( words, [ "high school", "college", "graduating", "juniors and" ] ) )
				.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "in high school", "in college", "who are graduating" ] ) );
		},
		ruleDescription: notPrecededAndNotFollowed( [ "high school", "college", "graduating", "juniors and" ],
			[ "in high school", "in college", "who are graduating" ] ),
	},
	{
		identifier: "theAged",
		nonInclusivePhrases: [ "the aged" ],
		inclusiveAlternatives: [ "<i>older people</i>", "<i>people older than 70</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ redHarmful, specificAgeGroup ].join( " " ),
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
		ruleDescription: nonInclusiveWhenStandalone,
	},
];

ageAssessments.forEach( assessment => {
	assessment.category = "age";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-age";
} );

export default ageAssessments;
