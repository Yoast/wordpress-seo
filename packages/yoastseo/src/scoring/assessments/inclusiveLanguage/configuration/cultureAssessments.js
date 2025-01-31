import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import {
	redHarmful,
	orangeUnlessSomeoneWants,
	avoidHarmful,
	beCarefulHarmful,
	orangeUnlessAnimalsObjects,
} from "./feedbackStrings/generalFeedbackStrings";
import {
	orangeUnlessCultureOfOrigin, orangeUnlessCultureUsesTerm,
} from "./feedbackStrings/cultureAssessmentStrings";
import { notFollowed } from "../helpers/createRuleDescriptions";

const cultureAssessments = [
	{
		identifier: "firstWorld",
		nonInclusivePhrases: [ "First World" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		caseSensitive: true,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "War", "war", "Assembly", "assembly" ] ) ),
		ruleDescription: notFollowed( [ "War", "war", "Assembly", "assembly" ] ),
	},
	{
		identifier: "thirdWorld",
		nonInclusivePhrases: [ "Third World" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		caseSensitive: true,
		rule: ( words, nonInclusivePhrase ) => includesConsecutiveWords( words, nonInclusivePhrase )
			.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "War", "war", "Quarterly", "quarterly", "country" ] ) ),
		ruleDescription: notFollowed( [ "War", "war", "Quarterly", "quarterly", "country" ] ),
	},
	{
		identifier: "tribe",
		nonInclusivePhrases: [ "tribe" ],
		inclusiveAlternatives: "<i>group, cohort, crew, league, guild, team, union</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureUsesTerm,
	},
	{
		identifier: "tribes",
		nonInclusivePhrases: [ "tribes" ],
		inclusiveAlternatives: "<i>groups, cohorts, crews, leagues, guilds, teams, unions</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureUsesTerm,
	},
	{
		identifier: "exotic",
		nonInclusivePhrases: [ "exotic" ],
		inclusiveAlternatives: "<i>unfamiliar, foreign, peculiar, fascinating, alluring, bizarre, non-native, introduced</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: beCarefulHarmful + " Unless you are referring to animals, " +
			"consider using an alternative, such as %2$s.",
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( isNotFollowedByException( words, nonInclusivePhrase, [ "longhair", "longhairs", "shorthair", "shorthairs" ] ) );
		},
		ruleDescription: notFollowed( [ "longhair", "longhairs", "shorthair", "shorthairs" ] ),
	},
	{
		identifier: "sherpa",
		nonInclusivePhrases: [ "sherpa" ],
		inclusiveAlternatives: "<i>commander, coach, mastermind, coach, mentor</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureOfOrigin,
	},
	{
		identifier: "guru",
		nonInclusivePhrases: [ "guru" ],
		inclusiveAlternatives: "<i>mentor, doyen, coach, mastermind, virtuoso, expert</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureOfOrigin,
	},
	{
		identifier: "gurus",
		nonInclusivePhrases: [ "gurus" ],
		inclusiveAlternatives: "<i>mentors, doyens, coaches, masterminds, virtuosos, experts</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureOfOrigin,
	},
	{
		identifier: "nonWhite",
		nonInclusivePhrases: [ "non-white" ],
		inclusiveAlternatives: "<i>people of color, POC, BIPOC</i> or specifying the racial groups mentioned",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "oriental",
		nonInclusivePhrases: [ "oriental" ],
		inclusiveAlternatives: "<i>Asian</i>. When possible, be more specific (e.g. <i>East Asian</i>)",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessAnimalsObjects,
	},
	{
		identifier: "asianAmerican",
		nonInclusivePhrases: [ "Asian-American" ],
		inclusiveAlternatives: "<i>Asian American</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		caseSensitive: true,
	},
	{
		identifier: "asianAmericans",
		nonInclusivePhrases: [ "Asian-Americans" ],
		inclusiveAlternatives: "<i>Asian Americans</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		caseSensitive: true,
	},
	{
		identifier: "africanAmerican",
		nonInclusivePhrases: [ "African-American" ],
		inclusiveAlternatives: "<i>African American, Black, American of African descent</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		caseSensitive: true,
	},
	{
		identifier: "africanAmericans",
		nonInclusivePhrases: [ "African-Americans" ],
		inclusiveAlternatives: "<i>African Americans, Black, Americans of African descent</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
		caseSensitive: true,
	},
	{
		identifier: "whiteRace",
		nonInclusivePhrases: [ "the White race" ],
		inclusiveAlternatives: "",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: avoidHarmful,
		caseSensitive: true,
	},
	{
		identifier: "whitelist",
		nonInclusivePhrases: [ "whitelist" ],
		inclusiveAlternatives: "<i>allowlist</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "whitelists",
		nonInclusivePhrases: [ "whitelists" ],
		inclusiveAlternatives: "<i>allowlists</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "whitelisting",
		nonInclusivePhrases: [ "whitelisting" ],
		inclusiveAlternatives: "<i>allowlisting</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "whitelisted",
		nonInclusivePhrases: [ "whitelisted" ],
		inclusiveAlternatives: "<i>allowlisted</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "blacklist",
		nonInclusivePhrases: [ "blacklist" ],
		inclusiveAlternatives: "<i>blocklist, denylist, faillist, redlist</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "blacklists",
		nonInclusivePhrases: [ "blacklists" ],
		inclusiveAlternatives: "<i>blocklists, denylists, faillists, redlists</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "blacklisting",
		nonInclusivePhrases: [ "blacklisting" ],
		inclusiveAlternatives: "<i>blocklisting, denylisting, faillisting, redlisting</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "blacklisted",
		nonInclusivePhrases: [ "blacklisted" ],
		inclusiveAlternatives: "<i>blocklisted, denylisted, faillisted, redlisted</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "gyp",
		nonInclusivePhrases: [ "gyp" ],
		inclusiveAlternatives: "<i>fraud, cheat, swindle, rip-off</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "gyps",
		nonInclusivePhrases: [ "gyps" ],
		inclusiveAlternatives: "<i>frauds, cheats, swindles, rips off, rip-offs</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "gypped",
		nonInclusivePhrases: [ "gypped" ],
		inclusiveAlternatives: "<i>cheated, swindled, ripped off</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "gypping",
		nonInclusivePhrases: [ "gypping" ],
		inclusiveAlternatives: "<i>cheating, swindling, ripping off</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "gypsy",
		nonInclusivePhrases: [ "gypsy", "gipsy" ],
		inclusiveAlternatives: [ "<i>Rom, Roma person, Romani, Romani person</i>", "<i>traveler, wanderer, free-spirited</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, "If you are referring to a lifestyle rather than the ethnic group or " +
		"their music, consider using an alternative such as %3$s." ].join( " " ),
	},
	{
		identifier: "gypsies",
		nonInclusivePhrases: [ "gypsies", "gipsies" ],
		inclusiveAlternatives: [ "<i>Roma, Romani, Romani people</i>", "<i>travelers, wanderers, free-spirited</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: [ orangeUnlessSomeoneWants, "If you are referring to a lifestyle rather than the ethnic group or " +
		"their music, consider using an alternative such as %3$s." ].join( " " ),
	},
	{
		identifier: "eskimo",
		nonInclusivePhrases: [ "eskimo", "eskimos" ],
		inclusiveAlternatives: "the specific name of the Indigenous community (for example, <i>Inuit</i>)",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
	},
	{
		identifier: "coloredPerson",
		nonInclusivePhrases: [ "colored person" ],
		inclusiveAlternatives: "<i>person of color, POC, BIPOC</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "coloredPeople",
		nonInclusivePhrases: [ "colored people" ],
		inclusiveAlternatives: "<i>people of color, POC, BIPOC</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "americanIndians",
		nonInclusivePhrases: [ "American Indian", "American Indians" ],
		inclusiveAlternatives: "<i>Native American(s), Indigenous peoples of America</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessSomeoneWants,
		caseSensitive: true,
	},
	{
		identifier: "mulatto",
		nonInclusivePhrases: [ "mulatto", "mulattos", "mulattoes" ],
		inclusiveAlternatives: "<i>mixed, biracial, multiracial</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "savage",
		nonInclusivePhrases: [ "savage" ],
		inclusiveAlternatives: "<i>severe, dreadful, untamed, brutal, fearless, fierce, brilliant, amazing</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "civilized",
		nonInclusivePhrases: [ "civilized" ],
		inclusiveAlternatives: "<i>proper, well-mannered, enlightened, respectful</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "primitive",
		nonInclusivePhrases: [ "primitive" ],
		inclusiveAlternatives: "<i>early, rudimentary</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "powWow",
		nonInclusivePhrases: [ "pow-wow" ],
		inclusiveAlternatives: "<i>chat, brief conversation, brainstorm, huddle</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureOfOrigin,
	},
	{
		identifier: "lowManOnTheTotemPole",
		nonInclusivePhrases: [ "low man on the totem pole" ],
		inclusiveAlternatives: "<i>person of lower rank, junior-level</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "spiritAnimal",
		nonInclusivePhrases: [ "spirit animal" ],
		inclusiveAlternatives: "<i>inspiration, hero, icon, idol</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: orangeUnlessCultureOfOrigin,
	},
	{
		identifier: "firstWorldCountries",
		nonInclusivePhrases: [ "first world countries" ],
		inclusiveAlternatives: "the specific name for the regions or countries",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "firstWorldHyphen",
		nonInclusivePhrases: [ "first-world" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "third-worldCountry",
		nonInclusivePhrases: [ "third-world country" ],
		inclusiveAlternatives: "<i>low-income country, developing country</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "third-worldCountry",
		nonInclusivePhrases: [ "third world country" ],
		inclusiveAlternatives: "<i>low-income country, developing country</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: redHarmful,
	},
	{
		identifier: "underdevelopedCountry",
		nonInclusivePhrases: [ "underdeveloped country" ],
		inclusiveAlternatives: "developing country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, " +
						"such as <i>%2$s</i> instead or be more specific about what aspect this word refers to.",
	},
	{
		identifier: "underdevelopedCountries",
		nonInclusivePhrases: [ "underdeveloped countries" ],
		inclusiveAlternatives: "developing countries",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially harmful. Consider using an alternative, " +
			"such as <i>%2$s</i> instead or be more specific about what aspect this word refers to.",
	},
];

cultureAssessments.forEach( assessment => {
	assessment.category = "culture";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-culture";
} );

export default cultureAssessments;
