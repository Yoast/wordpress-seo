import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All helpers
import getStemmer from "./helpers/getStemmer";
import matchWordCustomHelper from "./helpers/matchTextWithWord";
import getWords from "./helpers/getWords";
import findMultiWordKeyphraseInPageTitle from "./helpers/findExactMatchMultiWordKeyphraseInTitle"

// All config
import functionWords from "./config/functionWords";

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
		delete this.defaultResearches.functionWordsInKeyphrase;

		Object.assign( this.config, {
			language: "ja",
			functionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			matchWordCustomHelper,
			getWords,
			findMultiWordKeyphraseInPageTitle,
		} );
	}
}
