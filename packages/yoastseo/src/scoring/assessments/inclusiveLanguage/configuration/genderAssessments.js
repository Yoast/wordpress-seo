import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";

const exclusionary = "Avoid using \"%1$s\" as it is exclusionary. " +
	"Consider using an alternative, such as \"%2$s\" instead.";
const potentiallyExclusionary = "Be careful when using \"%1$s\" as it is potentially exclusionary. " +
	"Consider using an alternative, such as \"%2$s\" instead.";
const exclusionaryUnless = "Be careful when using \"%1$s\" as it is exclusionary, " +
	"unless you are sure the group you refer to only consists of \"%1$s\". If not, use \"%2$s\" instead.";
const derogatory = "Avoid using \"%1$s\" as it is derogatory.";

const genderAssessments = [
	{
		identifier: "firemen",
		nonInclusivePhrases: [ "firemen" ],
		inclusiveAlternatives: "firefighters",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "policemen",
		nonInclusivePhrases: [ "policemen" ],
		inclusiveAlternatives: "police officers",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "menAndWomen",
		nonInclusivePhrases: [ "men and women", "women and men" ],
		inclusiveAlternatives: "people, people of all genders, individuals, folks, human beings",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "boysAndGirls",
		nonInclusivePhrases: [ "boys and girls", "girls and boys" ],
		inclusiveAlternatives: "kids, children",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "heOrShe",
		nonInclusivePhrases: [ "he/she", "he or she", "she or he", "(s)he" ],
		inclusiveAlternatives: "singular \"they\"",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "birthSex",
		nonInclusivePhrases: [ "birth sex", "natal sex" ],
		inclusiveAlternatives: "assigned sex/assigned sex at birth",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mankind",
		nonInclusivePhrases: [ "mankind" ],
		inclusiveAlternatives: "individuals, people, persons, human beings, humanity",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "preferredPronouns",
		nonInclusivePhrases: [ "preferred pronouns" ],
		inclusiveAlternatives: "pronouns",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "oppositeGender",
		nonInclusivePhrases: [ "opposite gender" ],
		inclusiveAlternatives: "another gender",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "oppositeSex",
		nonInclusivePhrases: [ "opposite sex" ],
		inclusiveAlternatives: "another sex",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "femaleBodied",
		nonInclusivePhrases: [ "female-bodied", "male-bodied" ],
		inclusiveAlternatives: "assigned female/male at birth",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to \"%1$s\".",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "hermaphrodite",
		nonInclusivePhrases: [ "hermaphrodite" ],
		inclusiveAlternatives: "intersex",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		// Long alternative!
		identifier: "bothGenders",
		nonInclusivePhrases: [ "both genders" ],
		inclusiveAlternatives: "people, folks, human beings, all genders, both men and women " +
			"(if talking specifically about just those who are men and women and not a substitute for people in general)",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "ladiesAndGentleman",
		nonInclusivePhrases: [ "ladies and gentlemen" ],
		inclusiveAlternatives: "everyone, folks, honored guests",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "husbandAndWife",
		nonInclusivePhrases: [ "husband and wife" ],
		inclusiveAlternatives: "spouses, partners",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary.slice( 0, -1 ) +
			", unless referring to someone who explicitly wants to be referred to with this term.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mothersAndFathers",
		nonInclusivePhrases: [ "mothers and fathers", "fathers and mothers" ],
		inclusiveAlternatives: "parents",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using \"%1$s\" as it is exclusionary, " +
			"unless you are sure the group only consists of people who use that term. " +
			"If not, use \"%2$s\" instead.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manHours",
		nonInclusivePhrases: [ "man-hours" ],
		inclusiveAlternatives: "person-hours",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "preferredName",
		nonInclusivePhrases: [ "preferred name" ],
		inclusiveAlternatives: "name or affirming name",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		// Feedback missing!
		identifier: "transgenders",
		nonInclusivePhrases: [ "transgenders" ],
		inclusiveAlternatives: "transgender people",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transsexual",
		nonInclusivePhrases: [ "transsexual" ],
		inclusiveAlternatives: "transgender",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "trans",
		nonInclusivePhrases: [ "transman", "transwoman" ],
		inclusiveAlternatives: "trans(gender) man/woman",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transgendered",
		nonInclusivePhrases: [ "transgendered" ],
		inclusiveAlternatives: [ "<i>transgender, trans</i>", "transitioned, went through a gender transition" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful.slice( 0, -1 ), "if referring to a person. If referring to a transition process," +
		" consider using an alternative such as <i>%3$s</i>." ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "maleToFemale",
		nonInclusivePhrases: [ "male-to-female", "MTF" ],
		inclusiveAlternatives: "trans woman, transgender woman",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "femaleToMale",
		nonInclusivePhrases: [ "female-to-male", "FTM" ],
		inclusiveAlternatives: "trans man, transgender man",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "heShe",
		nonInclusivePhrases: [ "he-she" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "shemale",
		nonInclusivePhrases: [ "shemale", "she-male" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: derogatory,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manMade",
		nonInclusivePhrases: [ "man-made", "manmade" ],
		inclusiveAlternatives: "artificial, synthetic, machine-made",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "toEachTheirOwn",
		nonInclusivePhrases: [ "to each his own" ],
		inclusiveAlternatives: "to each their own",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manned",
		nonInclusivePhrases: [ "manned" ],
		inclusiveAlternatives: "crewed",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default genderAssessments;
