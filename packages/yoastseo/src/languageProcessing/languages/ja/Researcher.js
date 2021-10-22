import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All helpers
import getStemmer from "./helpers/getStemmer";
import matchWordCustomHelper from "./helpers/matchTextWithWord";

// All config
import functionWords from "./config/functionWords";

// Custom Researches
import getParagraphLength from "./customResearches/getParagraphLength";

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
		delete this.defaultResearches.getParagraphLength;

		Object.assign( this.config, {
			language: "ja",
			functionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
			matchWordCustomHelper,
		} );
	}
}
