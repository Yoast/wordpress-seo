import AbstractResearcher from "../../AbstractResearcher";

// All config
import functionWords from "./config/functionWords";

// All helpers
import createBasicWordForms from "./helpers/createBasicWordForms";
import { baseStemmer as getStemmer } from "../../helpers/morphology/baseStemmer";

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

		// Deletes researches that are currently not available in Hebrew.
		// When the research is available, this line should be removed.
		delete this.defaultResearches.findTransitionWords;
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoice;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.stopWordsInKeyword;
		delete this.defaultResearches.stopWordsInUrl;

		Object.assign( this.config, {
			language: "he",
			functionWords,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
		} );
	}
}
