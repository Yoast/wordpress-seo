import { alternative, potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";

const exclusionary = "Avoid using <i>%1$s</i> as it is exclusionary. " +
	"Consider using an alternative, such as %2$s.";
const potentiallyExclusionary = "Be careful when using <i>%1$s</i> as it is potentially exclusionary. " +
	"Consider using an alternative, such as %2$s.";
const potentiallyExclusionaryAvoid = "Avoid using <i>%1$s</i> as it is potentially exclusionary. " +
	"Consider using an alternative, such as %2$s.";
const exclusionaryUnless = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of %1$s, use an alternative, such as %2$s.";
const exclusionaryUnlessMen = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of men, use an alternative, such as %2$s.";
const exclusionaryUnlessTwoGenders = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of two genders, use an alternative, such as %2$s.";
const exclusionaryUnlessUseTheTerm = "Be careful when using <i>%1$s</i> as it can be exclusionary. " +
	"Unless you are sure that the group you refer to only consists of people who use this term, use an alternative, such as %2$s.";
const derogatory = "Avoid using <i>%1$s</i> as it is derogatory.";

const genderAssessments = [
	{
		identifier: "firemen",
		nonInclusivePhrases: [ "firemen" ],
		inclusiveAlternatives: "<i>firefighters</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessMen,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "policemen",
		nonInclusivePhrases: [ "policemen" ],
		inclusiveAlternatives: "<i>police officers</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessMen,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "menAndWomen",
		nonInclusivePhrases: [ "men and women", "women and men" ],
		inclusiveAlternatives: "<i>people, people of all genders, individuals, human beings</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "boysAndGirls",
		nonInclusivePhrases: [ "boys and girls", "girls and boys" ],
		inclusiveAlternatives: "<i>kids, children</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "heOrShe",
		nonInclusivePhrases: [ "he/she", "he or she", "she or he", "(s)he" ],
		inclusiveAlternatives: "<i>they</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "birthSex",
		nonInclusivePhrases: [ "birth sex", "natal sex" ],
		inclusiveAlternatives: "<i>assigned sex, assigned sex at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mankind",
		nonInclusivePhrases: [ "mankind" ],
		inclusiveAlternatives: "<i>individuals, people, persons, human beings, humanity</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "preferredPronouns",
		nonInclusivePhrases: [ "preferred pronouns" ],
		inclusiveAlternatives: "<i>pronouns</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful.slice( 0, -1 ), ", unless referring to someone who explicitly wants to use" +
		" this term to describe their own pronouns." ].join( "" ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "oppositeGender",
		nonInclusivePhrases: [ "opposite gender" ],
		inclusiveAlternatives: "<i>another gender</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "oppositeSex",
		nonInclusivePhrases: [ "opposite sex" ],
		inclusiveAlternatives: "<i>another sex</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "femaleBodied",
		nonInclusivePhrases: [ "female-bodied" ],
		inclusiveAlternatives: "<i>assigned female at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionaryAvoid.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>%1$s</i>.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "maleBodied",
		nonInclusivePhrases: [ "male-bodied" ],
		inclusiveAlternatives: "<i>assigned male at birth</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionaryAvoid.slice( 0, -1 ) +
			" if you are discussing a person based on their sex or assigned gender at birth. " +
			"If talking about human anatomy, use the specific anatomical phrase as opposed to <i>%1$s</i>.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "hermaphrodite",
		nonInclusivePhrases: [ "hermaphrodite" ],
		inclusiveAlternatives: "<i>intersex</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "bothGenders",
		nonInclusivePhrases: [ "both genders" ],
		inclusiveAlternatives: "<i>people, folks, human beings, all genders</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessTwoGenders,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "ladiesAndGentleman",
		nonInclusivePhrases: [ "ladies and gentlemen" ],
		inclusiveAlternatives: "<i>everyone, folks, honored guests</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "husbandAndWife",
		nonInclusivePhrases: [ "husband and wife" ],
		inclusiveAlternatives: "<i>spouses, partners</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyExclusionary.slice( 0, -1 ) +
			", unless referring to someone who explicitly wants to be referred to with this term.",
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "mothersAndFathers",
		nonInclusivePhrases: [ "mothers and fathers", "fathers and mothers" ],
		inclusiveAlternatives: "<i>parents</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: exclusionaryUnlessUseTheTerm,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manHours",
		nonInclusivePhrases: [ "man-hours" ],
		inclusiveAlternatives: "<i>person-hours, business hours</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "preferredName",
		nonInclusivePhrases: [ "preferred name" ],
		inclusiveAlternatives: "<i>name, affirming name</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmful.slice( 0, -1 ), ", unless referring to someone who explicitly wants to use" +
		" this term to describe their own name." ].join( "" ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transgenders",
		nonInclusivePhrases: [ "transgenders" ],
		inclusiveAlternatives: "<i>trans people, transgender people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: [ derogatory, alternative ].join( " " ),
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transsexual",
		nonInclusivePhrases: [ "transsexual" ],
		inclusiveAlternatives: "<i>transgender</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transWoman",
		nonInclusivePhrases: [ "transwoman" ],
		inclusiveAlternatives: "<i>trans woman, transgender woman</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "transMan",
		nonInclusivePhrases: [ "transman" ],
		inclusiveAlternatives: "<i>trans man, transgender man</i>",
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
		inclusiveAlternatives: "<i>trans woman, transgender woman</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "femaleToMale",
		nonInclusivePhrases: [ "female-to-male", "FTM" ],
		inclusiveAlternatives: "<i>trans man, transgender man</i>",
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
		inclusiveAlternatives: "<i>artificial, synthetic, machine-made</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "toEachTheirOwn",
		nonInclusivePhrases: [ "to each his own" ],
		inclusiveAlternatives: "<i>to each their own</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
	{
		identifier: "manned",
		nonInclusivePhrases: [ "manned" ],
		inclusiveAlternatives: "<i>crewed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: exclusionary,
		learnMoreUrl: "https://yoa.st/",
	},
];

export default genderAssessments;
