import { SCORES } from "./scores";
import { potentiallyHarmful, potentiallyHarmfulCareful } from "./feedbackStrings";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import { isFollowedByParticiple } from "../helpers/isFollowedByParticiple";
import { nonNouns } from "../../../../languageProcessing/languages/en/config/functionWords";
import { punctuationRegexString } from "../../../../languageProcessing/helpers/sanitize/removePunctuation";

const punctuationList = punctuationRegexString.split( "" );

const learnMoreUrl = "https://yoa.st/inclusive-language-other";

const otherAssessments = [
	{
		identifier: "homosexuals",
		nonInclusivePhrases: [ "homosexuals" ],
		inclusiveAlternatives: "<i>gay men, queer people, lesbians</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it may overgeneralize or be harmful. " +
						"Instead, be specific about the group you are referring to (e.g. %2$s).",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "minorities",
		nonInclusivePhrases: [ "minorities" ],
		inclusiveAlternatives: [ "<i>marginalized groups</i>", "<i>underrepresented groups</i>", "<i>gender and sexuality minorities</i>" ],
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially overgeneralizing. " +
						"Consider using an alternative, such as %2$s, %3$s or specific minorities, such as %4$s.",
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "theMinority",
		nonInclusivePhrases: [ "the minority" ],
		inclusiveAlternatives: [ "<i>marginalized groups</i>", "<i>underrepresented groups</i>", "<i>gender and sexuality minorities</i>" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Be careful when using <i>%1$s</i> as it is potentially overgeneralizing. " +
		"Consider using an alternative, such as %2$s, %3$s or specific minorities, such as %4$s.",
		learnMoreUrl: learnMoreUrl,
		rule: ( words, nonInclusivePhrases ) => {
			return includesConsecutiveWords( words, nonInclusivePhrases )
				.filter( ( ( index ) => {
					return isNotFollowedByException( words, nonInclusivePhrases, nonNouns )( index ) ||
					isFollowedByParticiple( words, nonInclusivePhrases )( index ) ||
					isNotFollowedByException( words, nonInclusivePhrases, punctuationList )( index );
				} ) );
		},
	},
	{
		identifier: "ex-con",
		nonInclusivePhrases: [ "ex-con", "ex-cons" ],
		inclusiveAlternatives: "<i>people who have had felony convictions, people who have been incarcerated</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "felon",
		nonInclusivePhrases: [ "felon", "felons" ],
		inclusiveAlternatives: "<i>people with felony convictions, people who have been incarcerated</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulCareful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "ex-offender",
		nonInclusivePhrases: [ "ex-offender", "ex-offenders" ],
		inclusiveAlternatives: "<i>formerly incarcerated person</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
];

export default otherAssessments;
