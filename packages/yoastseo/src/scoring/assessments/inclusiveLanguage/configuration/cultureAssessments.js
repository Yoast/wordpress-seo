import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import { potentiallyHarmful, potentiallyHarmfulCareful, potentiallyHarmfulUnless, harmfulNonInclusive } from "./feedbackStrings";
import { isPrecededByException } from "../helpers/isPrecededByException";

const potentiallyHarmfulUnlessCulture = "Be careful when using <i>%1$s</i> as it is potentially harmful. " +
										"Consider using an alternative, such as %2$s instead, unless you are referring to the culture " +
										"in which this term originated.";
const overgeneralizing = "Avoid using <i>%1$s</i> as it is overgeneralizing. Consider using %2$s instead. ";

const learnMoreUrl = "https://yoa.st/inclusive-language-culture";

const cultureAssessments = [
	{
		identifier: "firstWorld",
		nonInclusivePhrases: [ "First World" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: overgeneralizing,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "War", "war", "Assembly", "assembly" ] ) ),
	},
	{
		identifier: "thirdWorld",
		nonInclusivePhrases: [ "Third World" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: overgeneralizing,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "War", "war", "Quarterly", "quarterly", "country" ] ) ),
	},
	{
		identifier: "tribe",
		nonInclusivePhrases: [ "tribe" ],
		inclusiveAlternatives: "<i>group, cohort, crew, league, guild</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		/*
		 * Replace 'the culture in which this term originated' with 'a culture that uses this term' in the 'unless you are
		 * referring to...' part of the potentiallyHarmfulUnlessCulture string.
		 */
		feedbackFormat: potentiallyHarmfulUnlessCulture.slice( 0, -42 ) + "a culture that uses this term.",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "exotic",
		nonInclusivePhrases: [ "exotic" ],
		inclusiveAlternatives: "<i>unfamiliar, foreign, peculiar, fascinating, alluring, bizarre</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "sherpa",
		nonInclusivePhrases: [ "sherpa" ],
		inclusiveAlternatives: "<i>commander, coach, mastermind, coach, mentor</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessCulture,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "guru",
		nonInclusivePhrases: [ "guru" ],
		inclusiveAlternatives: "<i>mentor, doyen, coach, mastermind, virtuoso</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessCulture,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "nonWhite",
		nonInclusivePhrases: [ "non-white" ],
		inclusiveAlternatives: "<i>people of color, POC, BIPOC</i> or specifying the racial groups mentioned",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "oriental",
		nonInclusivePhrases: [ "oriental" ],
		inclusiveAlternatives: "<i>Asian</i>. When possible, be more specific (e.g. <i>East Asian</i>)",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "asianAmerican",
		nonInclusivePhrases: [ "Asian-American" ],
		inclusiveAlternatives: "<i>Asian American</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
	},
	{
		identifier: "africanAmerican",
		nonInclusivePhrases: [ "African-American" ],
		inclusiveAlternatives: "<i>African American, Black, Americans of African descent</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
	},
	{
		identifier: "whiteRace",
		nonInclusivePhrases: [ "the White race" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: harmfulNonInclusive,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
	},
	{
		identifier: "whitelist",
		nonInclusivePhrases: [ "whitelist" ],
		inclusiveAlternatives: "<i>allowlist</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "blacklist",
		nonInclusivePhrases: [ "blacklist" ],
		inclusiveAlternatives: "<i>blocklist, denylist, faillist, redlist</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "gypVerb",
		nonInclusivePhrases: [ "gyp" ],
		inclusiveAlternatives: "<i>to cheat someone</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isPrecededByException( words, [ "a", "the" ] ) );
		},
	},
	{
		identifier: "gypNoun",
		nonInclusivePhrases: [ "a gyp" ],
		inclusiveAlternatives: "<i>a fraud</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "gypsy",
		nonInclusivePhrases: [ "gypsy", "gypsies" ],
		inclusiveAlternatives: [ "<i>Romani, Romani person, Romani people</i>", "<i>traveler, wanderer, free-spirited</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ potentiallyHarmfulUnless, "If you are referring to a lifestyle rather than the ethnic group or " +
						"their music, consider using an alternative such as <i>%3$s</i>." ].join( " " ),
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "eskimo",
		nonInclusivePhrases: [ "eskimo" ],
		inclusiveAlternatives: "the specific name of the Indigenous community (for example, <i>Inuit</i>)",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "coloredPeople",
		nonInclusivePhrases: [ "colored people" ],
		inclusiveAlternatives: "<i>people of color, POC, BIPOC</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "americanIndians",
		nonInclusivePhrases: [ "American Indian", "American Indians" ],
		inclusiveAlternatives: "<i>Native American(s), Indigenous peoples of America</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
	},
	{
		identifier: "mulatto",
		nonInclusivePhrases: [ "mulatto" ],
		inclusiveAlternatives: "<i>mixed, biracial, multiracial</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "savage",
		nonInclusivePhrases: [ "savage" ],
		inclusiveAlternatives: "<i>severe, dreadful, untamed</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "civilized",
		nonInclusivePhrases: [ "civilized" ],
		inclusiveAlternatives: "<i>proper, well-mannered, enlightened, respectful</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "primitive",
		nonInclusivePhrases: [ "primitive" ],
		inclusiveAlternatives: "<i>early, rudimentary</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "africanAmericanVernacularEnglish",
		nonInclusivePhrases: [ "African American Vernacular English" ],
		inclusiveAlternatives: "<i>African American English, African American Language</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
	},
	{
		identifier: "ebonics",
		nonInclusivePhrases: [ "Ebonics" ],
		inclusiveAlternatives: "<i>African American English, African American Language</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
		caseSensitive: true,
	},
	{
		identifier: "powWow",
		nonInclusivePhrases: [ "pow-wow" ],
		inclusiveAlternatives: "<i>chat, brief conversation, brainstorm, huddle</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessCulture,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "lowManOnTheTotemPole",
		nonInclusivePhrases: [ "low man on the totem pole" ],
		inclusiveAlternatives: "<i>person of lower rank, junior-level</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "spiritAnimal",
		nonInclusivePhrases: [ "spirit animal" ],
		inclusiveAlternatives: "<i>inspiration, hero, icon, idol</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnlessCulture,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "firstWorldCountries",
		nonInclusivePhrases: [ "first world countries" ],
		inclusiveAlternatives: "specific name for the countries or regions",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: overgeneralizing,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "firstWorld",
		nonInclusivePhrases: [ "first-world" ],
		inclusiveAlternatives: "specific name for the country or region",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: overgeneralizing,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "third-worldCountry",
		nonInclusivePhrases: [ "third-world country" ],
		inclusiveAlternatives: "<i>low-income country, developing country</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "third-worldCountry",
		nonInclusivePhrases: [ "third world country" ],
		inclusiveAlternatives: "<i>low-income country, developing country</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "underdevelopedCountry",
		nonInclusivePhrases: [ "underdeveloped country", "underdeveloped countries" ],
		inclusiveAlternatives: "developing country/countries",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, " +
						"such as <i>%2$s</i> instead or be more specific about what aspect this word refers to.",
		learnMoreUrl: learnMoreUrl,
	},
];

export default cultureAssessments;
