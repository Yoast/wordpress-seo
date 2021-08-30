import { languageProcessing } from "yoastseo";
const { AbstractResearcher } = languageProcessing;

// All config
import functionWords from "./config/functionWords";
import transitionWords from "./config/transitionWords";
import twoPartTransitionWords from "./config/twoPartTransitionWords";

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
		delete this.defaultResearches.getPassiveVoiceResult;
		delete this.defaultResearches.getSentenceBeginnings;

		Object.assign( this.config, {
			language: "fa",
			functionWords,
			transitionWords,
			twoPartTransitionWords,
		} );

		Object.assign( this.helpers, {
			createBasicWordForms,
			getStemmer,
		} );
	}
}
