import { alternative,
	redHarmful,
	orangeNoUnless,
	orangeUnlessSomeoneWants,
	redExclusionary,
	orangeExclusionaryNoUnless,
	redPotentiallyExclusionary,
	avoidDerogatory,
} from "./feedbackStrings/generalFeedbackStrings";
import { orangeExclusionaryUnless,
	orangeExclusionaryUnlessMen,
	orangeExclusionaryUnlessMenAndWomen,
	orangeExclusionaryUnlessTwoGenders,
	orangeExclusionaryUnlessUseTheTerm,
} from "./feedbackStrings/genderAssessmentStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";
import { nonInclusiveWhenStandalone } from "../helpers/createRuleDescriptions";

const genderAssessments = [
	{
		identifier: "firemen",
		nonInclusivePhrases: [ "firemen" ],
		inclusiveAlternatives: "<i>firefighters</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnlessMen,
	},
	{
		identifier: "policemen",
		nonInclusivePhrases: [ "policemen" ],
		inclusiveAlternatives: "<i>police officers</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnlessMen,
	},
	{
		identifier: "menAndWomen",
		nonInclusivePhrases: [ "men and women", "women and men" ],
		inclusiveAlternatives: "<i>people, people of all genders, individuals, human beings</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnless,
	},
	{
		identifier: "boysAndGirls",
		nonInclusivePhrases: [ "boys and girls", "girls and boys" ],
		inclusiveAlternatives: "<i>kids, children</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnless,
	},
	{
		identifier: "heOrShe",
		nonInclusivePhrases: [ "he/she", "he or she", "she or he", "(s)he" ],
		inclusiveAlternatives: "<i>they</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryNoUnless,
	},
	{
		identifier: "birthSex",
		nonInclusivePhrases: [ "birth sex", "natal sex" ],
		inclusiveAlternatives: "<i>assigned sex, assigned sex at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "mankind",
		nonInclusivePhrases: [ "mankind" ],
		inclusiveAlternatives: "<i>individuals, people, persons, human beings, humanity</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "preferredPronouns",
		nonInclusivePhrases: [ "preferred pronouns" ],
		inclusiveAlternatives: "<i>pronouns</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeNoUnless.slice( 0, -1 ), ", unless referring to someone who explicitly wants to use" +
		" this term to describe their own pronouns." ].join( "" ),
	},
	{
		identifier: "oppositeGender",
		nonInclusivePhrases: [ "opposite gender" ],
		inclusiveAlternatives: "<i>another gender</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "oppositeSex",
		nonInclusivePhrases: [ "opposite sex" ],
		inclusiveAlternatives: "<i>another sex</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "femaleBodied",
		nonInclusivePhrases: [ "female-bodied" ],
		inclusiveAlternatives: "<i>assigned female at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redPotentiallyExclusionary.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>%1$s</i>.",
	},
	{
		identifier: "maleBodied",
		nonInclusivePhrases: [ "male-bodied" ],
		inclusiveAlternatives: "<i>assigned male at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redPotentiallyExclusionary.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>%1$s</i>.",
	},
	{
		identifier: "hermaphrodite",
		nonInclusivePhrases: [ "hermaphrodite" ],
		inclusiveAlternatives: "<i>intersex</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "hermaphrodites",
		nonInclusivePhrases: [ "hermaphrodites" ],
		inclusiveAlternatives: "<i>intersex people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "bothGenders",
		nonInclusivePhrases: [ "both genders" ],
		inclusiveAlternatives: "<i>people, folks, human beings, all genders</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnlessTwoGenders,
	},
	{
		identifier: "ladiesAndGentleman",
		nonInclusivePhrases: [ "ladies and gentlemen" ],
		inclusiveAlternatives: "<i>everyone, folks, honored guests</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnlessMenAndWomen,
	},
	{
		identifier: "husbandAndWife",
		nonInclusivePhrases: [ "husband and wife", "husbands and wives" ],
		inclusiveAlternatives: "<i>spouses, partners</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryNoUnless.slice( 0, -1 ) +
			", unless referring to someone who explicitly wants to be referred to with this term.",
	},
	{
		identifier: "mothersAndFathers",
		nonInclusivePhrases: [ "mothers and fathers", "fathers and mothers" ],
		inclusiveAlternatives: "<i>parents</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeExclusionaryUnlessUseTheTerm,
	},
	{
		identifier: "manHours",
		nonInclusivePhrases: [ "man-hours" ],
		inclusiveAlternatives: "<i>person-hours, business hours</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "preferredName",
		nonInclusivePhrases: [ "preferred name" ],
		inclusiveAlternatives: "<i>name, affirming name</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeNoUnless.slice( 0, -1 ), ", unless referring to someone who explicitly wants to use" +
		" this term to describe their own name." ].join( "" ),
	},
	{
		identifier: "transgenders",
		nonInclusivePhrases: [ "transgenders" ],
		inclusiveAlternatives: "<i>trans people, transgender people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ avoidDerogatory, alternative ].join( " " ),
	},
	{
		identifier: "transsexual",
		nonInclusivePhrases: [ "transsexual" ],
		inclusiveAlternatives: "<i>transgender</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "transsexuals",
		nonInclusivePhrases: [ "transsexuals" ],
		inclusiveAlternatives: "<i>trans people, transgender people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "transWoman",
		nonInclusivePhrases: [ "transwoman" ],
		inclusiveAlternatives: "<i>trans woman, transgender woman</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "transWomen",
		nonInclusivePhrases: [ "transwomen" ],
		inclusiveAlternatives: "<i>trans women, transgender women</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "transMan",
		nonInclusivePhrases: [ "transman" ],
		inclusiveAlternatives: "<i>trans man, transgender man</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "transMen",
		nonInclusivePhrases: [ "transmen" ],
		inclusiveAlternatives: "<i>trans men, transgender men</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "transgendered",
		nonInclusivePhrases: [ "transgendered" ],
		inclusiveAlternatives: [ "<i>transgender, trans</i>", "transitioned, went through a gender transition" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ redHarmful.slice( 0, -1 ), "if referring to a person. If referring to a transition process," +
		" consider using an alternative such as <i>%3$s</i>." ].join( " " ),
	},
	{
		identifier: "maleToFemale",
		nonInclusivePhrases: [ "male-to-female", "mtf" ],
		inclusiveAlternatives: "<i>trans woman, transgender woman</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "femaleToMale",
		nonInclusivePhrases: [ "female-to-male", "ftm" ],
		inclusiveAlternatives: "<i>trans man, transgender man</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "heShe",
		nonInclusivePhrases: [ "he-she" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: avoidDerogatory,
	},
	{
		identifier: "shemale",
		nonInclusivePhrases: [ "shemale", "she-male" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: avoidDerogatory,
	},
	{
		identifier: "manMade",
		nonInclusivePhrases: [ "man-made", "manmade" ],
		inclusiveAlternatives: "<i>artificial, synthetic, machine-made</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "toEachTheirOwn",
		nonInclusivePhrases: [ "to each his own" ],
		inclusiveAlternatives: "<i>to each their own</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "manned",
		nonInclusivePhrases: [ "manned" ],
		inclusiveAlternatives: "<i>crewed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redExclusionary,
	},
	{
		identifier: "aTransgender",
		nonInclusivePhrases: [ "a transgender", "the transgender" ],
		inclusiveAlternatives: "<i>transgender person</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
		ruleDescription: nonInclusiveWhenStandalone,
	},
];

genderAssessments.forEach( assessment => {
	assessment.category = "gender";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-gender";
} );

export default genderAssessments;
