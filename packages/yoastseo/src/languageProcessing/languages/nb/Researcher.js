import AbstractResearcher from "../../AbstractResearcher";

// All config
import functionWords from "./config/functionWords";

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

		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoice;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.findTransitionWords;

		Object.assign( this.config, {
			language: "nb",
			functionWords,
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
