import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All helpers
import matchWordCustomHelper from "./helpers/matchTextWithWord.js";
import getWordsCustomHelper from "./helpers/getWords.js";
import customGetStemmer from "./helpers/customGetStemmer.js";
import wordsCharacterCount from "./helpers/wordsCharacterCount.js";
import customCountLength from "./helpers/countCharacters.js";
import matchTransitionWordsHelper from "./helpers/matchTransitionWords.js";
import getContentWords from "./helpers/getContentWords.js";
import memoizedTokenizer from "./helpers/memoizedSentenceTokenizer.js";
import splitIntoTokensCustom from "./helpers/splitIntoTokensCustom.js";

// All config
import firstWordExceptions from "./config/firstWordExceptions.js";
import functionWords from "./config/functionWords.js";
import transitionWords from "./config/transitionWords.js";
import topicLength from "./config/topicLength.js";
import textLength from "./config/textLength.js";
import paragraphLength from "./config/paragraphLength.js";
import assessmentApplicability from "./config/assessmentApplicabilityCharacterCount.js";
import sentenceLength from "./config/sentenceLength.js";
import subheadingsTooLong from "./config/subheadingsTooLong.js";
import keyphraseLength from "./config/keyphraseLength.js";
import metaDescriptionLength from "./config/metaDescriptionLength.js";
import altTextLength from "./config/altTextLength.js";
import redundantPhraseInAltText from "./config/redundantPhraseInAltText.js";

// All custom researches
import morphology from "./customResearches/getWordForms.js";
import getKeyphraseLength from "./customResearches/getKeyphraseLength.js";
import textLengthResearch from "./customResearches/textLength.js";
import findKeyphraseInSEOTitle from "./customResearches/findKeyphraseInSEOTitle.js";

/**
 * The researcher contains all the researches, helpers, data, and config.
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
			altTextLength,
			redundantPhraseInAltText,
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
			splitIntoTokensCustom,
		} );

		Object.assign( this.defaultResearches, {
			morphology,
			keyphraseLength: getKeyphraseLength,
			wordCountInText: textLengthResearch,
			findKeyphraseInSEOTitle,
		} );
	}
}
