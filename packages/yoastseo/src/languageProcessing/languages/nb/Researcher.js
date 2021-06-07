import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import firstWordExceptions from "./config/firstWordExceptions";
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

		// Delete Flesch Reading Ease research since Norwegian doesn't have the support for it
		delete this.defaultResearches.getFleschReadingScore;
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.findTransitionWords;

		Object.assign( this.config, {
			language: "nb",
			functionWords,
			firstWordExceptions
		} );

		Object.assign( this.helpers, {
			getStemmer,
		} );
	}
}
