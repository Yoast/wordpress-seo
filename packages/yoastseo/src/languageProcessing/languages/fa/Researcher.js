import AbstractResearcher from "../../AbstractResearcher";

// All config
import functionWords from "./config/functionWords";

// All helpers
import createBasicWordForms from "./helpers/createBasicWordForms";
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

		// Delete the researches from the Abstract Researcher that currently are not available for Farsi.
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.findTransitionWords;
		delete this.defaultResearches.getPassiveVoice;
		delete this.defaultResearches.getSentenceBeginnings;
		delete this.defaultResearches.stopWordsInKeyword;

		Object.assign( this.config, {
			language: "fa",
			functionWords,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
		} );
	}
}
