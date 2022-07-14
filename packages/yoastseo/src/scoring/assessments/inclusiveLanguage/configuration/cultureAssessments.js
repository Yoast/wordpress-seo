import { SCORES } from "./scores";
import { includesConsecutiveWords } from "../helpers/includesConsecutiveWords";
import { isFollowedByException } from "../helpers/isFollowedByException";

const overGeneralizing = "Avoid using \"%1$s\" as it is overgeneralizing. Consider using %2$s instead. ";

const cultureAssessments = [
	{
		identifier: "firstWorld",
		nonInclusivePhrases: [ "First World" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: overGeneralizing,
		learnMoreUrl: "https://yoa.st/",
		caseSensitive: true,
		rule: ( words, inclusivePhrase ) => includesConsecutiveWords( words, inclusivePhrase )
			.filter( isFollowedByException( words, inclusivePhrase, [ "War", "war", "Assembly", "assembly" ] ) ),
	},
	{
		identifier: "thirdWorld",
		nonInclusivePhrases: [ "Third World" ],
		inclusiveAlternatives: "the specific name for the region or country",
		score: SCORES.NON_INCLUSIVE,
		feedbackFormat: overGeneralizing,
		learnMoreUrl: "https://yoa.st/",
		caseSensitive: true,
		rule: ( words, inclusivePhrase ) => includesConsecutiveWords( words, inclusivePhrase )
			.filter( isFollowedByException( words, inclusivePhrase, [ "War", "war", "Quarterly", "quarterly" ] ) ),
	},
];

export default cultureAssessments;
