import { potentiallyHarmful, potentiallyHarmfulUnless } from "./feedbackStrings";
import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import notInclusiveWhenStandalone from "../helpers/notInclusiveWhenStandalone";


const sesAssessments = [
	{
		identifier: "illegalImmigrant",
		nonInclusivePhrases: [ "illegal immigrant", "illegal alien" ],
		inclusiveAlternatives: "<i>undocumented person, person without papers, immigrant without papers</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "illegalImmigrants",
		nonInclusivePhrases: [ "illegal immigrants", "illegal aliens" ],
		inclusiveAlternatives: "<i>undocumented people, people without papers, immigrants without papers</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "povertyStricken",
		nonInclusivePhrases: [ "poverty stricken" ],
		inclusiveAlternatives: "<i>people whose income is below the poverty threshold, people with low-income</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "welfareReliant",
		nonInclusivePhrases: [ "welfare reliant" ],
		inclusiveAlternatives: "<i>receiving welfare</i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmful,
	},
	{
		identifier: "prostitute",
		nonInclusivePhrases: [ "prostitute" ],
		inclusiveAlternatives: "<i>sex worker</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "prostitute",
		nonInclusivePhrases: [ "prostitute" ],
		inclusiveAlternatives: "<i>sex worker</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "prostitutes",
		nonInclusivePhrases: [ "prostitutes" ],
		inclusiveAlternatives: "<i>sex workers</i>",
		score: SCORES.POTENTIALLY_NON_INCLUSIVE,
		feedbackFormat: potentiallyHarmfulUnless,
	},
	{
		identifier: "theHomeless",
		nonInclusivePhrases: [ "the homeless" ],
		inclusiveAlternatives: "<i>people experiencing homelessness </i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is generalizing. Consider using %2$s instead.",
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
	{
		identifier: "theUndocumented",
		nonInclusivePhrases: [ "the undocumented" ],
		inclusiveAlternatives: "<i>people who are undocumented/ undocumented people, people without papers </i>",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially overgeneralizing. Consider using %2$s instead.",
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
	{
		identifier: "thePoor",
		nonInclusivePhrases: [ "the poor" ],
		inclusiveAlternatives: [ "people whose income is below the poverty threshold", "people with low-income" ],
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: "Avoid using <i>%1$s</i> as it is potentially overgeneralizing. Consider using <i>%2$s</i> or <i>%3$s</i> instead.",
		rule: ( words, nonInclusivePhrase ) => {
			return includesConsecutiveWords( words, nonInclusivePhrase )
				.filter( notInclusiveWhenStandalone( words, nonInclusivePhrase ) );
		},
	},
];

sesAssessments.forEach( assessment => {
	assessment.category = "ses";
	assessment.learnMoreUrl = "https://yoa.st/inclusive-language-ses";
} );

export default sesAssessments;
