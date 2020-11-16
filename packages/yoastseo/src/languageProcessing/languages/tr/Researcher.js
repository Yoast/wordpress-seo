import AbstractResearcher from "../../AbstractResearcher";

// All helpers
import getStemmer from "../../helpers/morphology/baseStemmer";

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

		// Deletes researches that are currently not available in Turkish.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoice;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.stopWordsInKeyword;
		delete this.defaultResearches.stopWordsInUrl;
		delete this.defaultResearches.findTransitionWords;

		Object.assign( this.config, {
			language: "tr",
			functionWords: [],
		} );

		Object.assign( this.config, {
			getStemmer,
		} );
	}
}
