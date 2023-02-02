import { alternative, potentiallyHarmful, potentiallyHarmfulCareful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";

/*
 * Used for exclusionary terms, such as 'mankind'.
 *
 * "Avoid using <i>%1$s</i> as it is exclusionary. Consider using an alternative, such as %2$s."
 */
const exclusionary = "Avoid using <i>%1$s</i> as it is exclusionary. " +
	"Consider using an alternative, such as %2$s.";
/*
 * Used for potentially exclusionary terms that receive an orange traffic light, such as 'he or she'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially exclusionary. Consider using an alternative, such as %2$s."
 */
const potentiallyExclusionary = "Be careful when using <i>%1$s</i> as it is potentially exclusionary. " +
	"Consider using an alternative, such as %2$s.";
/*
 * Used for potentially exclusionary terms that receive an orange traffic light, such as 'female-bodied'.
 *
 * "Be careful when using <i>%1$s</i> as it is potentially exclusionary. Consider using an alternative, such as %2$s."
 */
const potentiallyExclusionaryAvoid = "Avoid using <i>%1$s</i> as it is potentially exclusionary. " +
	"Consider using an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless they describe a group that only consists of the people that the term mentions.
 * For example, "boys and girls".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of %1$s,
 *  use an alternative, such as %2$s."
 */
const exclusionaryUnless = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of %1$s, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless the group this term describes only consists of men, for example "firemen"."
 *
 * Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of %1$s,
 *  use an alternative, such as %2$s."
 */
const exclusionaryUnlessMen = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of men, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless the group this term describes only consists of men and women, for example "ladies and gentlemen".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of men and women,
 *  use an alternative, such as %2$s."
 */
const exclusionaryUnlessMenAndWomen = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of men and women, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless the group this term describes only consists of two genders, for example "both genders".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of two genders,
 *  use an alternative, such as %2$s."
 */
const exclusionaryUnlessTwoGenders = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of two genders, use an alternative, such as %2$s.";
/*
 * Used for terms that are exclusionary unless all members of the group use this term to refer to themselves, for example "mothers and fathers".
 *
 * "Be careful when using <i>%1$s</i> as it can be exclusionary. Unless you are sure that the group you refer to only consists of people who use
 *  this term, use an alternative, such as %2$s."
 */
const exclusionaryUnlessUseTheTerm = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of people who use this term, use an alternative, such as %2$s.";
/*
 * Used for derogatory terms, such as "he-she".
 *
 * "Avoid using <i>%1$s</i> as it is derogatory."
 */
const derogatory = "Avoid using <i>%1$s</i> as it is derogatory.";

const genderAssessments = [
	{
		identifier: "firemen",
		nonInclusivePhrases: [ "firemen" ],
		inclusiveAlternatives: "<i>firefighters</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessMen,
	},
	{
		identifier: "policemen",
		nonInclusivePhrases: [ "policemen" ],
		inclusiveAlternatives: "<i>police officers</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessMen,
	},
	{
		identifier: "menAndWomen",
		nonInclusivePhrases: [ "men and women", "women and men" ],
		inclusiveAlternatives: "<i>people, people of all genders, individuals, human beings</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
	},
	{
		identifier: "boysAndGirls",
		nonInclusivePhrases: [ "boys and girls", "girls and boys" ],
		inclusiveAlternatives: "<i>kids, children</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
	},
	{
		identifier: "heOrShe",
		nonInclusivePhrases: [ "he/she", "he or she", "she or he", "(s)he" ],
		inclusiveAlternatives: "<i>they</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary,
	},
	{
		identifier: "birthSex",
		nonInclusivePhrases: [ "birth sex", "natal sex" ],
		inclusiveAlternatives: "<i>assigned sex, assigned sex at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "mankind",
		nonInclusivePhrases: [ "mankind" ],
		inclusiveAlternatives: "<i>individuals, people, persons, human beings, humanity</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "preferredPronouns",
		nonInclusivePhrases: [ "preferred pronouns" ],
		inclusiveAlternatives: "<i>pronouns</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulCareful.slice( 0, -1 ), ", unless referring to someone who explicitly wants to use" +
		" this term to describe their own pronouns." ].join( "" ),
	},
	{
		identifier: "oppositeGender",
		nonInclusivePhrases: [ "opposite gender" ],
		inclusiveAlternatives: "<i>another gender</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "oppositeSex",
		nonInclusivePhrases: [ "opposite sex" ],
		inclusiveAlternatives: "<i>another sex</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "femaleBodied",
		nonInclusivePhrases: [ "female-bodied" ],
		inclusiveAlternatives: "<i>assigned female at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionaryAvoid.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>%1$s</i>.",
	},
	{
		identifier: "maleBodied",
		nonInclusivePhrases: [ "male-bodied" ],
		inclusiveAlternatives: "<i>assigned male at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionaryAvoid.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>%1$s</i>.",
	},
	{
		identifier: "hermaphrodite",
		nonInclusivePhrases: [ "hermaphrodite" ],
		inclusiveAlternatives: "<i>intersex</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "hermaphrodites",
		nonInclusivePhrases: [ "hermaphrodites" ],
		inclusiveAlternatives: "<i>intersex people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "bothGenders",
		nonInclusivePhrases: [ "both genders" ],
		inclusiveAlternatives: "<i>people, folks, human beings, all genders</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessTwoGenders,
	},
	{
		identifier: "ladiesAndGentleman",
		nonInclusivePhrases: [ "ladies and gentlemen" ],
		inclusiveAlternatives: "<i>everyone, folks, honored guests</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessMenAndWomen,
	},
	{
		identifier: "husbandAndWife",
		nonInclusivePhrases: [ "husband and wife", "husbands and wives" ],
		inclusiveAlternatives: "<i>spouses, partners</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary.slice( 0, -1 ) +
			", unless referring to someone who explicitly wants to be referred to with this term.",
	},
	{
		identifier: "mothersAndFathers",
		nonInclusivePhrases: [ "mothers and fathers", "fathers and mothers" ],
		inclusiveAlternatives: "<i>parents</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessUseTheTerm,
	},
	{
		identifier: "manHours",
		nonInclusivePhrases: [ "man-hours" ],
		inclusiveAlternatives: "<i>person-hours, business hours</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "preferredName",
		nonInclusivePhrases: [ "preferred name" ],
		inclusiveAlternatives: "<i>name, affirming name</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulCareful.slice( 0, -1 ), ", unless referring to someone who explicitly wants to use" +
		" this term to describe their own name." ].join( "" ),
	},
	{
		identifier: "transgenders",
		nonInclusivePhrases: [ "transgenders" ],
		inclusiveAlternatives: "<i>trans people, transgender people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ derogatory, alternative ].join( " " ),
	},
	{
		identifier: "transsexual",
		nonInclusivePhrases: [ "transsexual" ],
		inclusiveAlternatives: "<i>transgender</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "transsexuals",
		nonInclusivePhrases: [ "transsexuals" ],
		inclusiveAlternatives: "<i>trans people, transgender people</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "transWoman",
		nonInclusivePhrases: [ "transwoman" ],
		inclusiveAlternatives: "<i>trans woman, transgender woman</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "transWomen",
		nonInclusivePhrases: [ "transwomen" ],
		inclusiveAlternatives: "<i>trans women, transgender women</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "transMan",
		nonInclusivePhrases: [ "transman" ],
		inclusiveAlternatives: "<i>trans man, transgender man</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "transMen",
		nonInclusivePhrases: [ "transmen" ],
		inclusiveAlternatives: "<i>trans men, transgender men</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "transgendered",
		nonInclusivePhrases: [ "transgendered" ],
		inclusiveAlternatives: [ "<i>transgender, trans</i>", "transitioned, went through a gender transition" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful.slice( 0, -1 ), "if referring to a person. If referring to a transition process," +
		" consider using an alternative such as <i>%3$s</i>." ].join( " " ),
	},
	{
		identifier: "maleToFemale",
		nonInclusivePhrases: [ "male-to-female", "mtf" ],
		inclusiveAlternatives: "<i>trans woman, transgender woman</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "femaleToMale",
		nonInclusivePhrases: [ "female-to-male", "ftm" ],
		inclusiveAlternatives: "<i>trans man, transgender man</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "heShe",
		nonInclusivePhrases: [ "he-she" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
	},
	{
		identifier: "shemale",
		nonInclusivePhrases: [ "shemale", "she-male" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
	},
	{
		identifier: "manMade",
		nonInclusivePhrases: [ "man-made", "manmade" ],
		inclusiveAlternatives: "<i>artificial, synthetic, machine-made</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "toEachTheirOwn",
		nonInclusivePhrases: [ "to each his own" ],
		inclusiveAlternatives: "<i>to each their own</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "manned",
		nonInclusivePhrases: [ "manned" ],
		inclusiveAlternatives: "<i>crewed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
	},
	{
		identifier: "aTransgender",
		nonInclusivePhrases: [ "a transgender", "the transgender" ],
		inclusiveAlternatives: "<i>transgender person</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
];

genderAssessments.forEach( assessment => {
	assessment.category = "gender";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-gender";
} );

export default genderAssessments;
