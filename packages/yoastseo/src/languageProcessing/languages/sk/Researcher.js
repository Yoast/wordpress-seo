import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords";
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

		Object.assign( this.config, {
			language: "sk",
			functionWords,
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
