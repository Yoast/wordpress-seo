import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All helpers
import matchWordCustomHelper from "./helpers/matchTextWithWord";
import getWordsCustomHelper from "./helpers/getWords";
import customGetStemmer from "./helpers/customGetStemmer";
import wordsCharacterCount from "./helpers/wordsCharacterCount";
import customCountLength from "./helpers/countCharacters";
import matchTransitionWordsHelper from "./helpers/matchTransitionWords";
import getContentWords from "./helpers/getContentWords";
import memoizedTokenizer from "./helpers/memoizedSentenceTokenizer";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import topicLength from "./config/topicLength";
import textLength from "./config/textLength";
import paragraphLength from "./config/paragraphLength";
import assessmentApplicability from "./config/assessmentApplicabilityCharacterCount";
import sentenceLength from "./config/sentenceLength";
import subheadingsTooLong from "./config/subheadingsTooLong";
import keyphraseLength from "./config/keyphraseLength";
import metaDescriptionLength from "./config/metaDescriptionLength";

// All custom researches
import morphology from "./customResearches/getWordForms";
import getKeyphraseLength from "./customResearches/getKeyphraseLength";
import textLengthResearch from "./customResearches/textLength";
import findKeyphraseInSEOTitle from "./customResearches/findKeyphraseInSEOTitle";

/**
 * The researches contains all the researches
 */
export default class Researcher extends AbstractResearcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		super( paper );

		// Deletes researches that are not available for languages that we haven't supported yet.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.keywordCountInSlug;
		delete this.defaultResearches.wordComplexity;

		Object.assign( this.config, {
			language: "ja",
			firstWordExceptions,
			functionWords,
			transitionWords,
			topicLength,
			textLength,
			paragraphLength,
			assessmentApplicability,
			sentenceLength,
			keyphraseLength,
			subheadingsTooLong,
			countCharacters: true,
			metaDescriptionLength,
		} );

		Object.assign( this.helpers, {
			matchWordCustomHelper,
			getWordsCustomHelper,
			getContentWords,
			customGetStemmer,
			wordsCharacterCount,
			customCountLength,
			matchTransitionWordsHelper,
			memoizedTokenizer,
		} );

		Object.assign( this.defaultResearches, {
			morphology,
			keyphraseLength: getKeyphraseLength,
			wordCountInText: textLengthResearch,
			findKeyphraseInSEOTitle,
		} );
	}
}
