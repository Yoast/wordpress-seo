import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { isNotFollowedByException } from "../helpers/isFollowedByException";
import { isFollowedByParticiple } from "../helpers/isFollowedByParticiple";
import { nonNouns } from "../../../../languageProcessing/languages/en/config/functionWords";
import { punctuationRegexString } from "../../../../languageProcessing/helpers/sanitize/removePunctuation";

const punctuationList = punctuationRegexString.split( "" );

const learnMoreUrl = "https://yoa.st/inclusive-language-ses";

const sesAssessments = [
	{
		identifier: "illegalImmigrants",
		nonInclusivePhrases: [ "illegal immigrants", "illegal aliens" ],
		inclusiveAlternatives: "<i>undocumented people</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "povertyStricken",
		nonInclusivePhrases: [ "poverty stricken" ],
		inclusiveAlternatives: "<i>people whose income is below the poverty threshold, people with low-income</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "welfareReliant",
		nonInclusivePhrases: [ "welfare reliant" ],
		inclusiveAlternatives: "<i>receiving welfare</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "prostitute",
		nonInclusivePhrases: [ "prostitute" ],
		inclusiveAlternatives: "<i>sex worker</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
		learnMoreUrl: learnMoreUrl,
	},
	{
		identifier: "theHomeless",
		nonInclusivePhrases: [ "the homeless" ],
		inclusiveAlternatives: "<i>people experiencing homelessness </i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is generalizing. Consider using %2$s instead.",
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
		identifier: "theUndocumented",
		nonInclusivePhrases: [ "the undocumented" ],
		inclusiveAlternatives: "<i>people who are undocumented/ undocumented people, people without papers </i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially overgeneralizing. Consider using %2$s instead.",
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
		identifier: "thePoor",
		nonInclusivePhrases: [ "the poor" ],
		inclusiveAlternatives: [ "people whose income is below the poverty threshold", "people with low-income" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially overgeneralizing. Consider using <i>%2$s</i> or <i>%3$s</i> instead.",
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
];

export default sesAssessments;
