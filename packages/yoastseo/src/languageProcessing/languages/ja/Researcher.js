import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All helpers
import getStemmer from "./helpers/getStemmer";
import matchWordCustomHelper from "./helpers/matchTextWithWord";
import getWordsCustomHelper from "./helpers/getWords";
import wordsCharacterCount from "./helpers/wordsCharacterCount";
import findMultiWordKeyphraseInPageTitle from "./helpers/findExactMatchMultiWordKeyphraseInTitle"

// All config
import functionWords from "./config/functionWords";

// All custom researches
import getKeywordDensity from "./customResearches/getKeywordDensity";

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
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.findTransitionWords;
		delete this.defaultResearches.getKeywordDensity;

		// Adds the Japanese custom research to calculate the keyword density.
		this.addResearch( "getKeywordDensity", getKeywordDensity );

		Object.assign( this.config, {
			language: "ja",
			functionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			matchWordCustomHelper,
			getWordsCustomHelper,
			wordsCharacterCount,
			findMultiWordKeyphraseInPageTitle,
		} );
	}
}
