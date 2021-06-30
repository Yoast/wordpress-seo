import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import { allWords as transitionWords } from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

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

		// Deletes researches that are currently not available in Slovak.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.functionWordsInKeyphrase;

		Object.assign( this.config, {
			language: "sk",
			// The function words is set to an empty array for now. Once the function words are implemented,
			// This should be set to the actual array of the function words.
			functionWords: [],
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
