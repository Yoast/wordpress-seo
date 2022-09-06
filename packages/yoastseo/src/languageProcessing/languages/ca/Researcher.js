import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";
import sentenceLength from "./config/sentenceLength";

// All helpers
import getStemmer from "./helpers/getStemmer";

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

		// Deletes researches that are currently not available in Catalan.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.functionWordsInKeyphrase;
		delete this.defaultResearches.wordComplexity;

		Object.assign( this.config, {
			language: "ca",
			functionWords: [],
			transitionWords,
			twoPartTransitionWords,
			sentenceLength,
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
