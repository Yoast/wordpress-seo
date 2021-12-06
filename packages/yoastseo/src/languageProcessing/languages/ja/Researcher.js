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
import findMultiWordKeyphraseInPageTitle from "./helpers/findExactMatchMultiWordKeyphraseInTitle";

// All config
import firstWordExceptions from "./config/firstWordExceptions";
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import topicLength from "./config/topicLength";
import assessmentApplicability from "./config/assessmentApplicabilityCharacterCount";
import sentenceLength from "./config/sentenceLength";

// All custom researches
import morphology from "./customResearches/getWordForms";
import getKeywordDensity from "./customResearches/getKeywordDensity";
import getKeyphraseLength from "./customResearches/getKeyphraseLength";

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
		delete this.defaultResearches.keywordCountInUrl;

		// Adds the Japanese custom research to calculate the keyword density.
		this.addResearch( "getKeywordDensity", getKeywordDensity );

		Object.assign( this.config, {
			language: "ja",
			firstWordExceptions,
			functionWords,
			transitionWords,
			topicLength,
			assessmentApplicability,
			sentenceLength,
		} );

		Object.assign( this.helpers, {
			matchWordCustomHelper,
			getWordsCustomHelper,
			getContentWords,
			customGetStemmer,
			wordsCharacterCount,
			customCountLength,
			matchTransitionWordsHelper,
			findMultiWordKeyphraseInPageTitle,
		} );

		Object.assign( this.defaultResearches, {
			morphology,
			keyphraseLength: getKeyphraseLength,
		} );
	}
}
